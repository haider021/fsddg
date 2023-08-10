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

module.exports = {
    name: "AutoLine_MODAL",
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
            const AutolineID = db4.get(`Autoline_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const autolinedb = require("../../Schema/BotsDB/Autoline");
            const jsonDB = new Database("/Json-db/Bots/AutolineDB.json")


            const client2 = new Client({ intents: 32767 });
            client2.login(token)
                .then(async () => {
                    db4.set(`Autoline_ID`, AutolineID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client2.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);
                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor("#d5d5d5")
                        .setTitle("__***Auto-line bot purchase***___")
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Auto-line bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${AutolineID}\``
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
                            setTimeout(() => interaction.channel.delete(), 10000);
                        })
                        .catch(async (error) => {
                            return console.log(error.message);
                        });
                    if (client_role) {
                        try {
                            const role = interaction.guild.roles.cache.find(
                                (r) => r.id === client_role
                            );
                            await interaction.member.roles.add(role)
                        } catch (error) {
                            console.log(`I cant find client role in Autoline`)//تعديل
                        }
                    }
                    try {
                        const MainServer = mainBot.guilds.cache.get(CoderServer);
                        const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                        if (MainServerLogChannel) {
                            MainServerLogChannel.send(`Autoline bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Autoline bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Autoline`)//تعديل
                        }
                    }

                    client2.commands = new Collection();
                    client2.events = new Collection();
                    require("../../handlers/Auto-line-commands")(client2);
                    require("../../Bots/Auto-line/handlers/events")(client2);

                    client2.on(`messageCreate`, async message =>{
                        if (message.content === `-` || message.content === `خط`){
                          try {
                          if (!message.guild) return;
                          const ServerData = await autolinedb.findOne({ guildID: message.guild.id }) || []
                    
                          const embed = new MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription('❗  __**Please set line url !set-line command**__');
                            
                          if (!message.member.permissions.has("ADMINISTRATOR") && ServerData && ServerData.allowedchannels &&!ServerData.allowedchannels.includes(message.channel.id)) return;
                          if (!ServerData || !ServerData.line) return message.reply({ embeds: [embed] });
                    
                          await message.channel.send(ServerData.line).then(()=>{
                             message.delete()
                          })
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      });
                    
                    
                      client2.on('messageCreate', async message => {
                        try {
                          if (!message.guild || message.author.bot) return;
                          const embed = new Discord.MessageEmbed()
                            .setColor('YELLOW')
                            .setDescription('❗  __**Please set line url !set-line command**__');
                          const ServerData = await autolinedb.findOne({ guildID: message.guild.id })
                          if (!ServerData || !ServerData.channels && !ServerData.channels.includes(message.channel.id)) return;
                    
                          if(ServerData.channels.includes(message.channel.id)){
                            if (!ServerData.line) return message.reply({ embeds: [embed] });
                            await message.channel.send(ServerData.line);
                          }
                    
                        } catch (err) {
                          console.error(err);
                        }
                      });

                    db2.push(`autoline`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${AutolineID}`,
                        CLIENTID: client2.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client2.user.id}_autoline`, prefix).then(() => {
                            ownerDB.set(`Owner_${client2.user.id}_autoline`, owner)
                        }).then(() => {

                            interaction.message.delete();
                        })
                    })
                })
                .catch((error) => {
                    console.log(error)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })
                client2.on('ready', async () => {
                    const data = await jsonDB.get(`Autoline_Status_${client2.user.id}`) || []
                    const Activity = await  data.Activity
                    const type = await data.Type
                
                      const botstatus = await data.Presence || "online"
                
                      client2.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
                      client2.user.setPresence({
                        status: botstatus,
                      });
                
                  });

            client2.Autolinebotsslashcommands = new Collection();
            const Autolinebotsslashcommands = [];


            client2.on("ready", async () => {
                const rest = new REST({ version: "9" }).setToken(token);
                (async () => {
                    try {
                        await rest.put(Routes.applicationCommands(client2.user.id), {
                            body: Autolinebotsslashcommands,
                        });
                    } catch (error) {
                        console.error(error);
                    }
                })();
            });

            const folderPath = path.join(__dirname, '../../Bots/Auto-line/slashcommand2');

            const ascii = require("ascii-table");
            const table = new ascii("autoline commands").setJustify();
            for (let folder of readdirSync(folderPath).filter(
                (folder) => !folder.includes(".")
            )) {
                for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                        Autolinebotsslashcommands.push(command.data);
                        client2.Autolinebotsslashcommands.set(command.data.name, command);
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