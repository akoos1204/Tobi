const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const sourcebin = require("sourcebin_js");
  
module.exports = {
  data: new SlashCommandBuilder()
  .setName("serverlist")
  .setDescription("Dump's the list of the server that Tobi is in.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    try {
      const serverDetails = [];

      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          try {
            const invites = await guild.invites.fetch();
            const invite = invites.find((invite) => !invite.temporary);
            const owner = await guild.members.fetch(guild.ownerId);

            serverDetails.push({
              name: guild.name,
              memberCount: guild.memberCount,
              createdAt: guild.createdAt.toDateString(),
              invite: invite ? invite.url : "No invite available",
              owner: owner ? owner.user.tag : "Unknown Owner",
            });
          } catch (error) {
            console.error(`Error fetching details for guild ${guild.id}:`, error);
          }
        })
      );

      serverDetails.sort((a, b) => b.memberCount - a.memberCount);

      const biggestServer = serverDetails[0];

      const embed = new EmbedBuilder()
        .setColor("DarkGrey")
        .setTitle("Server Details")
        .setDescription("Here are the details of the biggest server")
        .addFields([
          { name: 'Server Name', value: biggestServer.name },
          { name: 'Member Count', value: `${biggestServer.memberCount}` },
          { name: 'Creation Date', value: biggestServer.createdAt },
          { name: 'Invite', value: biggestServer.invite },
          { name: 'Owner', value: biggestServer.owner }
        ]);

        const formattedList = serverDetails
        .map(
          (server) => `
      Server Name:     ${server.name}
      Member Count:    ${server.memberCount}
      Creation Date:   ${server.createdAt}
      Invite:          ${server.invite}
      Owner:           ${server.owner}
      ━━━━━━━━━━━━━━━`
        )
        .join("\n");
      
      
      sourcebin
        .create([
          {
            name: `Server List`,
            content: formattedList,
            languageId: "plaintext",
          },
        ])
        .then((src) => {
          interaction.reply({
            content: `All Server Details - ${src.url}`,
            embeds: [embed],
            ephemeral: true,
          });
        })
        .catch((error) => {
          console.error("Error creating sourcebin:", error);
          interaction.reply({ content: "Error occurred while generating server details.", ephemeral: true });
        });
    } catch (error) {
      console.error("Error fetching server details:", error);
      interaction.reply({ content: "Error occurred while fetching server details.", ephemeral: true });
    }
  },
};