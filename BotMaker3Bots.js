const { Database } = require("st.db")
const db = new Database("database.json")
const BotToken = new Database('./Json-tokens/BotMaker_Tokens.json');
const chalk = require('chalk');
require('dotenv').config();
const botsMakerTokens = BotToken.get(`tokens_Tier_3`) || []

const { CoderServer, selllogsch, join_leavelog, owner } = require('./config.json');

const BotMakerDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const BOTMAKERDBSubTime = new Database("/Json-db/BotMaker/BotMakerSubTime.json");
const BotMakerSub = new Database("/Json-db/BotMaker/BotMakerSub.json")
const BOTMAKERDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const BOTMAKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSub")
const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");

const _ = require('lodash');

const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

const mainBot = require(`./index`)
const { SlashCommandBuilder, messageLink } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes, ChannelType } = require("discord-api-types/v9");


const { Probot } = require("discord-probot-transfer");
const ticketdb3 = new Database("/Json-db/Others/ticket-Number.json");
const PremuimDB = new Database("BotMakerTokens.json");
const db6 = new Database("/Json-db/Others/bots-statusdb.json");
const db2 = new Database("/Json-tokens/Tokens.json");
const db3 = new Database("/Json-db/Others/Bots-Price.json");
const db4 = new Database("/Json-db/Others/Number-of-tokens.json");
const prefixDB = new Database("/Json-db/Others/PrefixDB.json");
const ownerDB = new Database("/Json-db/Others/OwnerDB.json");
const os = require('os-utils');
const path = require('path');


const sourcebin = require('sourcebin_js');

botsMakerTokens.forEach(bot => {
  const { Client, MessageActionRow, MessageButton, MessageEmbed, WebhookClient, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
  const Discord = require('discord.js');
  const client = new Client({ intents: 32767 });
  const DiscordModals = require(`discord-modals`)
  DiscordModals(client);
  module.exports.bot = client;
  const { CoderServer, selllogsch, join_leavelog, owner } = require('./config.json');
  exports.BotMakerBotsClint = client;
  client.setMaxListeners(999999)



  client.on('ready', () => {
    console.log(chalk.magentaBright('The bot is ready'));
    console.log(chalk.red('Bot Name: ') + chalk.blue(client.user.tag));


        const botstatus = db.get('Status');
        client.user.setActivity('Bot Maker', {
          type: 'COMPETING',
          url: 'https://www.twitch.tv/Coder',
        });
        client.user.setPresence({
          status: botstatus,
        });

  });

  mainBot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    try {
      if (interaction.commandName === `leave`) {
        if (!interaction.guild || !owner.includes(interaction.user.id)) return
        let serverid = interaction.options.getString('serverid');
        let theguild = await client.guilds.cache.get(serverid);
        let lev;
        theguild.leave()
        interaction.editReply({ content: `Done Left ${serverid}`, ephemeral: true })
      }

    } catch (error) {
      console.log(error)
    }
  });


  // =================Dev=================
  //Whitelist System
  client.on("guildCreate", async (guild) => {
    const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client.user.id}`);
    if (!subs.includes(guild.id) &&
      guild.id !== "1077593691247620097" &&
      guild.id !== "1102027278646513724" &&
      guild.id !== "1071040653678608414") {
      guild.leave()
    }
  });

  //guildCreate
  client.on("guildCreate", async (guild) => {
    const owner = await client.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const targetGuildId = CoderServer;
    const targetChannelId = join_leavelog;
    const targetGuild = mainBot.guilds.cache.get(targetGuildId);
    const targetChannel = targetGuild.channels.cache.get(targetChannelId);

    const joinsEmbed = new MessageEmbed()
      .setTitle("Bot Maker Tier 3")
      .setColor("GREEN")
      .setDescription(`Joined: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}\nPremuimID: ${bot.Premuim} \nBot ID: ${client.user.id}`);

    targetChannel.send({ embeds: [joinsEmbed] });
  });

  //GuildDelete
  client.on("guildDelete", async (guild) => {
    const owner = await client.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const targetGuildId = CoderServer;
    const targetChannelId = join_leavelog;
    const targetGuild = mainBot.guilds.cache.get(targetGuildId);
    const targetChannel = targetGuild.channels.cache.get(targetChannelId);

    const leavesEmbed = new MessageEmbed()
      .setTitle("Bot Maker Tier 3")
      .setColor("RED")
      .setDescription(`Left: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}\nPremuimID: ${bot.Premuim} \nBot ID: ${client.user.id}`);

    targetChannel.send({ embeds: [leavesEmbed] });
  });

  client.on('ready', () => {
    const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client.user.id}`);
    client.guilds.cache.forEach((guild) => {
      if (!subs.includes(guild.id) && guild.id !== '1077593691247620097' && guild.id !== '1102027278646513724') {
        if (guild) {
          return guild.leave().catch(err => { })
        }
      }
    });
  });
  // =================require Dev=================

  const BOTMKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSubTime.json");
  const BOTMAKERDB = new Database("/Json-db/BotMaker/BotMakerSub.json");
  client.on('ready', () => {
    try {
      setInterval(() => {
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const subscriptions = BOTMKERSUBSDB.get(`TIMELEFTSUB`);
        if (subscriptions) {
          subscriptions.forEach(async subscription => {
            const { serverId, endTime, owner, Whitelist, Type } = subscription;
            if (moment(currentTime).isAfter(endTime)) {
              const whitelistedGuild = await client.guilds.fetch(serverId).catch(err => { })
              const guild = client.guilds.cache.get(mainGuild)
              const channel = guild.channels.cache.get(join_leavelog)
              if (guild && channel) {
                channel.send(`وقت اشتراك سيرفر ${serverId} قد انتهي
              **صاحب الاشتراك :** <@!${owner}> \`(${owner})\`
              **ايدي الاشتراك:** \`${Whitelist}\`
              **نوع الاشتراك :** ${Type}`)
              }


              const check = BOTMKERSUBSDB.get(`TIMELEFTSUB`);
              const RemoveServer = check.filter(re => re.Whitelist !== Whitelist && re.Type !== Type);
              BOTMAKERDB.pull(`AllowedServers_${client.user.id}`, serverId).then(() => {
                BOTMKERSUBSDB.set(`TIMELEFTSUB`, RemoveServer).then(() => {
                  if (whitelistedGuild) {
                    whitelistedGuild.leave();
                  } else {
                  }
                })
              })
            } else {

            }
          });
        }
      }, 1000);
    } catch (error) {
    }
  });

  const { readdirSync } = require('fs');
  const { Collection } = require('discord.js');

  client.login(bot.token).catch(err => console.log(`❌ Token are not working ${bot.Premuim}`));

  client.on("ready", async () => {
    const rest = new REST({ version: '9' }).setToken(bot.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(bot.CLIENTID), {
          body: slashcommands,
        });

      } catch (error) {
        console.error(error.message);
      }
    })();
  });

  client.slashcommands = new Collection();
  const slashcommands = [];

  const ascii = require('ascii-table');
  const table = new ascii('BotMaker3-commands').setJustify();
  for (let folder of readdirSync('./BotMaker Tier 3 SlashCommands/').filter(folder => !folder.includes('.'))) {
    for (let file of readdirSync('./BotMaker Tier 3 SlashCommands/' + folder).filter(f => f.endsWith('.js'))) {
      let command = require(`./BotMaker Tier 3 SlashCommands/${folder}/${file}`);
      if (command) {
        slashcommands.push(command.data);
        client.slashcommands.set(command.data.name, command);
        if (command.data.name) {
          table.addRow(`/${command.data.name}`, '🟢 Working');
        } else {
          table.addRow(`/${command.data.name}`, '🔴 Not Working');
        }
      }
    }
  }

  client.commands = new Discord.Collection();
  client.events = new Discord.Collection();
  client.buttons = new Discord.Collection();
  client.selectMenus = new Discord.Collection();
  client.modlas = new Discord.Collection();
  require("./handlers/commands")(client);
  require("./handlers/events")(client);
  require("./handlers/Button")(client);
  require("./handlers/selectMenus")(client);
  require("./handlers/Modal")(client);

  //BotMaker Tier 2 Modal Submit
  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isModalSubmit() &&
      interaction.customId === `BOTMAKERSUB_Tier2_MODAL`
    ) {
      try {
        interaction.reply(`[!] يتم معالجه المعلومات`)
        const { CoderServer } = require(`./config.json`)
        const db = new Database("/Json-db/BotMaker/BOTMAKERDB.json")
        const amount = db.get(`BotMaker_Amount_${client.user.id}_Tier_2`) || 0
        if (interaction.guild.id !== CoderServer && amount <= 0) {
          return interaction.channel.send({ content: `[😞] لا يوجد كميه متوفره من هذا النوع` })
        }
        if (interaction.guild.id !== CoderServer){
          db.set(`BotMaker_Amount_${client.user.id}_Tier_2`,amount - 1)
        }
        const SUB_ID = db4.get(`SUB_ID`) || 1;
        const Premuim = db4.get(`Premuim_ID`) || 1;

        const client_role = BotMakerDB.get(`ClientRole_${interaction.guild.id}`)
        const channel = BotMakerDB.get(`SellsLog_${interaction.guild.id}`)
        const logchannel = await client.channels.cache.get(channel);

        const ID = interaction.fields.getTextInputValue("Server_ID");
        const token = interaction.fields.getTextInputValue("Bot_Token");
        const prefix = interaction.fields.getTextInputValue("Bot_prefix");

        if (ID === 1102027278646513724 || ID === "1102027278646513724" || ID === interaction.guild.id) return interaction.reply(`لا يمكنك شراء اشتراك للسيرفر الاساسي`)

        const client1 = new Client({ intents: 32767 });
        client1.login(token).then(async () => {
          client1.setMaxListeners(999999)
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const endTime = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

          let owner = interaction.user.id;

          const invite_Button = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(`LINK`)
              .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client1.user.id}&permissions=8&scope=bot%20applications.commands`)
              .setLabel(`invite`)
              .setDisabled(false),
          ]);

          interaction.reply({
            content: `***تم الاشتراك بنجاح***
                              *الاشتراك يبدا من الان قم بادخال البوت الي سيرفرك عن طريق الضغط علي الزر*`,
            components: [invite_Button]
          }).then(() => {
            db4.set(`SUB_ID`, SUB_ID + 1);
            db4.set(`Premuim_ID`, Premuim + 1);
          });//تعديل


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
                                          *BotID :* ${client1.user.id}`
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
            const MainServer = client.guilds.cache.get(CoderServer);
            const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
            if (MainServerLogChannel) {
              MainServerLogChannel.send(`Bot Maker Tier 2 has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>\nClientID:${client.user.id}`);
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
          client1.commands = new Discord.Collection();
          client1.events = new Discord.Collection();
          client1.buttons = new Discord.Collection();
          client1.selectMenus = new Discord.Collection();
          client.modlas = new Discord.Collection();
          require("./handlers/BotMaker2_commands")(client1);
          require("./intercationCreate/BotMaker/handlers2/events")(client1);
          require("./handlers/BotMaker2_Button")(client1);
          require("./handlers/BotMaker2_selectMenus")(client1);
          require("./handlers/BotMaker2_Modlas")(client1);


          //Whitelist System
          client1.on("guildCreate", async (guild) => {
            const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client1.user.id}`);
            if (!subs.includes(guild.id) &&
              guild.id !== "1077593691247620097" &&
              guild.id !== "1102027278646513724" &&
              guild.id !== "1071040653678608414") {
              guild.leave()
            }
          });


          

          BotMakerSub.push(`AllowedServers_${client1.user.id}`, ID)
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
                CLIENTID: client1.user.id,
                Premuim: Premuim
              })
            }).then(() => {
              prefixDB.set(`Prefix_${client1.user.id}_Premuim`, prefix).then(() => {
                ownerDB.set(`Owner_${client1.user.id}_Premuim`, interaction.user.id)
              }).then(()=>{
                interaction.message.delete();
              })
            })

        }).catch((error) => {
          console.log(error)
          return interaction.reply('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
        })
        client1.on('ready', () => {



              client1.user.setActivity('Bot Maker', {
                type: 'COMPETING',
                url: 'https://www.twitch.tv/Coder',
              });
              client1.user.setPresence({
                status: "online",
              });
        });

        client1.on("ready", async () => {
          const rest = new REST({ version: '9' }).setToken(token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(client1.user.id), {
                body: slashcommands,
              });

            } catch (error) {
              console.error(error.message);
            }
          })();
        });

        client1.slashcommands = new Collection();
        const slashcommands = [];

        const SlashFolder = path.join(__dirname, './BotMaker Tier 2 SlashCommands');

        const ascii = require('ascii-table');
        const table = new ascii('BotMaker2-commands').setJustify();
        for (let folder of readdirSync(`${SlashFolder}/`).filter(folder => !folder.includes('.'))) {
          for (let file of readdirSync(`${SlashFolder}/` + folder).filter(f => f.endsWith('.js'))) {
            let command = require(`${SlashFolder}/${folder}/${file}`);
            if (command) {
              slashcommands.push(command.data);
              client1.slashcommands.set(command.data.name, command);
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
  });

  //BotMaker Tier 3 Modal Submit
  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isModalSubmit() &&
      interaction.customId === `BOTMAKERSUB_Tier3_MODAL`
    ) {
      try {
        interaction.reply(`[!] يتم معالجه المعلومات`)
        const { CoderServer } = require(`./config.json`)
        const db = new Database("/Json-db/BotMaker/BOTMAKERDB.json")
        const amount = db.get(`BotMaker_Amount_${client.user.id}_Tier_3`) || 0
        if (interaction.guild.id !== CoderServer && amount <= 0) {
          return interaction.channel.send({ content: `[😞] لا يوجد كميه متوفره من هذا النوع` })
        }
        

        const SUB_ID = db4.get(`SUB_ID`) || 1;
        const Premuim = db4.get(`Premuim_ID`) || 1;

        const client_role = BotMakerDB.get(`ClientRole_${interaction.guild.id}`)
        const channel = BotMakerDB.get(`SellsLog_${interaction.guild.id}`)
        const logchannel = await client.channels.cache.get(channel);

        const ID = interaction.fields.getTextInputValue("Server_ID");
        const token = interaction.fields.getTextInputValue("Bot_Token");
        const prefix = interaction.fields.getTextInputValue("Bot_prefix");

        if (ID === 1102027278646513724 || ID === "1102027278646513724" || ID === interaction.guild.id) return interaction.reply(`لا يمكنك شراء اشتراك للسيرفر الاساسي`)

        const client1 = new Client({ intents: 32767 });
        client1.login(token).then(async () => {
          if (interaction.guild.id !== CoderServer){
            db.set(`BotMaker_Amount_${client.user.id}_Tier_3`,amount - 1)
          }
          client1.setMaxListeners(999999)
          const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
          const endTime = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

          let owner = interaction.user.id;

          const invite_Button = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(`LINK`)
              .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client1.user.id}&permissions=8&scope=bot%20applications.commands`)
              .setLabel(`invite`)
              .setDisabled(false),
          ]);

          interaction.reply({
            content: `***تم الاشتراك بنجاح***
                              *الاشتراك يبدا من الان قم بادخال البوت الي سيرفرك عن طريق الضغط علي الزر*`,
            components: [invite_Button]
          }).then(() => {
            db4.set(`SUB_ID`, SUB_ID + 1);
            db4.set(`Premuim_ID`, Premuim + 1);
          });//تعديل



          if (client_role) {
            try {
              const role = interaction.guild.roles.cache.find(
                (r) => r.id === client_role
              );
              await interaction.member.roles.add(role)
            } catch (error) {
              console.log(`I cant find client role in BotMaker3`)//تعديل
            }
          }

          const buyer = interaction.user;
          const buyerembed = new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setTitle(`__BotMaker Tier 3 Subscribe___`)
            .setDescription(
              `*لقد قمت بالاشتراك في Hyphen Bot Maker*
                                          - مده الاشتراك 30 يوم
                                          *WhiteListID :* \`${SUB_ID}\`
                                          - تستخدم هذا الكود لتجديد الاشتراك في اي وقت\n
                                          *BotID :* ${client1.user.id}`
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
            const MainServer = client.guilds.cache.get(CoderServer);
            const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
            if (MainServerLogChannel) {
              MainServerLogChannel.send(`Bot Maker Tier 3 has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>\nClientID:${client.user.id}`);
            }
          } catch (error) {
            console.log(error.message)
          }
          if (logchannel && logchannel.type === 'GUILD_TEXT') {
            try {
              logchannel.send(
                `BotMaker Tier 3 1 Month\\Subscription has been purchased by **${buyer.username}**`
              );
            } catch (error) {
              console.log(`I cant find sells log channel in BotMaker2`)//تعديل
            }
          }
          client1.commands = new Discord.Collection();
          client1.events = new Discord.Collection();
          client1.buttons = new Discord.Collection();
          client1.selectMenus = new Discord.Collection();
          client1.modlas = new Discord.Collection();
          require("./handlers/BotMaker2_commands")(client1);
          require("./intercationCreate/BotMaker/handlers2/events")(client1);
          require("./handlers/BotMaker2_Button")(client1);
          require("./handlers/BotMaker2_selectMenus")(client1);
          require("./handlers/BotMaker2_Modlas")(client1);

          //Whitelist System
          client1.on("guildCreate", async (guild) => {
            const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client1.user.id}`);
            if (!subs.includes(guild.id) &&
              guild.id !== "1077593691247620097" &&
              guild.id !== "1102027278646513724" &&
              guild.id !== "1071040653678608414") {
              guild.leave()
            }
          });




          BotMakerSub.push(`AllowedServers_${client1.user.id}`, ID)
            .then(() => {
              BOTMAKERDBSubTime.push(`TIMELEFTSUB`, {
                serverId: ID,
                owner: owner,
                Whitelist: SUB_ID,
                Type: "BotMaker Tier 3",
                startTime: startTime,
                endTime: endTime
              })
            }).then(() => {
              BotToken.push(`tokens_Tier_3`, {
                token: token,
                CLIENTID: client1.user.id,
                Premuim: Premuim
              })
            }).then(() => {
              prefixDB.set(`Prefix_${client1.user.id}_Premuim`, prefix).then(() => {
                ownerDB.set(`Owner_${client1.user.id}_Premuim`, interaction.user.id)
              }).then(()=>{
                interaction.message.delete();
              })
            })

        }).catch((error) => {
          console.log(error)
          return interaction.reply('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
        })
        client1.on('ready', () => {



              client1.user.setActivity('Bot Maker', {
                type: 'COMPETING',
                url: 'https://www.twitch.tv/Coder',
              });
              client1.user.setPresence({
                status: "online",
              });

        });

        client1.on("ready", async () => {
          const rest = new REST({ version: '9' }).setToken(token);
          (async () => {
            try {
              await rest.put(Routes.applicationCommands(client1.user.id), {
                body: slashcommands,
              });

            } catch (error) {
              console.error(error.message);
            }
          })();
        });

        client1.slashcommands = new Collection();
        const slashcommands = [];

        const SlashFolder = path.join(__dirname, './BotMaker Tier 3 SlashCommands');

        const ascii = require('ascii-table');
        const table = new ascii('BotMaker2-commands').setJustify();
        for (let folder of readdirSync(`${SlashFolder}/`).filter(folder => !folder.includes('.'))) {
          for (let file of readdirSync(`${SlashFolder}/` + folder).filter(f => f.endsWith('.js'))) {
            let command = require(`${SlashFolder}/${folder}/${file}`);
            if (command) {
              slashcommands.push(command.data);
              client1.slashcommands.set(command.data.name, command);
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
  });
})