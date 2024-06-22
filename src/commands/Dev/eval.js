const {SlashCommandBuilder, EmbedBuilder, Embed} = require("discord.js");
const { execute } = require("../Moderation/clean");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription("Evaulate a javascript code(for dev's)")
    .addStringOption(option => option.setName('code').setDescription('The code to evaulate').setRequired(true)),
    async execute(interaction) {
        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("DarkGrey")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if(interaction.member.id !== process.env.devid) return await sendMessage("Only for developer's");

        const { options } = interaction;

        var code = options.getString('code');
        var output;

        try {
            output = await eval(code);
        } catch (error) {
            output = error.toString();
        }

        var replyString = `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n**Output:**\n\`\`\`js\n${output}\n\`\`\``;

        if (interaction.replied) {
            const embed = new EmbedBuilder()
            .setDescription(replyString);

            await interaction.editReply({ content: ``, embeds: [embed], ephemeral: true});
        } else {
            await sendMessage(replyString);
        }
    }
}