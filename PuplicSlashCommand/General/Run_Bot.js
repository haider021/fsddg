const {
    Client,
    Collection,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageSelectMenu,
    Intents,
    Modal,
    TextInputComponent
} = require("discord.js");
const { ChannelType } = require("discord-api-types/v9");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")

const { Database } = require("st.db");

const BOTMAKERDB = new Database("/Json-tokens/Tokens.json");
const runDB = new Database("/Json-db/Others/RunDB");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`run-bot`)
        .setDescription(`تشغيل بوت`)
        .addStringOption(ch => ch
            .setName(`type`)
            .setDescription(`اختار نوع البوت`)
            .addChoices(
                { name: `Autoline`, value: `autoline` },
                { name: `Suggestion`, value: `suggestion` },
                { name: `Auto-Tax`, value: `tax` },
                { name: `Credit`, value: `credit` },
                { name: `Ticket`, value: `ticket` },
                { name: `System`, value: `system` },
                { name: `Brodcast`, value: `brodcast` },
                { name: `Scammer-Checker`, value: `scammer` },
                { name: `Giveaway`, value: `giveaways` },
                { name: `Probot`, value: `probot` },
                { name: `Logs`, value: `log` },
                { name: `Feedback`, value: `feedback` },
                { name: `Shop`, value: `shop` },
            )
            .setRequired(true)
        )
        .addStringOption(ch => ch
            .setName(`bot-id`)
            .setDescription(`ايدي البوت`)
            .setRequired(true)
        )
    ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
        try {
            const type = interaction.options.getString('type')
            const ID = interaction.options.getString('bot-id')

            if(isNaN(ID)) return interaction.reply('[!] قمت بادخال ايدي البوت الخاص بك بطريقه خطأ')

            const database = BOTMAKERDB.get(`${type}`);
            if (database) {
                const DB = database.filter(da => da.CLIENTID === ID);


                if (DB.length === 0) {
                    return interaction.reply(`[x] لا استطيع ايجاد هذا البوت`);
                }

                if(interaction.user.id !== DB[0].owner && interaction.user.id !== "807814162234867734"){
                    return interaction.reply('[x] لا تستطيع استخدام الامر علي بوت لشخص اخر')
                }

                runDB.push(`Runs_${type}`,ID).then(()=>{
                    interaction.reply(`[✔] تم تشغيل بوتك بنجاح`)
                })
                
            } else {
                return interaction.reply(`[x] لا استطيع ايجاد هذا البوت`);
            }

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};