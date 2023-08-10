const { Database } = require("st.db")
const db = new Database("database.json")
const BotToken = new Database('./Json-tokens/BotMaker_Tokens.json');
const chalk = require('chalk');
require('dotenv').config();
const botsMakerTokens = BotToken.get(`tokens_Tier_2`) || []

const { CoderServer, selllogsch, join_leavelog, owner } = require('./config.json');

const mainBot = require(`./index`)
const { SlashCommandBuilder, messageLink } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes, ChannelType } = require("discord-api-types/v9");
const _ = require('lodash');

const BOTMAKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSub")
const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");

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

const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

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
      .setTitle("Bot Maker Tier 2")
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
      .setTitle("Bot Maker Tier 2")
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
  const table = new ascii('BotMaker2-commands').setJustify();
  for (let folder of readdirSync('./BotMaker Tier 2 SlashCommands/').filter(folder => !folder.includes('.'))) {
    for (let file of readdirSync('./BotMaker Tier 2 SlashCommands/' + folder).filter(f => f.endsWith('.js'))) {
      let command = require(`./BotMaker Tier 2 SlashCommands/${folder}/${file}`);
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
})