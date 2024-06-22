const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle, Embed} = require("discord.js");
const { execute } = require("../Dev/eval");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge messages up to 99")
    .setDMPermission(false)
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages you want to delete').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true})

        let number = interaction.options.getInteger('amount');

        const embed = new EmbedBuilder()
        .setColor("DarkGrey")
        .setDescription(`Succesfully deleted ${number} messages`)

        await interaction.channel.bulkDelete(number)

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('purge')
            .setEmoji('🧹')
            .setStyle(ButtonStyle.Primary),
        )

        const message = await interaction.reply({ embeds: [embed], ephemeral: true})

        const collector = message.createMessageComponentCollector();

        collector.on("collect", async i => {
            if(i.customId === "purge") {
                if (!i.member.permission.has(PermissionsBitField.Flags.ManageMessages)) return;

                interaction.deleteReply();
            }
        })
    }
}