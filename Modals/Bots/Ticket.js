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

const sourcebin = require('sourcebin_js');

module.exports = {
    name: "Ticket_MODAL",
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
            const TicketID = db4.get(`Ticket_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const ticketdb = new Database("/Json-db/Bots/TicketDB.json")

            const client6 = new Client({ intents: 32767 });
            client6.login(token)
                .then(async () => {
                    db4.set(`Ticket_ID`, TicketID + 1);
                    
                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client6.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Ticket bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Ticket bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${TicketID}\`\n`
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
                            console.log(`I cant find client role in Ticket`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Ticket bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Ticket bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Ticket`)//تعديل
                        }
                    }

                    client6.Ticketcommands = new Collection();
                    client6.events = new Collection();
                    client6.TickerSelectmenu = new Collection();
                    require("../../handlers/Ticket-commands")(client6);
                    require("../../Bots/Ticket/handlers/events")(client6);
                    require("../../handlers/Ticket-Selectmenu")(client6);
                    client6.on("interactionCreate", async (i) => {
                        if (!i.isButton()) return;
                        try {
                          if (i.customId === `ticketButton_1_${i.message?.id}`) {
                            await i.deferReply({ ephemeral: true });
                            const T = ticketdb.get(`PanalNumber_${i.message.id}`)
                            const data = ticketdb.get(`Ticket-${T.buttonsNumber}_${T.panalID}_${i.guild.id}`)
                    
                            const categoryID = data.button_1_Category//تعديل
                            const category = i.guild.channels.cache.find(
                              (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                            );
                    
                            //تعديل
                            const supportteam = data.button_1_Support
                            const mention = data.button_1_Mention
                            const welcome = data.button_1_Welcome
                    
                    
                            const Ticketbuttons = new MessageActionRow().addComponents([
                              new MessageButton()
                                .setCustomId(`Ticket_Close_Button`)
                                .setStyle(`DANGER`)
                                .setLabel("Close")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`Claim_${supportteam}`)
                                .setStyle(`SUCCESS`)
                                .setLabel("Claim")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`TranScript_${supportteam}`)
                                .setStyle(`SECONDARY`)
                                .setLabel("TranScript")
                                .setDisabled(false),
                            ]);
                    
                            const ticketlimit = ticketdb.get(`ticketlimit_${i.message.id}`);
                            if (ticketlimit) {
                              const checkusertickets = ticketdb.get(`Limit_${i.user.id}_${i.message.id}`)
                              if (checkusertickets >= ticketlimit) {
                                return i.editReply({
                                  content: `You have reached the max ticket limit per user!`,
                                  ephemeral: true,
                                });
                              } else if (checkusertickets < ticketlimit) {
                                ticketdb.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                              }
                            }
                    
                            const ticketnumber = ticketdb.get(`ticketButton_1_${T.panalID}`) || 1;//تعديل
                            ticketdb.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
                    
                            const channel = await i.guild.channels.create(
                              `ticket-${ticketnumber}`,
                              {
                                type: "text",
                                parent: category,
                                permissionOverwrites: [
                                  {
                                    id: i.guild.roles.everyone.id,
                                    deny: ["VIEW_CHANNEL"],
                                  },
                                  {
                                    id: `${i.user.id}`,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                  },
                                  {
                                    id: `${supportteam}`,
                                    allow: ["VIEW_CHANNEL"],
                                  },
                                ],
                                topic: `${i.user.id}`,
                              }
                            );
                    
                            const WelcomeEmbed = new MessageEmbed()
                              .setColor(i.guild.me.displayHexColor)
                              .setDescription(`${welcome}`);
                            if (!mention) {
                              channel.send(`${i.user}`);
                            } else {
                              channel.send(`${i.user},<@&${mention}>`);
                            }
                            channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                            await i.editReply({
                              content: `Your ticket has been created: ${channel}`,
                              ephemeral: true,
                            });
                    
                    
                            if (ticketlimit) {
                              ticketdb.set(`Limted_User_${channel.id}`, i.message.id)
                            }
                          }else if (i.customId === `ticketButton_2_${i.message?.id}`) {
                            await i.deferReply({ ephemeral: true });
                            const T = ticketdb.get(`PanalNumber_${i.message.id}`)
                            const data = ticketdb.get(`Ticket-${T.buttonsNumber}_${T.panalID}_${i.guild.id}`)
                    
                            const categoryID = data.button_2_Category//تعديل
                            const category = i.guild.channels.cache.find(
                              (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                            );
                    
                            //تعديل
                            const supportteam = data.button_2_Support
                            const mention = data.button_2_Mention
                            const welcome = data.button_2_Welcome
                    
                    
                            const Ticketbuttons = new MessageActionRow().addComponents([
                              new MessageButton()
                                .setCustomId(`Ticket_Close_Button`)
                                .setStyle(`DANGER`)
                                .setLabel("Close")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`Claim_${supportteam}`)
                                .setStyle(`SUCCESS`)
                                .setLabel("Claim")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`TranScript_${supportteam}`)
                                .setStyle(`SECONDARY`)
                                .setLabel("TranScript")
                                .setDisabled(false),
                            ]);
                    
                            const ticketlimit = ticketdb.get(`ticketlimit_${i.message.id}`);
                            if (ticketlimit) {
                              const checkusertickets = ticketdb.get(`Limit_${i.user.id}_${i.message.id}`)
                              if (checkusertickets >= ticketlimit) {
                                return i.editReply({
                                  content: `You have reached the max ticket limit per user!`,
                                  ephemeral: true,
                                });
                              } else if (checkusertickets < ticketlimit) {
                                ticketdb.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                              }
                            }
                    
                            const ticketnumber = ticketdb.get(`ticketButton_2_${T.panalID}`) || 1;//تعديل
                            ticketdb.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
                    
                            const channel = await i.guild.channels.create(
                              `ticket-${ticketnumber}`,
                              {
                                type: "text",
                                parent: category,
                                permissionOverwrites: [
                                  {
                                    id: i.guild.roles.everyone.id,
                                    deny: ["VIEW_CHANNEL"],
                                  },
                                  {
                                    id: `${i.user.id}`,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                  },
                                  {
                                    id: `${supportteam}`,
                                    allow: ["VIEW_CHANNEL"],
                                  },
                                ],
                                topic: `${i.user.id}`,
                              }
                            );
                    
                            const WelcomeEmbed = new MessageEmbed()
                              .setColor(i.guild.me.displayHexColor)
                              .setDescription(`${welcome}`);
                            if (!mention) {
                              channel.send(`${i.user}`);
                            } else {
                              channel.send(`${i.user},<@&${mention}>`);
                            }
                            channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                            await i.editReply({
                              content: `Your ticket has been created: ${channel}`,
                              ephemeral: true,
                            });
                    
                    
                            if (ticketlimit) {
                              ticketdb.set(`Limted_User_${channel.id}`, i.message.id)
                            }
                          }else if (i.customId === `ticketButton_3_${i.message?.id}`) {
                            await i.deferReply({ ephemeral: true });
                            const T = ticketdb.get(`PanalNumber_${i.message.id}`)
                            const data = ticketdb.get(`Ticket-${T.buttonsNumber}_${T.panalID}_${i.guild.id}`)
                    
                            const categoryID = data.button_3_Category//تعديل
                            const category = i.guild.channels.cache.find(
                              (c) => c.id === `${categoryID}` && c.type === "GUILD_CATEGORY"
                            );
                    
                            //تعديل
                            const supportteam = data.button_3_Support
                            const mention = data.button_3_Mention
                            const welcome = data.button_3_Welcome
                    
                    
                            const Ticketbuttons = new MessageActionRow().addComponents([
                              new MessageButton()
                                .setCustomId(`Ticket_Close_Button`)
                                .setStyle(`DANGER`)
                                .setLabel("Close")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`Claim_${supportteam}`)
                                .setStyle(`SUCCESS`)
                                .setLabel("Claim")
                                .setDisabled(false),
                    
                              new MessageButton()
                                .setCustomId(`TranScript_${supportteam}`)
                                .setStyle(`SECONDARY`)
                                .setLabel("TranScript")
                                .setDisabled(false),
                            ]);
                    
                            const ticketlimit = ticketdb.get(`ticketlimit_${i.message.id}`);
                            if (ticketlimit) {
                              const checkusertickets = ticketdb.get(`Limit_${i.user.id}_${i.message.id}`)
                              if (checkusertickets >= ticketlimit) {
                                return i.editReply({
                                  content: `You have reached the max ticket limit per user!`,
                                  ephemeral: true,
                                });
                              } else if (checkusertickets < ticketlimit) {
                                ticketdb.set(`Limit_${i.user.id}_${i.message.id}`, parseInt(checkusertickets + 1));
                              }
                            }
                    
                            const ticketnumber = ticketdb.get(`ticketButton_3_${T.panalID}`) || 1;//تعديل
                            ticketdb.set(`ticketButton_1_${T.panalID}`, ticketnumber + 1);
                    
                            const channel = await i.guild.channels.create(
                              `ticket-${ticketnumber}`,
                              {
                                type: "text",
                                parent: category,
                                permissionOverwrites: [
                                  {
                                    id: i.guild.roles.everyone.id,
                                    deny: ["VIEW_CHANNEL"],
                                  },
                                  {
                                    id: `${i.user.id}`,
                                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                                  },
                                  {
                                    id: `${supportteam}`,
                                    allow: ["VIEW_CHANNEL"],
                                  },
                                ],
                                topic: `${i.user.id}`,
                              }
                            );
                    
                            const WelcomeEmbed = new MessageEmbed()
                              .setColor(i.guild.me.displayHexColor)
                              .setDescription(`${welcome}`);
                            if (!mention) {
                              channel.send(`${i.user}`);
                            } else {
                              channel.send(`${i.user},<@&${mention}>`);
                            }
                            channel.send({ embeds: [WelcomeEmbed], components: [Ticketbuttons] })
                            await i.editReply({
                              content: `Your ticket has been created: ${channel}`,
                              ephemeral: true,
                            });
                    
                    
                            if (ticketlimit) {
                              ticketdb.set(`Limted_User_${channel.id}`, i.message.id)
                            }
                          }
                          //Claim Button
                          else if (i.customId.startsWith("Claim_")) {
                            const points = ticketdb.get(`Points_${i.guild.id}_${i.user.id}`) || 0
                    
                            const SupportTeam = i.customId.substring(6);
                            const member = i.member;
                            const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
                    
                            if (hasSupportRole) {
                              const role = i.guild.roles.cache.get(SupportTeam);
                              i.channel.permissionOverwrites.edit(member, {
                                SEND_MESSAGES: true,
                              });
                              i.channel.permissionOverwrites
                                .edit(role, {
                                  SEND_MESSAGES: false,
                                }).then(() => {
                                  const claimedButton = new MessageButton()
                                    .setCustomId(`Claimed_${SupportTeam}`)
                                    .setStyle(`SECONDARY`)
                                    .setLabel("Claimed")
                                    .setDisabled(false);
                                  const Ticketbuttons = new MessageActionRow().addComponents([
                                    new MessageButton()
                                      .setCustomId(`Ticket_Close_Button`)
                                      .setStyle(`DANGER`)
                                      .setLabel("Close")
                                      .setDisabled(false),
                                    claimedButton,
                                    new MessageButton()
                                      .setCustomId(`TranScript_${SupportTeam}`)
                                      .setStyle(`SECONDARY`)
                                      .setLabel("TranScript")
                                      .setDisabled(false),
                                  ]);
                    
                                  const claimEmbed = new MessageEmbed()
                                    .setColor(`WHITE`)
                                    .setDescription(
                                      `***تم استلام التذكره***\n**بواسطه : <@${i.user.id}>**`
                                    );
                                  ticketdb.set(`climedBy_${i.channel.id}`, i.user.id).then(() => {
                                    ticketdb.set(`Points_${i.guild.id}_${i.user.id}`, points + 1)
                                  })
                                  i.update({ components: [Ticketbuttons] }).then(
                                    async (doneclaimed) => {
                                      const ticketchannel1 = i.channel.id;
                                      const claimedchannel =
                                        client6.channels.cache.get(ticketchannel1);
                                      claimedchannel.send({ embeds: [claimEmbed] }).catch((err) => { });
                                    }
                                  );
                                });
                            } else {
                              return i.reply({
                                content: "لا يمكنك استخدام هذا الزر.",
                                ephemeral: true,
                              });
                            }
                          }
                          //unClaim
                          else if (i.customId.startsWith("Claimed_")) {
                            const points = ticketdb.get(`Points_${i.guild.id}_${i.user.id}`) || 1
                    
                            const climer = ticketdb.get(`climedBy_${i.channel.id}`);
                            const SupportTeam = i.customId.substring(8);
                            const member = i.member;
                            const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
                            const role = i.guild.roles.cache.get(SupportTeam);
                    
                            if (i.user.id !== climer && !hasPermission) {
                              return i
                                .reply({
                                  content: `**لقد تم استلام التذكره بواسطه : <@${climer}>**`,
                                  ephemeral: true,
                                })
                                .catch((err) => console.log(err));
                            }
                    
                    
                            i.channel.permissionOverwrites.edit(member, {
                              SEND_MESSAGES: false,
                            });
                            i.channel.permissionOverwrites
                              .edit(role, {
                                SEND_MESSAGES: true,
                              })
                              .then(() => {
                                const claimButton = new MessageButton()
                                  .setCustomId(`Claim_${SupportTeam}`)
                                  .setStyle(`SUCCESS`)
                                  .setLabel("Claim")
                                  .setDisabled(false);
                                const Ticketbuttons = new MessageActionRow().addComponents([
                                  new MessageButton()
                                    .setCustomId(`Ticket_Close_Button`)
                                    .setStyle(`DANGER`)
                                    .setLabel("Close")
                                    .setDisabled(false),
                                  claimButton,
                                  new MessageButton()
                                    .setCustomId(`TranScript_${SupportTeam}`)
                                    .setStyle(`SECONDARY`)
                                    .setLabel("TranScript")
                                    .setDisabled(false),
                                ]);
                    
                                const notclimed = new MessageEmbed()
                                  .setColor(`WHITE`)
                                  .setDescription(
                                    `***تم الغاء استلام التذكره***\n**بواسطه : ${i.user}**`
                                  );
                                i.update({ components: [Ticketbuttons] }).then(
                                  async (doneclaimed) => {
                                    const climer = ticketdb.get(`climedBy_${i.channel.id}`);
                                    ticketdb.set(`Points_${i.guild.id}_${climer}`, points - 1)
                                    const ticketchannel1 = i.channel.id;
                                    const claimedchannel =
                                      client6.channels.cache.get(ticketchannel1);
                                    claimedchannel.send({ embeds: [notclimed] });
                    
                                    const defaultPermissions =
                                      i.channel.permissionOverwrites.cache.find(
                                        (overwrite) => overwrite.id === member.id
                                      );
                                    const climerPermissions =
                                      i.channel.permissionOverwrites.cache.find(
                                        (overwrite) => overwrite.id === climer
                                      );
                                    defaultPermissions ? defaultPermissions.delete() : null;
                                    climerPermissions ? climerPermissions.delete() : null;
                                  }
                                );
                              });
                          }
                          //CloseSure
                          else if (i.customId === `Ticket_Close_Button`) {
                            try {
                              i.deferUpdate();
                              const Ticketbuttons = new MessageActionRow().addComponents([
                                new MessageButton()
                                  .setCustomId(`Ticket_Close_Button_Sure`)
                                  .setStyle(`DANGER`)
                                  .setLabel("Close")
                                  .setDisabled(false),
                                new MessageButton()
                                  .setCustomId(`Cancel_Ticket_Close_Button`)
                                  .setStyle(`SECONDARY`)
                                  .setLabel("Cancel")
                                  .setDisabled(false),
                              ]);
                              i.channel.send({ content: `هل انت متاكد من اغلاقك للتكت؟`, components: [Ticketbuttons] })
                            } catch (error) {
                              console.log(error)
                            }
                          }
                          //Close
                          else if (i.customId === `Ticket_Close_Button_Sure`) {
                            const lm = ticketdb.get(`Limted_User_${i.channel.id}`)
                            const ticketlimit = ticketdb.get(`ticketlimit_${lm}`);
                            try {
                              if (ticketlimit) {
                                if (lm) {
                                  ticketdb.subtract(`Limit_${i.user.id}_${lm}`, 1)
                                  ticketdb.delete(`Limted_User_${i.channel.id}`)
                                }
                              }
                              const Delembed = new MessageEmbed()
                                .setColor(`#d5d5d5`)
                                .setDescription(
                                  `__**The Ticket will be deleted in \`5\` seconds**__`
                                );
                              i.reply({ embeds: [Delembed] })
                                .then((timeembed) => {
                                  setTimeout(() => i.channel.delete(), 5000);
                                })
                                .catch(async (error) => {
                                  return console.log(error.message);
                                });
                            } catch (error) {
                              console.log(error)
                            }
                          }
                          //Cancel Ticket close
                          else if (i.customId === `Cancel_Ticket_Close_Button`) {
                            try {
                              i.deferUpdate();
                              i.message.delete().catch(err => { })
                            } catch (error) {
                              console.log(error)
                            }
                          }
                          //TranScript
                          else if (i.customId.startsWith("TranScript_")) {
                            const SupportTeam = i.customId.substring(11);
                            const member = i.member;
                            const hasSupportRole = member.roles.cache.some(role => role.id === SupportTeam);
                    
                            const TchannelID = ticketdb.get(`transcript_channel_${i.guild.id}`)
                            const Tchannel = client6.channels.cache.get(TchannelID)
                            if (hasSupportRole) {
                              if (!Tchannel) return i.reply(`[x] لا استطيع ايجاد روم حفظ السجلات قم بتحديد الروم \`/transcript-channel\``)
                              await i.channel.messages.fetch().then(async (messages) => {
                                const messageArray = [...messages.values()];
                                const reversedMessages = messageArray.reverse();
                                const output = reversedMessages.map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
                    
                                let response;
                                try {
                                  response = await sourcebin.create([
                                    {
                                      name: ' ',
                                      content: output,
                                      languageId: 'text',
                                    },
                                  ], {
                                    title: `Chat transcript for ${i.channel.name}`,
                                    description: ' ',
                                  });
                                } catch (e) {
                                  console.log(e)
                                  return i.channel.send('An error occurred, please try again!');
                                }
                    
                                const savingTransScriptEmbed = new MessageEmbed()
                                  .setColor(`YELLOW`)
                                  .setDescription(`[✔] تم حفظ سجل التكت`)
                                const channelName = ticketdb.get(`${i.channel.id}`) || i.channel.name
                                const NewchannelName = i.channel.name
                                const userID = i.channel.topic
                                const SavedBy = i.user.username
                    
                                const TEmbed = new MessageEmbed()
                                  .setColor(`YELLOW`)
                                  .addFields(
                                    { name: 'Ticket name', value: channelName, inline: true },
                                    { name: 'Ticket new name', value: NewchannelName, inline: true },
                                    { name: 'opened By', value: `<@!${userID}> \`${userID}\``, inline: true },
                                    { name: 'TranScript Saved By', value: `<@!${i.user.id}> (${SavedBy}) \`${i.user.id}\``, inline: true },
                                  )
                    
                                const TrButton = new MessageActionRow().addComponents([
                                  new MessageButton()
                                    .setStyle(`LINK`)
                                    .setURL(response.url)
                                    .setLabel(`View TranScript`)
                                    .setDisabled(false),
                                ]);
                    
                                Tchannel.send({ embeds: [TEmbed], components: [TrButton] }).then(() => {
                                  i.reply({ embeds: [savingTransScriptEmbed] })
                                })
                              });
                            } else {
                              return i.reply({
                                content: "لا يمكنك استخدام هذا الزر.",
                                ephemeral: true,
                              });
                            }
                          }
                        } catch (error) {
                          console.log(error.message)
                        }
                      });

                    db2.push(`ticket`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${TicketID}`,
                        CLIENTID: client6.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client6.user.id}_ticket`, prefix).then(() => {
                            ownerDB.set(`Owner_${client6.user.id}_ticket`, owner)
                        }).then(()=>{
                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client6.on('ready', async () => {
                    let statusIndex = 0;
                    setInterval(() => {
                      const data = ticketdb.get(`ticket_Status_${client6.user.id}`) || []
                      const Activity = data.Activity
                      const type = data.Type
                      const botstatus = data.Presence || "online"
                      const statuses = [
                        Activity
                      ];
                
                      client6.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
                      client6.user.setPresence({
                        status: botstatus,
                      });
                      statusIndex = (statusIndex + 1) % statuses.length;
                    }, 1000);
                  });
                
                
                  client6.Ticketslashcommands = new Collection();
                  const Ticketslashcommands = [];
                
                  client6.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client6.user.id), {
                          body: Ticketslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });


                const folderPath = path.join(__dirname, '../../Bots/Ticket/slashcommand6');
                const ascii = require("ascii-table");
                const table = new ascii("Ticket commands").setJustify();
                for (let folder of readdirSync(folderPath).filter(
                  (folder) => !folder.includes(".")
                )) {
                  for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                    f.endsWith(".js")
                  )) {
                    let command = require(`${folderPath}/${folder}/${file}`);
                    if (command) {
                      Ticketslashcommands.push(command.data);
                      client6.Ticketslashcommands.set(command.data.name, command);
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