const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require ('discord.js');
const fs = require ('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all commands or info.'),

    async execute(interaction, client) {
        const emojis = {
            community: '📨',
            dev: '🕳️',
            moderation: '🔨',
        }

        const commandFolders = fs.readdirSync('./src/commands').filter(folder => !folder.startsWith('.'));
        const commandsByCategory = {};

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            const commands = [];

            for (const file of commandFiles) {
                const { default: command } = await import(`./../${folder}/${file}`);
                commands.push({ name: command.data.name, description: command.data.description });
            }

            commandsByCategory[folder] = commands;
        }

        const dropdownOptions = Object.keys(commandsByCategory).map(folder => ({
            label: folder,
            value: folder
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category-select')
            .setPlaceholder('Select a category')
            .addOptions(...dropdownOptions.map(option => ({
                label: option.label,
                value: option.value,
                emoji: emojis[option.label.toLowerCase()]
            })));

        const embed = new EmbedBuilder()
            .setColor("DarkGrey")
            .setTitle('Command - Help')
            .setDescription('Select a category from the dropdown menu to view commands')
            .setThumbnail(`${client.user.displayAvatarURL()}`)

            const row = new ActionRowBuilder()
			.addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.isStringSelectMenu() && i.customId === 'category-select';
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            const selectedCategory = i.values[0];
            const categoryCommands = commandsByCategory[selectedCategory];

            const categoryEmbed = new EmbedBuilder()
                //.setColor("DarkGrey")
                .setTitle(`${selectedCategory} commands`)
                .setDescription('Here are the list of commands')
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .addFields(categoryCommands.map(command => ({
                    name: `\`${command.name}\``,
                    value: command.description,
                    inline: true,
                })));

            await i.update({ embeds: [categoryEmbed], ephemeral: true });
        });
    }
};
