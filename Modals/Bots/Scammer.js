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
    name: "Scammer_MODAL",
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
            const ScammerID = db4.get(`Scammer_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const scammerdb = new Database("/Json-db/Bots/ScammerDB.json")

            const client16 = new Client({ intents: 32767 });
            client16.login(token)
                .then(async () => {
                    db4.set(`Scammer_ID`, ScammerID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client16.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Scammer bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Scammer bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${ScammerID}\`\n`
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
                            console.log(`I cant find client role in Scammer`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Scammer bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Scammer bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Scammer`)//تعديل
                        }
                    }

                    client16.commands = new Collection();
                    client16.events = new Collection();
                    require("../../handlers/Scammer-commands")(client16);
                    require("../../Bots/Scammer/handlers/events")(client16);

                    client16.on(`interactionCreate`, async i => {
                        try {
                          if (!i.isButton()) return;
                      
                          if (i.customId === `Scammer_BackButton_${i.message.id}` || i.customId === `Scammer_NextButton_${i.message.id}`) {
                            i.deferUpdate();
                            const messageId = i.customId.split(`_`).pop();
                            const proof = scammerdb.get(`ScammerProof_${client16.user.id}_${messageId}`);
                      
                            if (!proof) return;
                      
                            const files = [
                              proof.url1,
                              proof.url2,
                              proof.url3,
                              proof.url4,
                              proof.url5,
                              proof.url6,
                              proof.url7,
                              proof.url8,
                              proof.url9,
                              proof.url10
                            ];
                      
                            const currentIndex = files.findIndex(url => url === i.message.embeds[0].image.url);
                            const nextIndex = i.customId.startsWith(`Scammer_NextButton_`) ? currentIndex + 1 : currentIndex - 1;
                      
                            if (nextIndex >= 0 && nextIndex < files.length) {
                              const nextImageUrl = files[nextIndex];
                              if (nextImageUrl) {
                                const newEmbed = i.message.embeds[0].setImage(nextImageUrl);
                                i.message.edit({ embeds: [newEmbed] });
                              }
                            }
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      });
                      
                    db2.push(`scammer`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${ScammerID}`,
                        CLIENTID: client16.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client16.user.id}_scammer`, prefix).then(() => {
                            ownerDB.set(`Owner_${client16.user.id}_scammer`, owner)
                        }).then(()=>{

                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client16.on('ready', async () => {
                    let statusIndex = 0;
                    setInterval(() => {
                      const data = scammerdb.get(`Scammer_Status_${client16.user.id}`) || []
                      const Activity = data.Activity
                      const type = data.Type
                      const botstatus = data.Presence || "online"
                      const statuses = [
                        Activity
                      ];
                
                      client16.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
                      client16.user.setPresence({
                        status: botstatus,
                      });
                      statusIndex = (statusIndex + 1) % statuses.length;
                    }, 1000);
                  });
                
                  
                  client16.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client16.user.id), {
                          body: ScammerBotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });
                
                  client16.ScammerBotsslashcommands = new Collection();
                  const ScammerBotsslashcommands = [];


                const folderPath = path.join(__dirname, '../../Bots/Scammer/slashcommand16');

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
                      ScammerBotsslashcommands.push(command.data);
                      client16.ScammerBotsslashcommands.set(command.data.name, command);
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