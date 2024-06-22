const { SlashCommandBuilder, EmbedBuilder,} = require("discord.js");
const country = require("countryjs");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("country")
    .setDescription("Get information about a country.")
    .addStringOption((option) => option.setName('name').setDescription('The name of the country').setRequired(true)),
    async execute (interaction, client) {
        const info = interaction.options.getString("name");
        const inf = country.info(info, 'name');


        if (!inf) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`An error occurred`)
                    .setColor(client.config.colors[0].red)
                    .setDescription("```\nOops! Something went wrong...\n\nPossible reasons:\n• The country is not a member of the United Nations\n• The country is not independent yet\n• The country does not exist```")
                ], ephemeral: true
            });
        }
        try {
            const countryName = country.name(info, 'name');
            const apiUrl = `https://api.api-ninjas.com/v1/country?name=${countryName}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    'X-Api-Key': process.env.ninjakey
                }
            });
            const placeholder = response.data[0];
            const gdpGrowth = placeholder.gdp_growth;
            const gdpCapita = placeholder.gdp_per_capita;
            const popDensity = placeholder.pop_density;
            const currencyName = placeholder.currency.name;
			const popGrowth = placeholder.pop_growth;
            const ISOcodes = await country.ISOcodes(info, 'name');
            const pop = country.population(info, 'name').toLocaleString('en-US');
            const area = country.area(info, 'name').toLocaleString('en-US');
            const callingCode = country.callingCodes(info, 'name') || "Unknown";
            const region = country.region(info, 'name') || "Unknown";
            const subregion = country.subregion(info, 'name') || "Unknown";
            const currencies = country.currencies(info, 'name').join(", ") || "???";
            const capital = country.capital(info, 'name') || "Unknown";
            const alpha2 = ISOcodes.alpha2.toLowerCase();
            const isoCodeAlpha3 = ISOcodes.alpha3.toUpperCase();
            let timezone;

            if (!country.timezones(info, 'name')) {
                timezone = "Unknown"
            } else if (country.timezones(info, 'name')) {
                timezone = country.timezones(info, 'name').join(", ")
            }

            let provinces = country.provinces(info, 'name').join(", ");
            if (provinces.length > 1024) {
                provinces = provinces.slice(0, 1021) + "...";
            }


            const embed = new EmbedBuilder()
                .setTitle(`${countryName}`)
                .setColor("DarkGrey")
                .setThumbnail(`https://flagcdn.com/w320/${alpha2}.png`)
                .addFields({
                    name: 'Name',
                    value: `${country.name(info, 'name') || "Unknown"} [${isoCodeAlpha3 || "???"}]`,
                    inline: true
                }, {
                    name: 'Area',
                    value: `${area || "Unknown"} km²`,
                    inline: true
                }, {
                    name: 'Population',
                    value: `${pop || "Unknown"}`,
                    inline: true
                }, {
                    name: 'Population Density',
                    value: `${popDensity + " people/km²"|| "Unknown"}`,
                    inline: true
                }, {
                    name: 'Population Growth',
                    value: `${popGrowth}`,
                    inline: true
                }, {
                    name: 'Capital',
                    value: `${capital}`,
                    inline: true
                }, {
                    name: 'Region',
                    value: `${region} (${subregion})`,
                    inline: true
                }, {
                    name: 'Calling Code',
                    value: `+${callingCode}`,
                    inline: true
                }, {
                    name: 'Currency',
                    value: `${currencyName} [${currencies}]`,
                    inline: true
                }, {
                    name: 'Timezone',
                    value: `${timezone || "Unknown"}`,
                    inline: true
                }, {
                    name: 'GDP Growth',
                    value: `${gdpGrowth + "%" || "Unknown"}`,
                    inline: true
                }, {
                    name: 'GDP Per Capita',
                    value: `${"$" + gdpCapita || "Unknown"}`,
                    inline: true
                }, {
                    name: 'Provinces',
                    value: `${provinces || "Unknown"}`,
                    inline: false
                }, );

            interaction.reply({ embeds: [embed], ephemeral: true});
        } catch (error) {
            console.error('Error:', error);
        }
    }
}