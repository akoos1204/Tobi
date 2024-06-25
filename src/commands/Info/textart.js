const { SlashCommandBuilder } = require("discord.js");
const figlet = require("figlet")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('text-art')
    .setDescription("Create a text art.")
    .addStringOption(option => option.setName('text').setDescription('The text you want to format.').setRequired(true)),
    async execute(interaction) {

        const { options } = interaction;

        figlet.text(
            options.getString('text'),
            {
                font: "ANSI Regular",
            },
            async (err, data) => {
                interaction.reply({ content: `\`\`\`${data}\`\`\``, ephemeral: true});
            }
        )
    }
}