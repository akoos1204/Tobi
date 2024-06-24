const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('userinfo')   
    .setDescription(`Find information about a user in the guild`)
    .setDMPermission(false)
    .addUserOption(option => option.setName('user').setDescription(`The user you want to get information about`).setRequired(false)),
    async execute(interaction) {
        try {

            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const userAvatar = user.displayAvatarURL({ size: 32 });
            const badges = user.flags.toArray().join(', ');
            const botStatus = user.bot ? 'Yes' : 'No';
            
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Information`) 
                .setColor('DarkGrey')
                .setThumbnail(userAvatar)
                .addFields({
                    name: `Joined Discord`,
                    value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
                    inline: true
                })
                .addFields({
                    name: `Joined Server`,
                    value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
                    inline: true
                })
                .addFields({
                    name: `Boosted Server`,
                    value: member.premiumSince ? 'Yes' : 'No',
                    inline: false
                })
                .addFields({ 
                    name: 'BOT',
                    value: botStatus,
                    inline: false
                })
                .setTimestamp()
                .setFooter({ text: `User ID: ${user.id}`})

            await interaction.reply({ embeds: [embed], ephemeral: true });
            
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `An error occurred while executing the command.`, ephemeral: true});
        }
    }
}