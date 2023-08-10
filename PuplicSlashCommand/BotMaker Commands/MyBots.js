const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { Database } = require("st.db");

const BOTMAKERDB = new Database("/Json-tokens/Tokens.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("my-bots")
        .setDescription("Return a list of your bots")
        .addStringOption((user) =>
            user.setName("type")
                .setDescription("Bot Type")
                .setRequired(true)
                .addChoices(
                    { name: `Autoline`, value: `autoline` },
                    { name: `Suggestion`, value: `suggestion` },
                    { name: `Auto-Tax`, value: `tax` },
                    { name: `Bank`, value: `bank` },
                    { name: `Ticket`, value: `ticket` },
                    { name: `System`, value: `system` },
                    { name: `Brodcast`, value: `brodcast` },
                    { name: `Scammer-Checker`, value: `scammer` },
                    { name: `Giveaway`, value: `giveaway` },
                    { name: `Probot`, value: `probot` },
                )
        )
        .addUserOption((user) =>
            user.setName("user")
                .setDescription("Mention the user")
                .setRequired(false)
        ),
    botPermission: [],
    authorPermission: [],
    ownerOnly: false,
    async run(client, interaction) {

        try {
            const Type = interaction.options.getString("type");
            const userOption = interaction.options.getUser("user")
            const user = userOption ? userOption : interaction.user;

            const database = BOTMAKERDB.get(`${Type}`);
            if(database){
                const DB = database.filter(da => da.owner === user.id);

                if (DB.length === 0) {
                    await interaction.reply(`😞 **${user.username}** has no bots of type ${Type}.`);
                    return;
                }
    
                const PAGE_SIZE = 3;
                const totalPages = Math.ceil(DB.length / PAGE_SIZE);
                let page = 1;
    
                const Embed = new MessageEmbed()
                    .setTitle(`${Type}`)
                    .setColor(interaction.guild.me.displayHexColor)
                    .setFooter(`📃 Page ${page}/${totalPages}`)
    
                DB.slice(0, PAGE_SIZE).forEach(bot => {
                    Embed.addFields({name:`🆔 ${bot.BotID}`,value: `💡 **${bot.prefix}**\n👑 <@!${bot.owner}> (\`${bot.owner}\`)`,inline: true});
                });
    
                const prevButton = new MessageButton()
                    .setCustomId("prev")
                    .setLabel("⬅")
                    .setStyle("PRIMARY")
                    .setDisabled(true);
    
                const nextButton = new MessageButton()
                    .setCustomId("next")
                    .setLabel("➡")
                    .setStyle("PRIMARY")
                    .setDisabled(totalPages === 1);
    
                const row = new MessageActionRow()
                    .addComponents(prevButton, nextButton);
    
                const message = await interaction.reply({embeds: [Embed], components: [row]});
    
                const filter = (buttonInteraction) => {
                    return buttonInteraction.user.id === interaction.user.id;
                };
    
                const collector = message.createMessageComponentCollector({ filter, time: 120000 });
    
                collector.on("collect", async (buttonInteraction) => {
                    if (buttonInteraction.customId === "prev") {
                        page--;
                    } else if (buttonInteraction.customId === "next") {
                        page++;
                    }
    
                    if (page < 1) {
                        page = 1;
                    } else if (page > totalPages) {
                        page = totalPages;
                    }
    
                    const start = (page - 1) * PAGE_SIZE;
                    const end = start + PAGE_SIZE;
    
                    Embed
                        .spliceFields(0, PAGE_SIZE)
                        .setTitle(`${Type}`)
                        .setColor(interaction.guild.me.displayHexColor)
                        .setFooter(`📃 Page ${page}/${totalPages}`)
    
                    DB.slice(start, end).forEach(bot => {
                        Embed.addFields({name:`🆔 ${bot.BotID}`,value: `💡 **${bot.prefix}**\n👑 <@!${bot.owner}> (\`${bot.owner}\`)`,inline: true});
                    });
    
                    prevButton.setDisabled(page === 1);
                    nextButton.setDisabled(page === totalPages);
    
                    await buttonInteraction.update({embeds: [Embed], components: [row]});
                });
    
                collector.on("end", async () => {
                    prevButton.setDisabled(true).setStyle("DANGER")
                    nextButton.setDisabled(true).setStyle("DANGER")
                    row.components.forEach(component => component.setDisabled(true));
                    await message.edit({components: [row]});
                });
            }else{
                interaction.reply(`[x] لا يوجد بيانات`)
            }
        } catch (error) {
            console.log(error);
            await interaction.reply("An error occurred.");
        }
    },
};