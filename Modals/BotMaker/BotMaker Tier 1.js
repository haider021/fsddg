const { Client, Collection, MessageActionRow, MessageButton, WebhookClient, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const client = require(`../../index`)
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');
const os = require('os-utils');

const path = require('path');
const { readdirSync } = require("fs");
const _ = require('lodash');

const { Database } = require("st.db")
const BotMakerDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const BOTMAKERDBSubTime = new Database("/Json-db/BotMaker/BotMakerSubTime.json");
const BotMakerSub = new Database("/Json-db/BotMaker/BotMakerSub.json")
const BOTMAKERDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const prefixDB = new Database("/Json-db/Others/PrefixDB.json")
const ownerDB = new Database("/Json-db/Others/OwnerDB.json")

const BOTMAKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSub")
const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");

const db2 = new Database("/Json-tokens/Tokens.json");

const { REST } = require("@discordjs/rest");
const { Routes, ChannelType } = require("discord-api-types/v9");

const db4 = new Database("/Json-db/Others/Number-of-tokens.json");
const BotToken = new Database('/Json-tokens/BotMaker_Tokens.json');

const sourcebin = require('sourcebin_js');

const { CoderServer, selllogsch } = require('../../config.json');

module.exports = {
    name: "BOTMAKERSUB_Tier1_MODAL",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, interaction, args, config) => {
        try {
            const check = BotMakerSub.get(`AllowedServers_${client.user.id}`) || []

            const SUB_ID = db4.get(`SUB_ID`) || 1;

            const client_role = BotMakerDB.get(`ClientRole_${interaction.guild.id}`)
            const channel = BotMakerDB.get(`SellsLog_${interaction.guild.id}`)
            const logchannel = await client.channels.cache.get(channel);

            const ID = interaction.fields.getTextInputValue("Server_ID");

            if (ID === 1102027278646513724 || ID === "1102027278646513724") return interaction.reply(`لا يمكنك شراء اشتراك للسيرفر الاساسي`)
            if (check.includes(ID)) return interaction.reply(`هذا السيرفر مشترك في بوت ميكر بالفعل !`)

 
            const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const endTime = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

            let owner = interaction.user.id;

            const invite_Button = new MessageActionRow().addComponents([
                new MessageButton()
                    .setStyle(`LINK`)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    .setLabel(`invite`)
                    .setDisabled(false),
            ]);

            interaction.reply({
                content: `***تم الاشتراك بنجاح***
        *الاشتراك يبدا من الان قم بادخال البوت الي سيرفرك عن طريق الضغط علي الزر*`,
                components: [invite_Button]
            }).then(() => {
                db4.set(`SUB_ID`, SUB_ID + 1);
            });//تعديل

            if (client_role) {
                try {
                    const role = interaction.guild.roles.cache.find(
                        (r) => r.id === client_role
                    );
                    await interaction.member.roles.add(role)
                } catch (error) {
                    console.log(`I cant find client role in BotMaker`)//تعديل
                }
            }

            const buyer = interaction.user;
            const buyerembed = new MessageEmbed()
                .setColor(`#d5d5d5`)
                .setTitle(`__BotMaker Tier 1 Subscribe___`)
                .setDescription(
                    `**لقد قمت بالاشتراك في Coder BotMaker
            مده الاشتراك 30 يوم!**
            **WhiteListID :**\`${SUB_ID}\`
            *تستخدم هذا الكود في تجديد اشتراك البوت*`
                );//تعديل
            buyer
                .send({
                    embeds: [buyerembed],
                    components: [invite_Button]
                })
                .catch(async (error) => {
                    return console.log(error.message);
                });
            if (logchannel && logchannel.type === 'GUILD_TEXT') {
                try {
                    logchannel.send(
                        `BotMaker Tier 1 1 Month\\Subscription has been purchased by **${buyer.username}**`
                    );
                } catch (error) {
                    console.log(`I cant find sells log channel in BotMaker`)//تعديل
                }
            }

            BotMakerSub.push(`AllowedServers_${client.user.id}`, ID)
                .then(() => {
                    BOTMAKERDBSubTime.push(`TIMELEFTSUB`, {
                        serverId: ID,
                        owner: owner,
                        Whitelist: SUB_ID,
                        Type: "BotMaker Tier 1",
                        startTime: startTime,
                        endTime: endTime
                    }).then(()=>{
                        interaction.message.delete();
                      })
                })
        } catch (error) {
            console.log(error)
        }
    }
}