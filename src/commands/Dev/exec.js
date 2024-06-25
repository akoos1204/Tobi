const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const child = require("child_process");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('execute')
    .setDescription("Execute anything in the terminal.")
    .addStringOption(option => option.setName('command').setDescription('The command to execute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("DarkGrey")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true});
        }

        if(interaction.member.id !== process.env.devid) return await interaction.reply({ content: "You don't have permission to use this command", ephemeral: true});

        const { options } = interaction;

        var command = options.getString('command');
        var output;

        try {
            output = await child.exec(command);
        } catch (error) {
            output = error.toString();
        }

        var replyString = `**Input:**\n\`\`\`js\n${command}\n\`\`\`\n**Output:**\n\`\`\`js\n${output}\n\`\`\``;

        if (interaction.replied) {
            const embed = new EmbedBuilder()
            .setDescription(replyString);

            await interaction.editReply({ content: ``, embeds: [embed], ephemeral: true});
        } else {
            await sendMessage(replyString);
        }

        child.exec(command, (err, res) => {
            if(err) return console.log(err);
            interaction.editReply({ content: `Succesfully executed!`, ephemeral: true});
        })
    }
}