const { Discord } = require('discord.js');
const client = require(`../../index`)
const { Client, MessageActionRow, MessageButton, MessageEmbed,Collection, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
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

const { CoderServer ,selllogsch } = require('../../config.json');
const mainBot = require('../../')

module.exports = {
    name: "System_MODAL",
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
            const SystemID = db4.get(`System_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const systemDB = new Database("/Json-db/Bots/SystemDB.json");

            const client7 = new Client({ intents: 32767 });
            client7.login(token)
                .then(async () => {
                    db4.set(`System_ID`, SystemID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client7.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***System bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a System bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${SystemID}\`\n`
                        );
                    buyer
                        .send({ embeds: [buyerembed],components: [invite_Button] })
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
                            console.log(`I cant find client role in System`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`System bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `System bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in System`)//تعديل
                        }
                    }

                    client7.commands = new Collection();
                    client7.events = new Collection();
                    require("../../handlers/System-commands")(client7);
                    require("../../Bots/System/handlers/events")(client7);

                    client7.on(`messageCreate`, async message =>{
                        if(!message.guild || message.author.bot) return;
                        const DB = new Database("/Json-db/Bots/SystemAutoReplyDB.json")
                        const theReplysDB = DB.get(`Autoreply_${message.guild.id}`)
                        if(!theReplysDB) return;
                        theReplysDB.forEach(data =>{
                          const {word ,reply , replyonmessage ,mention , deletemessage , Wildcard} = data
                          if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
                            return message.channel.send({content: `${reply}`})
                          }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "False"){
                            return message.reply(`${reply}`)
                          }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "False"){
                            return message.reply(`${reply} <@!${message.author.id}>`)
                          }else if(word === message.content && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
                            return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
                            return message.reply(`${reply} <@!${message.author.id}>`).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "True"){
                            return message.channel.send(`${reply} <@!${message.author.id}>`).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "True"){
                            return message.channel.send(`${reply}`).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(message.content.includes(word) && replyonmessage === "False" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
                            return message.channel.send(`${reply}`)
                          }else if(word === message.content && replyonmessage === "False" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
                            return message.channel.send({content: `${reply}`}).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(word === message.content && replyonmessage === "False" && mention === "True" && deletemessage === "True" && Wildcard === "False"){
                            return message.channel.send({content: `${reply} <@!${message.author.id}>`}).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(word === message.content && replyonmessage === "True" && mention === "False" && deletemessage === "True" && Wildcard === "False"){
                            return message.reply({content: `${reply}`}).then(()=>{
                              message.delete().catch(err =>{})
                            })
                          }else if(message.content.includes(word) && replyonmessage === "False" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
                            return message.channel.send({content: `${reply} @!${message.author.id}>`})
                          }else if(message.content.includes(word) && replyonmessage === "True" && mention === "False" && deletemessage === "False" && Wildcard === "True"){
                            return message.reply({content: `${reply}`})
                          }else if(message.content.includes(word) && replyonmessage === "True" && mention === "True" && deletemessage === "False" && Wildcard === "True"){
                            return message.reply({content: `${reply} <@!${message.author.id}>`})
                          }
                        })
                      })

                    db2.push(`system`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${SystemID}`,
                        CLIENTID: client7.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client7.user.id}_system`, prefix).then(() => {
                            ownerDB.set(`Owner_${client7.user.id}_system`, owner)
                        }).then(()=>{
                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client7.on('ready', async () => {
                    let statusIndex = 0;
                    setInterval(() => {
                      const data = systemDB.get(`system_Status_${client7.user.id}`) || []
                      const Activity = data.Activity
                      const type = data.Type
                      const botstatus = data.Presence || "online"
                      const statuses = [
                        Activity
                      ];
                
                      client7.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
                      client7.user.setPresence({
                        status: botstatus,
                      });
                      statusIndex = (statusIndex + 1) % statuses.length;
                    }, 1000);
                  });
                
                
                  client7.SystemBotsslashcommands = new Collection();
                  const SystemBotsslashcommands = [];
                
                
                  client7.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client7.user.id), {
                          body: SystemBotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });


                const folderPath = path.join(__dirname, '../../Bots/System/slashcommand7');

                const ascii = require("ascii-table");
                const table = new ascii("Giveaways commands").setJustify();
                for (let folder of readdirSync(folderPath).filter(
                  (folder) => !folder.includes(".")
                )) {
                  for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                  )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                      SystemBotsslashcommands.push(command.data);
                      client7.SystemBotsslashcommands.set(command.data.name, command);
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