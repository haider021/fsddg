const { Discord } = require('discord.js');
const client = require(`../../index`)
const { Client, MessageActionRow, MessageButton, MessageEmbed, Collection, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const { Database } = require("st.db")
const path = require('path');
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const db2 = new Database("/Json-tokens/Tokens.json");


const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const db4 = new Database("/Json-db/Others/Number-of-tokens.json");
const prefixDB = new Database("/Json-db/Others/PrefixDB.json");
const ownerDB = new Database("/Json-db/Others/OwnerDB.json");

const { CoderServer, selllogsch } = require('../../config.json');
const mainBot = require('../../')

const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');
const ms = require('ms');
const internal = require("stream")

module.exports = {
    name: "Shop_MODAL",
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
            const ShopID = db4.get(`Shop_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const jsonDB = new Database("/Json-db/Bots/ShopDB.json")
            const shopdb = require("../../Schema/BotsDB/Shop")

            const client12 = new Client({ intents: 32767 });
            client12.login(token)
                .then(async () => {
                    db4.set(`Shop_ID`, ShopID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client12.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Shop bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Shop bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${ShopID}\`\n`
                        );
                    buyer
                        .send({ embeds: [buyerembed], components: [invite_Button] })
                        .catch(async (error) => {
                            return console.log(error.message);
                        });
                    const Delembed = new MessageEmbed()
                        .setColor(interaction.guild.me.displayHexColor)
                        .setDescription(
                            `__**The Ticket will be deleted in \`10\` seconds**__`
                        );
                    interaction.channel.send({ embeds: [Delembed] })
                        .then((timeembed) => {
                            setTimeout(() => interaction.channel.delete().catch(err => { }), 10000);
                        })
                    if (client_role) {
                        try {
                            const role = interaction.guild.roles.cache.find(
                                (r) => r.id === client_role
                            );
                            await interaction.member.roles.add(role)
                        } catch (error) {
                            console.log(`I cant find client role in Shop`)//تعديل
                        }
                    }

                    try {
                        const MainServer = mainBot.guilds.cache.get(CoderServer);
                        const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                        if (MainServerLogChannel) {
                            MainServerLogChannel.send(`Shop bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                        }
                    } catch (error) {
                        console.log(error.message)
                    }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Shop bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Shop`)//تعديل
                        }
                    }

                    client12.Shopcommands = new Collection();
                    client12.events = new Collection();
                    client12.ShopSelectmenu = new Collection();
                    require("../../handlers/Shop-commands")(client12);
                    require("../../Bots/Shop/handlers/events")(client12);
                    require("../../handlers/Shop-Selectmenu")(client12);

                    //Timers things
                    client12.on('ready', () => {
                        try {
                            //الرومات الخاصه
                            setInterval(async () => {
                                const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

                                const subscriptions = jsonDB.get(`PrivateRoom_${client12.user.id}`) || []
                                if (subscriptions) {
                                    subscriptions.forEach(async subscription => {
                                        const { owner, endsTime, channelID, message, Status, guildID } = subscription;
                                        if (moment(currentTime).isAfter(endsTime) && Status !== "true") {
                                            const server = client12.guilds.cache.get(guildID);
                                            if (!server) return
                                            const channel = server.channels.cache.get(channelID);
                                            const ownerUser = await client12.users.fetch(owner).catch(err => { });

                                            if (server && channel && ownerUser) {
                                                const embed = new MessageEmbed()
                                                    .setColor("#ff0000")
                                                    .setDescription(`[-]** مده الروم قد انتهت**`)
                                                channel.send({ content: `${ownerUser}`, embeds: [embed] }).catch(err => { });
                                                const themessage = await channel.messages.fetch(message)

                                                const endedembed = new MessageEmbed()
                                                    .setColor("YELLOW")
                                                    .setDescription(themessage.embeds[0].description)
                                                    .setTitle(`${themessage.embeds[0].title}`)
                                                    .setAuthor(ownerUser.tag, ownerUser.displayAvatarURL({ dynamic: true }))
                                                    .setFooter(server.name, server.iconURL({ dynamic: true }));

                                                themessage.edit({ embeds: [endedembed] })
                                                await channel.permissionOverwrites.edit(server.roles.everyone, { VIEW_CHANNEL: false }).catch(err => { });
                                                await channel.permissionOverwrites.edit(ownerUser, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ATTACH_FILES: false }).catch(err => { });

                                                subscription.Status = "true";

                                                jsonDB.set(`PrivateRoom_${client12.user.id}`, subscriptions);
                                            }
                                        } else {
                                        }
                                    });
                                }
                            }, 10000);
                            //فتح و غلق رومات الشوب تلقائي
                            setInterval(async () => {
                                const currentTime = moment().tz('Africa/Cairo').format('HH:mm');
                                const guildID = jsonDB.get(`Guild_${client12.user.id}`);

                                if (guildID) {
                                    const time = jsonDB.get(`Auto-open-close-shop-rooms_${guildID}`);
                                    const serverData = await shopdb.find({ guildID: guildID });

                                    const filteredServerData = serverData.filter(data => data.Setup && data.Setup.shop_rooms_category)

                                    if (serverData && filteredServerData && filteredServerData.length > 0) {
                                        const data1 = filteredServerData[0].Setup

                                        const data2 = jsonDB.get(`Shop_Rooms_${guildID}`);

                                        if (time && data2) {
                                            if (data2.length !== 0) {
                                                const { open, close, status } = time;
                                                const { shop_rooms_category, shop_mention_room } = data1;

                                                if (currentTime > open && currentTime < close && status === 'closed') {
                                                    const guild = client12.guilds.cache.get(guildID)
                                                    if (guild) {
                                                        const category = guild.channels.cache.find(c => c.id === shop_rooms_category && c.type === "GUILD_CATEGORY")
                                                        if (category) {
                                                            data2.forEach(async c => {
                                                                const role1 = c.RoleID1 || client12.user.id
                                                                const role2 = c.RoleID2 || client12.user.id
                                                                const role3 = c.RoleID3 || client12.user.id


                                                                const thechannel = await guild.channels.create(`${c.name}`, {
                                                                    type: "text",
                                                                    parent: category,
                                                                    permissionOverwrites: [
                                                                        {
                                                                            id: guild.roles.everyone.id,
                                                                            deny: ["SEND_MESSAGES"],
                                                                        },
                                                                        {
                                                                            id: role1,
                                                                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                                                        },
                                                                        {
                                                                            id: role2,
                                                                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                                                        },
                                                                        {
                                                                            id: role3,
                                                                            allow: ["SEND_MESSAGES", "ATTACH_FILES"],
                                                                        },
                                                                    ],
                                                                    topic: `${c.name}`,
                                                                })
                                                                time.status = 'opened'
                                                                jsonDB.push(`Shop_CreatedRooms_${guildID}`, thechannel.id).then(() => {
                                                                    jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                                                                })
                                                            })
                                                            const statusch = client12.channels.cache.get(shop_mention_room)
                                                            if (statusch) {
                                                                statusch.send(`تم فتح رومات الشوب\n\\@here`).then(async msg => {
                                                                    jsonDB.set(`shoprooms_status_on_${guildID}`, msg.id)
                                                                    const oldmessageID = jsonDB.get(`shoprooms_status_off_${guildID}`)
                                                                    const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                                                                    if (oldmessage && oldmessage.first()) {
                                                                        await oldmessage.first().delete().catch(err => { });
                                                                    }
                                                                }).catch(err => { console.log(`shop` + err) })
                                                            }
                                                        }
                                                    }
                                                }

                                                if (currentTime > close && currentTime > open && status === 'opened') {
                                                    const channels = jsonDB.get(`Shop_CreatedRooms_${guildID}`)
                                                    if (channels.length === 0 || !channels) return


                                                    channels.forEach(async channelId => {
                                                        const channel = client12.channels.cache.get(channelId);
                                                        if (channel) {
                                                            await channel.delete();
                                                        }
                                                        time.status = 'closed'
                                                        jsonDB.pull(`Shop_CreatedRooms_${guildID}`, channelId).then(() => {
                                                            jsonDB.set(`Auto-open-close-shop-rooms_${guildID}`, time)
                                                        })
                                                    });
                                                    const statusch = client12.channels.cache.get(shop_mention_room)
                                                    if (statusch) {
                                                        statusch.send(`تم اغلاق رومات الشوب`).then(async msg => {
                                                            jsonDB.set(`shoprooms_status_off_${guildID}`, msg.id)
                                                            const oldmessageID = jsonDB.get(`shoprooms_status_on_${guildID}`)
                                                            const oldmessage = await statusch.messages.fetch({ around: oldmessageID, limit: 1 })
                                                            if (oldmessage && oldmessage.first()) {
                                                                await oldmessage.first().delete().catch(err => { });
                                                            }
                                                        })
                                                    }
                                                }
                                            }

                                        }
                                    }
                                }


                            }, 10000);

                        } catch (error) {

                        }
                    });

                    //badWords
                    client12.on('messageCreate', async m => {
                        try {
                            const channels = jsonDB.get(`Shop_CreatedRooms_${m.guild?.id}`) || [];
                            if (!channels.includes(m.channel.id) || m.member.permissions.has('ADMINISTRATOR')) return;

                            const ServerData = await shopdb.findOne({ guildID: m.guild.id });
                            if (ServerData && ServerData.Badwords && ServerData.Badwords.length > 0) {
                                const badwords = ServerData.Badwords;
                                const content = m.content.toLowerCase();
                                const containsBadWord = badwords.some(badword => content.includes(badword.toLowerCase()));

                                if (containsBadWord) {
                                    const member = m.guild.members.cache.get(m.author.id);

                                    m.delete().catch(err => { }).then(() => {
                                        const embed = new MessageEmbed()
                                            .setColor(m.guild.me.displayHexColor)
                                            .setTitle('تم اسكاتك ✔')
                                            .setDescription(m.content)
                                            .setFooter(m.guild.name, m.guild.iconURL({ dynamic: true }))
                                            .setAuthor(m.author.username, m.author.displayAvatarURL({ dynamic: true }));

                                        member.timeout(ms('10m'), `done by: ${m.member.nickname} , ${client12.user.id}`)
                                        m.author.send({ embeds: [embed] }).catch(err => { });
                                    });
                                }
                            }
                        } catch (error) {
                        }
                    });


                    //حذف طلب
                    client12.on('interactionCreate', async i => {
                        if (i.customId === 'delete_order') {
                            if (!i.member.permissions.has('ADMINISTRATOR')) {
                                await i.reply({ content: `❌`, ephemeral: true });
                                return;
                            }

                            i.message.delete().catch(err => { });
                            i.reply({ content: '[✔] تم حذف الطلب بنجاح', ephemeral: true });
                        }
                    });

                    db2.push(`shop`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${ShopID}`,
                        CLIENTID: client12.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client12.user.id}_shop`, prefix).then(() => {
                            ownerDB.set(`Owner_${client12.user.id}_shop`, owner)
                        }).then(() => {

                            interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

            client12.on('ready', async () => {
                const data = await jsonDB.get(`shop_Status_${client12.user.id}`) || []
                const Activity = await data.Activity
                const type = await data.Type
                const botstatus = await data.Presence || "online"


                client12.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
                client12.user.setPresence({
                    status: botstatus,
                });
            });


            client12.Shopbotsslashcommands = new Collection();
            const Shopbotsslashcommands = [];

            client12.on("ready", async () => {
                const rest = new REST({ version: "9" }).setToken(token);
                (async () => {
                    try {
                        await rest.put(Routes.applicationCommands(client12.user.id), {
                            body: Shopbotsslashcommands,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                })();
            });

            const folderPath = path.join(__dirname, '../../Bots/Shop/slashcommand12');

            const ascii = require("ascii-table");
            const table = new ascii("Shop commands").setJustify();
            for (let folder of readdirSync(folderPath).filter(
                (folder) => !folder.includes(".")
            )) {
                for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                        Shopbotsslashcommands.push(command.data);
                        client12.Shopbotsslashcommands.set(command.data.name, command);
                        if (command.data.name) {
                            table.addRow(`/${command.data.name}`, "🟢 Working");
                        } else {
                            table.addRow(`/${command.data.name}`, "🔴 Not Working");
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}