const { Interaction } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

            if (command.permissions) {
                if (interaction.guild && interaction.channel.permissionsFor(interaction.member).has(command.permissions)) { r=true } else { r=false }
                if (!r || interaction.channel.type === ChannelType.DM) {console.log(`[${new Date().toLocaleString('hu-HU')}] `+"Not enough permission, what was the plan?"); return interaction.reply({content: "You do not have the required permissions to execute this command. => `"+command.permissions+"`", ephemeral: true})}
            }   

        if (!command) return
        
        try{


            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
    


};