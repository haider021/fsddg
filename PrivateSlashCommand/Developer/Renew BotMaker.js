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
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Database } = require('st.db');
const moment = require('moment');
const ms = require('ms');
const BOTMAKERDB = new Database("/Json-db/BotMaker/BotMakerSubTime.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`renew-subscription`)
        .setDescription(`Renew BotMaker subscription`)
        .addStringOption(id => id
            .setName(`subscription-id`)
            .setDescription(`Type the subscription ID`)
            .setRequired(true))

        .addStringOption(days => days
            .setName(`days`)
            .setDescription(`Type howmuch days you like to add to the subscription`)
            .setRequired(true)),
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: true,
    async run(client, interaction) {

        try {
            const channelID = BOTMAKERDB.get(`SellsLog_${interaction.guild.id}`);
            const logchannel = await client.channels.cache.get(channelID)
            let SubscriptionID = interaction.options.getString('subscription-id')
            let Days = interaction.options.getString('days')
            const DB = await BOTMAKERDB.get('TIMELEFTSUB');

            if(DB.length === 0){
                interaction.reply(`[x] لا يوجد بيانات`)
            }else{
                const botData = DB.find(botData => botData.Whitelist === parseInt(SubscriptionID) || botData.serverId === SubscriptionID)
                if(botData){
                    const endsTime = moment(botData.endTime).add(parseInt(Days), 'days').format('YYYY-MM-DD HH:mm:ss');

                    botData.endTime = endsTime

                    BOTMAKERDB.set('TIMELEFTSUB', DB).then(() => {
                        interaction.reply({
                            content: `- **تم تجديد الاشتراك بنجاح**
                        - **ايدي الاشتراك المستخدم :** ${SubscriptionID}
                        - **عدد الايام المضافه :** ${Days}`
                        }).then(async () => {
                            if (logchannel && logchannel.type === 'GUILD_TEXT') {
                                try {
                                            const owner = botData.owner
                                            logchannel.send(
                                                `BotMaker Subscription has been renewed **Subscription owner:** <@!${owner}> **Added \`${Days}\`days to his Subscription**.`
                                            );

                                } catch (error) {
                                    console.log(error)//تعديل
                                }
                            }
                        })
                    })
                }
            }

        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};