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
    name: "Log_MODAL",
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
            const LogID = db4.get(`Log_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const logdb = new Database("/Json-db/Bots/LogDB.json")

            const client14 = new Client({ intents: 32767 });
            client14.login(token)
                .then(async () => {
                    db4.set(`Log_ID`, LogID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client14.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Log bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Log bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${LogID}\`\n`
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
                            console.log(`I cant find client role in Log`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Logs bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Log bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Log`)//تعديل
                        }
                    }

                    // client14.commands = new Collection();
                    client14.events = new Collection();
                    // require("../../handlers/Log-commands")(client14);
                    require("../../Bots/Log/handlers/events")(client14);

                    client14.on("messageDelete", async (message) => {
                        if (logdb.has(`log_messagedelete_${message.guild.id}`)) {
                          let deletelog1 = logdb.get(`log_messagedelete_${message.guild.id}`)
                          let deletelog2 = message.guild.channels.cache.get(deletelog1)
                          const fetchedLogs = await message.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'MESSAGE_DELETE'
                          });
                          const deletionLog = fetchedLogs.entries.first();
                          const { executor, target } = deletionLog;
                          let deleteembed = new MessageEmbed()
                            .setTitle(`**تم حذف رسالة**`)
                    
                            .addFields(
                              {
                                name: `**صاحب الرسالة : **`, value: `**\`\`\`${message.author.tag} - (${message.author.id})\`\`\`**`, inline: false
                              },
                              {
                                name: `**حاذف الرسالة : **`, value: `**\`\`\`${executor.username} - (${executor.id})\`\`\`**`, inline: false
                              },
                              {
                                name: `**محتوى الرسالة : **`, value: `**\`\`\`${message.content}\`\`\`**`, inline: false
                              },
                              {
                                name: `**الروم الذي تم الحذف فيه : **`, value: `${message.channel}`, inline: false
                              }
                            )
                            .setTimestamp();
                          await deletelog2.send({ embeds: [deleteembed] })
                        }
                      })
                    
                      client14.on("messageUpdate", async (oldMessage, newMessage) => {
                        if (logdb.has(`log_messageupdate_${oldMessage.guild.id}`)) {
                          let updateLog1 = logdb.get(`log_messageupdate_${oldMessage.guild.id}`);
                          let updateLog2 = oldMessage.guild.channels.cache.get(updateLog1);
                    
                          const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'MESSAGE_UPDATE'
                          });
                    
                          const updateLog = fetchedLogs.entries.first();
                          const { executor } = updateLog;
                    
                          let updateEmbed = new MessageEmbed()
                            .setTitle("**تم تحديث رسالة**")
                            .addFields(
                              {
                                name: "**صاحب الرسالة:**",
                                value: `**\`\`\`${oldMessage.author.tag} (${oldMessage.author.id})\`\`\`**`,
                                inline: false
                              },
                              {
                                name: "**المحتوى القديم:**",
                                value: `**\`\`\`${oldMessage.content}\`\`\`**`,
                                inline: false
                              },
                              {
                                name: "**المحتوى الجديد:**",
                                value: `**\`\`\`${newMessage.content}\`\`\`**`,
                                inline: false
                              },
                              {
                                name: "**الروم الذي تم التحديث فيه:**",
                                value: `${oldMessage.channel}`,
                                inline: false
                              }
                            )
                            .setTimestamp();
                    
                          await updateLog2.send({ embeds: [updateEmbed] });
                        }
                      });
                    
                      client14.on('roleCreate', async (role) => {
                        if (logdb.has(`log_rolecreate_${role.guild.id}`)) {
                          let roleCreateLog1 = logdb.get(`log_rolecreate_${role.guild.id}`);
                          let roleCreateLog2 = role.guild.channels.cache.get(roleCreateLog1);
                    
                          const fetchedLogs = await role.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'ROLE_CREATE'
                          });
                    
                          const roleCreateLog = fetchedLogs.entries.first();
                          const { executor } = roleCreateLog;
                    
                          let permissions = role.permissions.toArray().map((p) => `\`${p}\``).join(', ');
                    
                          let roleCreateEmbed = new MessageEmbed()
                            .setTitle('**تم انشاء رتبة**')
                            .addFields(
                              { name: 'اسم الرتبة :', value: `\`\`\`${role.name}\`\`\``, inline: true },
                              { name: 'الذي قام بانشاء الرتبة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
                            )
                            .setTimestamp();
                    
                          await roleCreateLog2.send({ embeds: [roleCreateEmbed] });
                        }
                      });
                      client14.on('roleDelete', async (role) => {
                        if (logdb.has(`log_roledelete_${role.guild.id}`)) {
                          let roleDeleteLog1 = logdb.get(`log_roledelete_${role.guild.id}`);
                          let roleDeleteLog2 = role.guild.channels.cache.get(roleDeleteLog1);
                    
                          const fetchedLogs = await role.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'ROLE_DELETE'
                          });
                    
                          const roleDeleteLog = fetchedLogs.entries.first();
                          const { executor } = roleDeleteLog;
                    
                          let roleDeleteEmbed = new MessageEmbed()
                            .setTitle('**تم حذف رتبة**')
                            .addField('اسم الرتبة :', `\`\`\`${role.name}\`\`\``, true)
                            .addField('الذي قام بحذف الرتبة :', `\`\`\`${executor.username} (${executor.id})\`\`\``, true)
                            .setTimestamp();
                    
                          await roleDeleteLog2.send({ embeds: [roleDeleteEmbed] });
                        }
                      });
                      client14.on('channelCreate', async (channel) => {
                        if (logdb.has(`log_channelcreate_${channel.guild.id}`)) {
                          let channelCreateLog1 = logdb.get(`log_channelcreate_${channel.guild.id}`);
                          let channelCreateLog2 = channel.guild.channels.cache.get(channelCreateLog1);
                    
                          const fetchedLogs = await channel.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'CHANNEL_CREATE'
                          });
                    
                          const channelCreateLog = fetchedLogs.entries.first();
                          const { executor } = channelCreateLog;
                    
                          let channelCategory = channel.parent ? channel.parent.name : 'None';
                    
                          let channelCreateEmbed = new MessageEmbed()
                            .setTitle('**تم انشاء روم**')
                            .addFields(
                              { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                              { name: 'كاتيجوري الروم : ', value: `\`\`\`${channelCategory}\`\`\``, inline: true },
                              { name: 'الذي قام بانشاء الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
                            )
                            .setTimestamp();
                    
                          await channelCreateLog2.send({ embeds: [channelCreateEmbed] });
                        }
                      });
                    
                      client14.on('channelDelete', async (channel) => {
                        if (logdb.has(`log_channeldelete_${channel.guild.id}`)) {
                          let channelDeleteLog1 = logdb.get(`log_channeldelete_${channel.guild.id}`);
                          let channelDeleteLog2 = channel.guild.channels.cache.get(channelDeleteLog1);
                    
                          const fetchedLogs = await channel.guild.fetchAuditLogs({
                            limit: 1,
                            type: 'CHANNEL_DELETE'
                          });
                    
                          const channelDeleteLog = fetchedLogs.entries.first();
                          const { executor } = channelDeleteLog;
                    
                          let channelDeleteEmbed = new MessageEmbed()
                            .setTitle('**تم حذف روم**')
                            .addFields(
                              { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
                              { name: 'الذي قام بحذف الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
                            )
                            .setTimestamp();
                    
                          await channelDeleteLog2.send({ embeds: [channelDeleteEmbed] });
                        }
                      });
                      client14.on('guildMemberUpdate', async (oldMember, newMember) => {
                        const guild = oldMember.guild;
                    
                        const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
                        const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
                    
                        if (addedRoles.size > 0 && logdb.has(`log_rolegive_${guild.id}`)) {
                          let roleGiveLog1 = logdb.get(`log_rolegive_${guild.id}`);
                          let roleGiveLog2 = guild.channels.cache.get(roleGiveLog1);
                    
                          const fetchedLogs = await guild.fetchAuditLogs({
                            limit: addedRoles.size,
                            type: 'MEMBER_ROLE_UPDATE'
                          });
                    
                          addedRoles.forEach((role) => {
                            const roleGiveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
                            const roleGiver = roleGiveLog ? roleGiveLog.executor : null;
                            const roleGiverUsername = roleGiver ? `${roleGiver.username} (${roleGiver.id})` : `UNKNOWN`;
                    
                            let roleGiveEmbed = new MessageEmbed()
                              .setTitle('**تم إعطاء رتبة لعضو**')
                              .addFields(
                                { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
                                { name: 'تم إعطاءها بواسطة:', value: `\`\`\`${roleGiverUsername}\`\`\``, inline: true },
                                { name: 'تم إعطائها للعضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
                              )
                              .setTimestamp();
                    
                            roleGiveLog2.send({ embeds: [roleGiveEmbed] });
                          });
                        }
                    
                        if (removedRoles.size > 0 && logdb.has(`log_roleremove_${guild.id}`)) {
                          let roleRemoveLog1 = logdb.get(`log_roleremove_${guild.id}`);
                          let roleRemoveLog2 = guild.channels.cache.get(roleRemoveLog1);
                    
                          const fetchedLogs = await guild.fetchAuditLogs({
                            limit: removedRoles.size,
                            type: 'MEMBER_ROLE_UPDATE'
                          });
                    
                          removedRoles.forEach((role) => {
                            const roleRemoveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
                            const roleRemover = roleRemoveLog ? roleRemoveLog.executor : null;
                            const roleRemoverUsername = roleRemover ? `${roleRemover.username} (${roleRemover.id})` : `UNKNOWN`;
                    
                            let roleRemoveEmbed = new MessageEmbed()
                              .setTitle('**تم إزالة رتبة من عضو**')
                              .addFields(
                                { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
                                { name: 'تم إزالتها بواسطة:', value: `\`\`\`${roleRemoverUsername}\`\`\``, inline: true },
                                { name: 'تم إزالتها من العضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
                              )
                              .setTimestamp();
                    
                            roleRemoveLog2.send({ embeds: [roleRemoveEmbed] });
                          });
                        }
                      });
                    
                    
                      client14.on('guildMemberAdd', async (member) => {
                        const guild = member.guild;
                    
                        const fetchedLogs = await guild.fetchAuditLogs({
                          limit: 1,
                          type: 'BOT_ADD'
                        });
                    
                        const botAddLog = fetchedLogs.entries.first();
                        const { executor, target } = botAddLog;
                    
                        if (target instanceof Discord.User && target.bot) {
                          let botAddLog1 = logdb.get(`log_botadd_${guild.id}`);
                          let botAddLog2 = guild.channels.cache.get(botAddLog1);
                    
                          let botAddEmbed = new MessageEmbed()
                            .setTitle('**تم اضافة بوت جديد الى السيرفر**')
                            .addFields(
                              { name: 'اسم البوت :', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
                              { name: 'ايدي البوت :', value: `\`\`\`${member.user.id}\`\`\``, inline: true },
                              { name: 'هل لدية صلاحية الادمن ستريتور ؟ :', value: member.permissions.has('ADMINISTRATOR') ? `\`\`\`نعم لديه\`\`\`` : `\`\`\`لا ليس لديه\`\`\``, inline: true },
                              { name: 'تم اضافته بواسطة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: false }
                            )
                            .setTimestamp();
                    
                          botAddLog2.send({ embeds: [botAddEmbed] });
                        }
                      });
                    
                      client14.on('guildBanAdd', async (guild, user) => {
                        if (logdb.has(`log_banadd_${guild.id}`)) {
                          let banAddLog1 = logdb.get(`log_banadd_${guild.id}`);
                          let banAddLog2 = guild.channels.cache.get(banAddLog1);
                    
                          const fetchedLogs = await guild.fetchAuditLogs({
                            limit: 1,
                            type: 'MEMBER_BAN_ADD'
                          });
                    
                          const banAddLog = fetchedLogs.entries.first();
                          const banner = banAddLog ? banAddLog.executor : null;
                          const bannerUsername = banner ? `\`\`\`${banner.username} (${banner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;
                    
                          let banAddEmbed = new MessageEmbed()
                            .setTitle('**تم حظر عضو**')
                            .addFields(
                              { name: 'العضو المحظور:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
                              { name: 'تم حظره بواسطة:', value: bannerUsername },
                            )
                            .setTimestamp();
                    
                          banAddLog2.send({ embeds: [banAddEmbed] });
                        }
                      });
                    
                      client14.on('guildBanRemove', async (guild, user) => {
                        if (logdb.has(`log_bandelete_${guild.id}`)) {
                          let banRemoveLog1 = logdb.get(`log_bandelete_${guild.id}`);
                          let banRemoveLog2 = guild.channels.cache.get(banRemoveLog1);
                    
                          const fetchedLogs = await guild.fetchAuditLogs({
                            limit: 1,
                            type: 'MEMBER_BAN_REMOVE'
                          });
                    
                          const banRemoveLog = fetchedLogs.entries.first();
                          const unbanner = banRemoveLog ? banRemoveLog.executor : null;
                          const unbannerUsername = unbanner ? `\`\`\`${unbanner.username} (${unbanner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;
                    
                          let banRemoveEmbed = new MessageEmbed()
                            .setTitle('**تم إزالة حظر عضو**')
                            .addFields(
                              { name: 'العضو المفكّر الحظر عنه:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
                              { name: 'تم إزالة الحظر بواسطة:', value: unbannerUsername }
                            )
                            .setTimestamp();
                    
                          banRemoveLog2.send({ embeds: [banRemoveEmbed] });
                        }
                      });
                    
                      client14.on('guildMemberRemove', async (member) => {
                        const guild = member.guild;
                        if (logdb.has(`log_kickadd_${guild.id}`)) {
                          const kickLogChannelId = logdb.get(`log_kickadd_${guild.id}`);
                          const kickLogChannel = guild.channels.cache.get(kickLogChannelId);
                    
                          const fetchedLogs = await guild.fetchAuditLogs({
                            limit: 1,
                            type: 'MEMBER_KICK',
                          });
                    
                          const kickLog = fetchedLogs.entries.first();
                          const kicker = kickLog ? kickLog.executor : null;
                          const kickerUsername = kicker ? `\`\`\`${kicker.username} (${kicker.id})\`\`\`` : 'Unknown';
                    
                          const kickEmbed = new MessageEmbed()
                            .setTitle('**تم طرد عضو**')
                            .addFields(
                              { name: 'العضو المطرود:', value: `\`\`\`${member.user.tag} (${member.user.id})\`\`\`` },
                              { name: 'تم طرده بواسطة:', value: kickerUsername },
                            )
                            .setTimestamp();
                    
                          kickLogChannel.send({ embeds: [kickEmbed] });
                        }
                      });
                    
                      client14.on('guildUpdate', async (oldGuild, newGuild) => {
                        const guild = newGuild;
                        if (oldGuild.name !== newGuild.name || oldGuild.region !== newGuild.region || oldGuild.icon !== newGuild.icon) {
                          if (logdb.has(`log_serversettings_${guild.id}`)) {
                            const serverSettingsLogChannelId = logdb.get(`log_serversettings_${guild.id}`);
                            const serverSettingsLogChannel = guild.channels.cache.get(serverSettingsLogChannelId);
                    
                            const serverSettingsEmbed = new MessageEmbed()
                              .setTitle('**تم تغيير إعدادات السيرفر**')
                              .addFields(
                                { name: 'الاسم الجديد للسيرفر:', value: `\`\`\`${newGuild.name}\`\`\`` },
                                { name: 'المنطقة الجديدة للسيرفر:', value: `\`\`\`${newGuild.region ?? "لم يتم التحديد"}\`\`\`` },
                                { name: 'مستوى التحقق الجديد:', value: `\`\`\`${guild.verificationLevel ?? "لم يتم التحديد"}\`\`\`` },
                    
                              )
                              .setTimestamp();
                    
                            serverSettingsLogChannel.send({ embeds: [serverSettingsEmbed] });
                          }
                        }
                      });

                    db2.push(`log`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${LogID}`,
                        CLIENTID: client14.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client14.user.id}_log`, prefix).then(() => {
                            ownerDB.set(`Owner_${client14.user.id}_log`, owner)
                        }).then(()=>{

                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })
                client14.on('ready', async () => {
                    let statusIndex = 0;
                    setInterval(() => {
                      const data = logdb.get(`log_Status_${client14.user.id}`) || []
                      const Activity = data.Activity
                      const type = data.Type
                      const botstatus = data.Presence || "online"
                      const statuses = [
                        Activity
                      ];
                
                      client14.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
                      client14.user.setPresence({
                        status: botstatus,
                      });
                      statusIndex = (statusIndex + 1) % statuses.length;
                    }, 1000);
                  });
                
                
                  client14.Logbotsslashcommands = new Collection();
                  const Logbotsslashcommands = [];
                
                
                  client14.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client14.user.id), {
                          body: Logbotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });

                  const folderPath = path.join(__dirname, '../../Bots/Log/slashcommand13');
                  const ascii = require("ascii-table");
                  const table = new ascii("Log commands").setJustify();
                  for (let folder of readdirSync(folderPath).filter(
                    (folder) => !folder.includes(".")
                  )) {
                    for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
                      f.endsWith(".js")
                    )) {
                      let command = require(`${folderPath}/${folder}/${file}`);
                      if (command) {
                        Logbotsslashcommands.push(command.data);
                        client14.Logbotsslashcommands.set(command.data.name, command);
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