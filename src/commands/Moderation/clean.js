const { ButtonBuilder, Message, PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('purge')
		.setDescription("Purge up to 99 messages")
        .addIntegerOption(option => option.setName('amount').setDescription("Amount of messages to delete").setMinValue(0).setMaxValue(99).setRequired(true)),
	async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');
        if (amount == 0) {return interaction.reply({ content: "0? Really? Please choose another number.", ephemeral: true})}
        const user = interaction.options.getUser('user');
        const whole_server = interaction.options.getBoolean('whole_server');
        const channel = interaction.options.getChannel('channel');

        try{
            const cha = await client.channels.cache.get(interaction.channel.id) 
            if (whole_server == true) {

            } else if (user == null && whole_server == null && channel !== null) {
                const deletec = client.channels.cache.get(channel.id) 
                await deletec.bulkDelete(amount).catch(error => {console.error(error)})
                return interaction.reply({ content: `\`${amount}\`` + " messages deleted from #"+ channel.name})
            } else if (channel == null && whole_server == null && user !== null) {
                const userMessages = (await interaction.channel.messages.fetch()).filter((m) => m.author.id === user.id);
                let target = []
                await interaction.channel.messages.fetch().then((mes) => { 
                    mes.filter(m => m.author.id === user.id).forEach(m => target.push(m))
                    console.log(target)
                    target.slice(0, amount)
                    let messages = Array.from(target.values());
                    for (let message of messages) {
                        message.delete();
                    }
                })
                return interaction.reply({ content: `\`${amount}\`` + " messages deleted from " + user.tag, ephemeral: true})
            } else if (user == null && whole_server == null && channel == null) {
                await interaction.channel.bulkDelete(amount)
                return interaction.reply({ content: `\`${amount}\`` + " messages deleted from this channel", ephemeral: true})
            } else {
                return interaction.reply({ content: "Something went wrong, try with other settings", ephemeral: true})
            }
        } catch (e) {
            console.log("Clean error: ", e)
        }
	},
};