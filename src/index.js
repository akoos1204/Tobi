const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ActivityType } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on("ready", async (client) => {
    try {
        setInterval(() => {

            let activities = [
                { type: 'Watching', name: `${client.commands.size} commands!`},
                { type: 'Watching', name: `${client.guilds.cache.size} servers!`},
                { type: 'Watching', name: `${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)} members!`},
                { type: 'Playing', name: `/help | @${client.user.username}`},
            ];

            const status = activities[Math.floor(Math.random() * activities.length)];

            if (status.type === 'Watching') {
                client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Watching }]});
            } else {
                client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Playing }]});
            } 
        }, 7500);
    } catch (error) {
        console.log(`Error while loading rotating status.`);
    };
});

