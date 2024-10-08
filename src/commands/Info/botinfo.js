const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const Discord = require("discord.js");
const os = require("os");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Display's the bot information in an embed."),
  async execute(interaction, client) {
    try {
      const guildsCache = client.guilds.cache;
      if (!guildsCache) {
        throw new Error("Guilds cache is not available");
      }

      let servercount = guildsCache.reduce((a, b) => a + b.memberCount, 0);

      let discordjsVersion = Discord.version;

      // variables to count with
      const dbPingStart = Date.now();
      const dbPing = Date.now() - dbPingStart;
      let totalSeconds = client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);

      //Uptime
      let uptime = `${days} days,  ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

      //Memory usage
      const memoryUsage = process.memoryUsage();
      const memoryUsed = Math.ceil(memoryUsage.rss / (1024 * 1024)); // Convert to megabytes
      const memoryTotal = Math.ceil(os.totalmem() / (1024 * 1024 * 1024)); // Convert to gigabytes

      //Cpu usage
      const usage = process.cpuUsage();
      const usagePercent = Math.ceil((usage.system / usage.user) * 100);

      const infoEmbed = new EmbedBuilder()
        .setColor("DarkGrey")
        .setTitle("Tobi's Information")
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTimestamp()
        .addFields(
          {
            name: "Basic Information",
            value: `- Developer: \`@akoos_\`\n- DevID: \`901131294476484689\`\n- Server Count: ${interaction.client.guilds.cache.size}\n- User Count: ${servercount}\n- Invite link: [Click Here](${process.env.botinvite})\n- Repository: [Github](https://github.com/akoos1204/Tobi)\n- Bot Version: \`${process.env.version}\``,
          },
          {
            name: "Statistics",
            value: `- Uptime: ${uptime}\n- API Latency: ${Math.round(
              interaction.client.ws.ping
            )}ms\n- Memory Usage: ${memoryUsed} MB\n- Memory Total: ${memoryTotal} GB\n- CPU Usage: ${usagePercent}%\n- Discord.js: \`v${discordjsVersion}\`\n- Node.js: \`${
              process.version
            }\``,
          }
        );

      await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "An error occurred while fetching bot information",
        ephemeral: true,
      });
    }
  },
};
