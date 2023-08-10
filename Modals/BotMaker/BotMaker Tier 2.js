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
const mainBot = require('../../')

module.exports = {
    name: "BOTMAKERSUB_Tier2_MODAL",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, interaction, args, config) => {
        try {
            interaction.reply(`[!] يتم معالجه المعلومات`)
            const SUB_ID = db4.get(`SUB_ID`) || 1;
            const Premuim = db4.get(`Premuim_ID`) || 1;

            const client_role = BotMakerDB.get(`ClientRole_${interaction.guild.id}`)
            const channel = BotMakerDB.get(`SellsLog_${interaction.guild.id}`)
            const logchannel = await client.channels.cache.get(channel);

            const ID = interaction.fields.getTextInputValue("Server_ID");
            const token = interaction.fields.getTextInputValue("Bot_Token");
            const prefix = interaction.fields.getTextInputValue("Bot_prefix");

            if (ID === 1102027278646513724 || ID === "1102027278646513724" || ID === interaction.guild.id) return interaction.reply(`لا يمكنك شراء اشتراك للسيرفر الاساسي`)


            const client0 = new Client({ intents: 32767 });
            client0.login(token).then(async () => {
                client0.setMaxListeners(999999)
                const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

                let owner = interaction.user.id;

                const invite_Button = new MessageActionRow().addComponents([
                    new MessageButton()
                        .setStyle(`LINK`)
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client0.user.id}&permissions=8&scope=bot%20applications.commands`)
                        .setLabel(`invite`)
                        .setDisabled(false),
                ]);

                    db4.set(`SUB_ID`, SUB_ID + 1).then(() => {
                        db4.set(`Premuim_ID`, Premuim + 1);
                    })



                if (client_role) {
                    try {
                        const role = interaction.guild.roles.cache.find(
                            (r) => r.id === client_role
                        );
                        await interaction.member.roles.add(role)
                    } catch (error) {
                        console.log(`I cant find client role in BotMaker2`)//تعديل
                    }
                }

                const buyer = interaction.user;
                const buyerembed = new MessageEmbed()
                    .setColor(interaction.guild.me.displayHexColor)
                    .setTitle(`__BotMaker Tier 2 Subscribe___`)
                    .setDescription(
                        `*لقد قمت بالاشتراك في Hyphen Bot Maker*
                        - مده الاشتراك 30 يوم
                        *WhiteListID :* \`${SUB_ID}\`
                        - تستخدم هذا الكود لتجديد الاشتراك في اي وقت\n
                        *BotID :* ${client0.user.id}`
                    );
                buyer
                    .send({
                        embeds: [buyerembed],
                        components: [invite_Button]
                    })
                    .catch(async (error) => {
                        return console.log(error.message);
                    });
                    try {
                        const MainServer = mainBot.guilds.cache.get(CoderServer);
                        const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                        if (MainServerLogChannel) {
                            MainServerLogChannel.send(`Bot Maker 2 bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                if (logchannel && logchannel.type === 'GUILD_TEXT') {
                    try {
                        logchannel.send(
                            `BotMaker Tier 2 1 Month\\Subscription has been purchased by **${buyer.username}**`
                        );
                    } catch (error) {
                        console.log(`I cant find sells log channel in BotMaker2`)//تعديل
                    }
                }
                client0.commands = new Discord.Collection();
                client0.events = new Discord.Collection();
                client0.buttons = new Discord.Collection();
                client0.selectMenus = new Discord.Collection();
                client0.modlas = new Discord.Collection();
                require("../../handlers/BotMaker2_commands")(client0);
                const EventFolder = path.join(__dirname, '../../events');
                require("./handlers1/events")(client0);
                require("../../handlers/BotMaker2_Button")(client0);
                require("../../handlers/BotMaker2_selectMenus")(client0);
                require("../../handlers/BotMaker2_Modlas")(client0);


                // =================Dev=================
                //Whitelist System
                client0.on("guildCreate", async (guild) => {
                    const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client0.user.id}`);
                    if (!subs.includes(guild.id) &&
                        guild.id !== "1077593691247620097" &&
                        guild.id !== "1102027278646513724" &&
                        guild.id !== "1071040653678608414") {
                        guild.leave()
                    }
                });

                //guildCreate
                client0.on("guildCreate", async (guild) => {
                    const owner = await client0.users.fetch(guild.ownerId);
                    const ownerUsername = owner ? owner.username : "Unknown";
                    const targetGuildId = CoderServer;
                    const targetChannelId = join_leavelog;
                    const targetGuild = mainBot.guilds.cache.get(targetGuildId);
                    const targetChannel = targetGuild.channels.cache.get(targetChannelId);

                    const joinsEmbed = new MessageEmbed()
                        .setTitle("Bot Maker Tier 2")
                        .setColor("GREEN")
                        .setDescription(`Joined: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}\nPremuimID: ${bot.Premuim} \nBot ID: ${client0.user.id}`);

                    targetChannel.send({ embeds: [joinsEmbed] });
                });

                //GuildDelete
                client0.on("guildDelete", async (guild) => {
                    const owner = await client0.users.fetch(guild.ownerId);
                    const ownerUsername = owner ? owner.username : "Unknown";
                    const targetGuildId = CoderServer;
                    const targetChannelId = join_leavelog;
                    const targetGuild = mainBot.guilds.cache.get(targetGuildId);
                    const targetChannel = targetGuild.channels.cache.get(targetChannelId);

                    const leavesEmbed = new MessageEmbed()
                        .setTitle("Bot Maker Tier 2")
                        .setColor("RED")
                        .setDescription(`Left: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}\nPremuimID: ${bot.Premuim} \nBot ID: ${client0.user.id}`);

                    targetChannel.send({ embeds: [leavesEmbed] });
                });

                client0.on('ready', () => {
                    const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client0.user.id}`);
                    client0.guilds.cache.forEach((guild) => {
                        if (!subs.includes(guild.id) && guild.id !== '1077593691247620097' && guild.id !== '1102027278646513724') {
                            if (guild) {
                                return guild.leave().catch(err => { })
                            }
                        }
                    });
                });
                // =================require Dev=================


                BotMakerSub.push(`AllowedServers_${client0.user.id}`, ID)
                    .then(() => {
                        BOTMAKERDBSubTime.push(`TIMELEFTSUB`, {
                            serverId: ID,
                            owner: owner,
                            Whitelist: SUB_ID,
                            Type: "BotMaker Tier 2",
                            startTime: startTime,
                            endTime: endTime
                        })
                    }).then(() => {
                        BotToken.push(`tokens_Tier_2`, {
                            token: token,
                            CLIENTID: client0.user.id,
                            Premuim: Premuim
                        })
                    }).then(() => {
                        prefixDB.set(`Prefix_${client0.user.id}_Premuim`, prefix).then(() => {
                            ownerDB.set(`Owner_${client0.user.id}_Premuim`, interaction.user.id)
                        }).then(() => {
                            interaction.message.delete();
                        })
                    })

            }).catch((error) => {
                console.log(error)
                return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
            })
            client0.on('ready', () => {
                const timers = 2;
                const timeing = Math.floor(timers * 1000);
                let statusIndex = 0;
                setInterval(() => {
                    os.cpuUsage((cpuUsage) => {
                        const ramUsage = os.freememPercentage() * 100;

                        const statuses = [
                            `${(cpuUsage * 100).toFixed(2)}% CPU Usage`,
                            `${ramUsage.toFixed(2)}% RAM Usage`,
                        ];

                        client0.user.setActivity(statuses[statusIndex], {
                            type: 'COMPETING',
                            url: 'https://www.twitch.tv/Coder',
                        });
                        client0.user.setPresence({
                            status: "online",
                        });
                        statusIndex = (statusIndex + 1) % statuses.length;
                    });
                }, timeing);
            });

            client0.on("ready", async () => {
                const rest = new REST({ version: '9' }).setToken(token);
                (async () => {
                    try {
                        await rest.put(Routes.applicationCommands(client0.user.id), {
                            body: slashcommands,
                        });

                    } catch (error) {
                        console.error(error.message);
                    }
                })();
            });

            client0.slashcommands = new Collection();
            const slashcommands = [];

            const SlashFolder = path.join(__dirname, '../../BotMaker Tier 2 SlashCommands');

            const ascii = require('ascii-table');
            const table = new ascii('BotMaker2-commands').setJustify();
            for (let folder of readdirSync(`${SlashFolder}/`).filter(folder => !folder.includes('.'))) {
                for (let file of readdirSync(`${SlashFolder}/` + folder).filter(f => f.endsWith('.js'))) {
                    let command = require(`${SlashFolder}/${folder}/${file}`);
                    if (command) {
                        slashcommands.push(command.data);
                        client0.slashcommands.set(command.data.name, command);
                        if (command.data.name) {
                            table.addRow(`/${command.data.name}`, '🟢 Working');
                        } else {
                            table.addRow(`/${command.data.name}`, '🔴 Not Working');
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}