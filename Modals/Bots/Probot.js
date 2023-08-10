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
    name: "Probot_MODAL",
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
            const ProbotID = db4.get(`Probot_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const probotdb = new Database("/Json-db/Bots/probot.json")
            const client15 = new Client({ intents: 32767 });
            client15.login(token)
                .then(async () => {
                    db4.set(`Probot_ID`, ProbotID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client15.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Probot bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Probot bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${ProbotID}\`\n`
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
                            console.log(`I cant find client role in Probot`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Fake-probot bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Probot bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Probot`)//تعديل
                        }
                    }

                    // client15.commands = new Collection();
                    client15.events = new Collection();
                    // require("../../handlers/Probot-commands")(client15);
                    require("../../Bots/ProBot/handlers/events")(client15);

                    client15.on('messageCreate', async (message) => {
                        const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on"
                        if (status === "on") {
                          if (message.content.includes('type these numbers to confirm')) return;
                    
                          if (message.author.id === '282859044593598464') {
                            try {
                              if (message.content.includes('You are eligible to receive your daily for the bot!')) {
                                const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
                                await message.delete();
                                const row = new MessageActionRow()
                                  .addComponents(buttonComponent);
                                return message.channel.send({
                                  content: `${message.content}`,
                                  components: [row]
                                });
                              }
                              if (message.content.includes('You can get up to 2600 credits if you vote for ProBot!')) {
                                const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
                                await message.delete();
                                const row = new MessageActionRow()
                                  .addComponents(buttonComponent);
                                return message.channel.send({
                                  content: `${message.content}`,
                                  components: [row]
                                });
                              }
                              if (message.author.bot && message.embeds.length > 0) {
                                await message.delete();
                                const embed = new MessageEmbed(message.embeds[0]);
                                return message.channel.send({ embeds: [embed] });
                              }
                    
                              if (message.content && message.attachments.size > 0) {
                                const attach = message.attachments.first();
                                await message.delete();
                                return message.channel.send({ content: `${message}`, files: [{ name: `'pic.png'`, attachment: attach.url }] });
                              }
                    
                              if (message.attachments.size > 0) {
                                const attach = message.attachments.first();
                                await message.delete();
                                return message.channel.send({ files: [{ name: 'pic.png', attachment: attach.url }] });
                              }
                    
                              await message.delete();
                              const sentMessage = await message.channel.send({ content: `${message}` });
                    
                              if (sentMessage.content.includes('Cool down')) {
                                setTimeout(() => {
                                  sentMessage.delete();
                                }, 3000);
                              }
                              if (sentMessage.content.includes(`Deleting messages`)) {
                                setTimeout(() => {
                                  sentMessage.delete();
                                }, 3000);
                              }
                            } catch (error) {
                              console.log(error)
                            }
                          }
                        } else {
                          return;
                        }
                      });
                    
                    
                      client15.on("messageCreate", async (message) => {
                        try {
                          const status = probotdb.get(`probotSystem_${message.guild.id}`) || "on";
                          if (status === "on") {
                            const args = message.content.split(" ");
                            let id = message.content.split(" ")[1];
                            const member = message.mentions.members?.first() || message.guild.members.cache.get(id);
                            if (message.author.id === "282859044593598464") {
                              if (message.content.includes(`type these numbers to confirm`)) {
                                user = message.mentions.repliedUser?.id;
                                username = message.mentions.repliedUser.username;
                    
                                await message.channel.send({ files: [{ name: `pic.png`, attachment: `${message.attachments.first().url}` }], content: `${message}` }).then(async (msg) => {
                    
                                  message.delete();
                    
                                  const filter = (m) => m.author.id === user;
                                  const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000, errors: ["time"] });
                    
                                  collector.on("collect", async (response) => {
                                    if(msg){
                                      msg.delete();
                                    }
                                  });
                    
                                  collector.on("end", (collected) => {
                                    if (collected.size === 0) {
                                      if (msg) {
                                        msg.delete()
                                      }
                                    }
                                  });
                                })
                              }
                            }
                          } else {
                            return;
                          }
                        } catch (error) {
                          
                        }
                      });

                    db2.push(`probot`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${ProbotID}`,
                        CLIENTID: client15.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client15.user.id}_probot`, prefix).then(() => {
                            ownerDB.set(`Owner_${client15.user.id}_probot`, owner)
                        }).then(()=>{
                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client15.on('ready', async () => {
                  const data = await probotdb.get(`Probot_Status_${client15.user.id}`) || []
                  const Activity = await data.Activity
                  const type = await data.Type
                  const botstatus = await data.Presence || "online"
              
              
                  client15.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
                  client15.user.setPresence({
                    status: botstatus,
                  });
                });
                
                  client15.Probotbotsslashcommands = new Collection();
                  const Probotbotsslashcommands = [];
                
                
                  client15.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client15.user.id), {
                          body: Probotbotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });


                const folderPath = path.join(__dirname, '../../Bots/ProBot/slashcommand15');

                const ascii = require("ascii-table");
                const table = new ascii("probot commands").setJustify();
                for (let folder of readdirSync(folderPath).filter(
                  (folder) => !folder.includes(".")
                )) {
                  for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                  )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                      Probotbotsslashcommands.push(command.data);
                      client15.Probotbotsslashcommands.set(command.data.name, command);
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