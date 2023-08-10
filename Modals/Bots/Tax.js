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
    name: "Tax_MODAL",
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
            const TaxID = db4.get(`Tax_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const taxdb = new Database("/Json-db/Bots/TaxDB.json")

            const client4 = new Client({ intents: 32767 });
            client4.login(token)
                .then(async () => {
                    db4.set(`Tax_ID`, TaxID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client4.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Tax bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Tax bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${TaxID}\`\n`
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
                            console.log(`I cant find client role in Tax`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Tax bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Tax bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Tax`)//تعديل
                        }
                    }

                    client4.commands = new Collection();
                    client4.events = new Collection();
                    client4.TaxButtons = new Collection();
                    require("../../handlers/Tax-commands")(client4);
                    require("../../Bots/Tax/handlers/events")(client4);
                    require("../../handlers/Tax-button")(client4);

                    client4.on("messageCreate", async function (message) {
                        if (message.author.bot || !message.guild) return;
                        let args = message.content.split(" ").slice(0).join(" ");
                        const taxch = await taxdb.get(`autotax_${message.guild.id}`) || []
                        if (args.endsWith("m")) args = args.replace(/m/gi, "") * 1000000;
                        else if (args.endsWith("k")) args = args.replace(/k/gi, "") * 1000;
                        else if (args.endsWith("K")) args = args.replace(/K/gi, "") * 1000;
                        else if (args.endsWith("M")) args = args.replace(/M/gi, "") * 1000000;
                    
                        const type = taxdb.get(`Tax_MessageType_${message.guild.id}`) || 'embed'
                        const line = taxdb.get(`tax_line_${message.guild.id}`)
                    
                        let args2 = parseInt(args)
                        let number = (args2)
                    
                        let tax = Math.floor(args2 * (20) / (19) + (1))
                        let tax2 = Math.floor(tax * (20) / (19) + (1))
                        let tax3 = Math.floor(tax2 * (15.3265) / (15.1) + (0) - (tax2))
                        let tax4 = Math.floor((tax2 + tax3) * (20) / (19.99999) + (0))
                        let tax5 = Math.floor((tax) * (20) / (19) + (1))
                        if (taxch.includes(message.channel.id)) {
                          const Taxmessage = taxdb.get(`TaxMessage_${message.guild.id}`)
                          if (Taxmessage) {
                            let messageContent = Taxmessage.replace("[amount]", args)
                              .replace("[tax1]", tax)
                              .replace("[tax2]", tax4)
                              .replace("[tax3]", tax3)
                              .replace("[tax4]", tax5);
                            const embed = new MessageEmbed()
                              .setColor(message.guild.me.displayHexColor)
                              .setThumbnail(message.guild.iconURL({ dynamic: true }))
                              .setDescription(messageContent);
                            if (type === `embed`) {
                              message.reply({ embeds: [embed] }).then(() => {
                                const mode = taxdb.get(`Tax_System_${message.guild.id}`)
                                if(line){
                                  message.channel.send({files:[line]})
                                }
                                if (mode === `true`) {
                                  message.delete().catch(err => { })
                                }
                              })
                            } else {
                              message.reply({ content: `${messageContent}` }).then(() => {
                                const mode = taxdb.get(`Tax_System_${message.guild.id}`)
                                if(line){
                                  message.channel.send({files:[line]})
                                }
                                if (mode === `true`) {
                                  message.delete().catch(err => { })
                                }
                              })
                            }
                    
                          } else {
                            let probottakes1 = Math.floor(args2 * (20) / (19) + (1) - (args2))
                    
                            MessageConetnt = `✔ __**The tax for**__ \`${number}\`\n**Is : **\`${tax}\`\n**Probot takes : **\`${probottakes1}\``
                            const embed = new MessageEmbed()
                              .setColor(message.guild.me.displayHexColor)
                              .setThumbnail(message.guild.iconURL({ dynamic: true }))
                              .setDescription(MessageConetnt)
                    
                    
                              if (type === `embed`) {
                                message.reply({ embeds: [embed] }).then(() => {
                                  const mode = taxdb.get(`Tax_System_${message.guild.id}`)
                                  if(line){
                                    message.channel.send({files:[line]})
                                  }
                                  if (mode === `true`) {
                                    message.delete().catch(err => { })
                                  }
                                })
                              } else {
                                message.reply({ content: `${MessageConetnt}` }).then(() => {
                                  if(line){
                                    message.channel.send({files:[line]})
                                  }
                                  const mode = taxdb.get(`Tax_System_${message.guild.id}`)
                                  if (mode === `true`) {
                                    message.delete().catch(err => { })
                                  }
                                })
                              }
                            
                          }
                    
                        }
                      });
                    
                    
                    
                      client4.on("interactionCreate", async (interaction) => {
                        if (interaction.isModalSubmit() && interaction.customId === `AutoTax_Message`) {
                          try {
                            let messageText = interaction.fields.getTextInputValue("MessageText");
                    
                            taxdb.set(`TaxMessage_${interaction.guild.id}`, messageText).then(() => {
                              interaction.reply(`[+] تم حفظ الرساله`)
                            })
                    
                          } catch (error) {
                            console.log(error);
                          }
                        }
                      });

                    db2.push(`tax`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${TaxID}`,
                        CLIENTID: client4.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client4.user.id}_tax`, prefix).then(() => {
                            ownerDB.set(`Owner_${client4.user.id}_tax`, owner)
                        }).then(()=>{
                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client4.on('ready', async () => {
                    let statusIndex = 0;
                    setInterval(() => {
                      const data = taxdb.get(`Tax_Status_${client4.user.id}`) || []
                      const Activity = data.Activity
                      const type = data.Type
                      const botstatus = data.Presence || "online"
                      const statuses = [
                        Activity
                      ];
                
                      client4.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
                      client4.user.setPresence({
                        status: botstatus,
                      });
                      statusIndex = (statusIndex + 1) % statuses.length;
                    }, 1000);
                  });
                
                  
                  client4.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client4.user.id), {
                          body: TaxBotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });
                
                  client4.TaxBotsslashcommands = new Collection();
                  const TaxBotsslashcommands = [];


                const folderPath = path.join(__dirname, '../../Bots/Tax/slashcommand4');
                const ascii = require("ascii-table");
                const table = new ascii("Tax commands").setJustify();
                for (let folder of readdirSync(folderPath).filter(
                  (folder) => !folder.includes(".")
                )) {
                  for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                  )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                      TaxBotsslashcommands.push(command.data);
                      client4.TaxBotsslashcommands.set(command.data.name, command);
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