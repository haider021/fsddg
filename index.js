const { Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client({ intents: 32767 });
const DiscordModals = require(`discord-modals`);
DiscordModals(client);
const { token, prefix, CLIENTID, mainGuild, mongoDB, join_leavelog } = require("./config.json");
const { Database } = require("st.db");
const db = new Database("database.json");
const chalk = require("chalk");
client.login(token).catch((err) => console.log("❌ Token are not working"));
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const os = require('os-utils');
const { mongoose } = require("mongoose")
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');


const BOTMAKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSub.json")



client.on("ready", async () => {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(chalk.green("Connected to DB"));
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB', error);
    });
});

module.exports = client;
exports.mainBot = client;
client.on("ready", async () => {
  const rest = new REST({ version: "9" }).setToken(token);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(CLIENTID), {
        body: slashcommands,
      });

      console.log("/ Commands are loaded");
    } catch (error) {
      console.error(error);
    }
    try {
      await rest.put(Routes.applicationGuildCommands(CLIENTID, mainGuild), {
        body: Guildcommands,
      });

      console.log("/guild Commands are loaded");
    } catch (error) {
      console.error(error);
    }
  })();
});



client.slashcommands = new Collection();
const slashcommands = [];

const ascii = require("ascii-table");
const table = new ascii("P-Commands").setJustify();
for (let folder of readdirSync("./PuplicSlashCommand/").filter(
  (folder) => !folder.includes(".")
)) {
  for (let file of readdirSync("./PuplicSlashCommand/" + folder).filter((f) =>
    f.endsWith(".js")
  )) {
    let command = require(`./PuplicSlashCommand/${folder}/${file}`);
    if (command) {
      slashcommands.push(command.data);
      client.slashcommands.set(command.data.name, command);
      if (command.data.name) {
        table.addRow(`/${command.data.name}`, "🟢 Working");
      } else {
        table.addRow(`/${command.data.name}`, "🔴 Not Working");
      }
    }
  }
}
console.log(table.toString());

client.Guildcommands = new Collection();
const Guildcommands = [];
const Guildtable = new ascii("G-Commands").setJustify();
for (let folder of readdirSync("./PrivateSlashCommand/").filter(
  (folder) => !folder.includes(".")
)) {
  for (let file of readdirSync("./PrivateSlashCommand/" + folder).filter((f) =>
    f.endsWith(".js")
  )) {
    let command = require(`./PrivateSlashCommand/${folder}/${file}`);
    if (command) {
      Guildcommands.push(command.data);
      client.Guildcommands.set(command.data.name, command);
      if (command.data.name) {
        Guildtable.addRow(`/${command.data.name}`, "🟢 Working");
      } else {
        Guildtable.addRow(`/${command.data.name}`, "🔴 Not Working");
      }
    }
  }
}
console.log(Guildtable.toString());

const process = require("process");



client.on('ready', () => {
  console.log(chalk.magentaBright('The bot is ready'));
  console.log(chalk.red('Bot Name: ') + chalk.blue(client.user.tag));

      const ramUsage = os.freememPercentage() * 100;


      const botstatus = db.get('Status');
      client.user.setActivity('Bot Maker', {
        type: 'COMPETING',
        url: 'https://www.twitch.tv/Coder',
      });
      client.user.setPresence({
        status: botstatus,
      });
});



// setInterval(async () => {
//   const db6 = new Database("/Json-db/Others/bots-statusdb.json");
//   const db3 = new Database("/Json-db/Others/Bots-Price.json");
//   const db4 = new Database("/Json-db/Others/Number-of-tokens.json");
//   const channelID = "1102034521903333467";
//   const messageId = db.get("LivemessageID");
//   const Livechannel = client.channels.cache.get(channelID);
//   if (!Livechannel) return;
//   const LiveMessage = await Livechannel.messages.fetch("1103757113035083797");
//   if (!LiveMessage) return;

//   const AutolineID = db4.get(`Autoline_ID`) || 1;
//   const autolinerealnum = AutolineID - 1;
//   let autolineprice = db3.get(`AutolineP`) || `15000`;
//   let Autolinecheck = db6.get(`Autoline`);
//   let Autoline = "";
//   if (!db6.has(`Autolinecheck`)) Autoline = `Working :green_circle:`;
//   if (Autolinecheck === "1") Autoline = `Working :green_circle:`;
//   if (Autolinecheck === "0") Autoline = `Not working :red_circle:`;

//   const SuggestionID = db4.get(`Suggestion_ID`) || 1;
//   const suggestionrealnum = SuggestionID - 1;
//   let suggestionprice = db3.get(`SuggestionP`) || `15000`;
//   let Suggestioncheck = db6.get(`Suggestion`);
//   let Suggestion = "";
//   if (!db6.has(`Suggestioncheck`)) Suggestion = `Working :green_circle:`;
//   if (Suggestioncheck === "1") Suggestion = `Working :green_circle:`;
//   if (Suggestioncheck === "0") Suggestion = `Not working :red_circle:`;

//   const TaxID = db4.get(`Tax_ID`) || 1;
//   const autotaxrealnum = TaxID - 1;
//   const taxprice = db3.get(`TaxP`) || `15000`;
//   let Autotaxcheck = db6.get(`Tax`);
//   let Autotax = "";
//   if (!db6.has(`Autotaxcheck`)) Autotax = `Working :green_circle:`;
//   if (Autotaxcheck === "1") Autotax = `Working :green_circle:`;
//   if (Autotaxcheck === "0") Autotax = `Not working :red_circle:`;

//   const BankID = db4.get(`Credit_ID`) || 1;
//   const bankrealnum = BankID - 1;
//   const bankprice = db3.get(`BankP`) || `15000`;
//   let Bankcheck = db6.get(`Bank`);
//   let Bank = "";
//   if (!db6.has(`Bankcheck`)) Bank = `Working :green_circle:`;
//   if (Bankcheck === "1") Bank = `Working :green_circle:`;
//   if (Bankcheck === "0") Bank = `Not working :red_circle:`;

//   const TicketID = db4.get(`Ticket_ID`) || 1;
//   const ticketrealnum = TicketID - 1;
//   const ticketprice = db3.get(`TicketP`) || `15000`;
//   let Ticketcheck = db6.get(`Ticket`);
//   let Ticket = "";
//   if (!db6.has(`Ticketcheck`)) Ticket = `Working :green_circle:`;
//   if (Ticketcheck === "1") Ticket = `Working :green_circle:`;
//   if (Ticketcheck === "0") Ticket = `Not working :red_circle:`;

//   const SystemID = db4.get(`System_ID`) || 1;
//   const systemrealnum = SystemID - 1;
//   let systemprice = db3.get(`SystemP`) || `15000`;
//   let Systemcheck = db6.get(`System`);
//   let System = "";
//   if (!db6.has(`Systemcheck`)) System = `Working :green_circle:`;
//   if (Systemcheck === "1") System = `Working :green_circle:`;
//   if (Systemcheck === "0") System = `Not working :red_circle:`;

//   const BrodcastID = db4.get(`Brodcast_ID`) || 1;
//   const brodcastrealnum = BrodcastID - 1;
//   let brodcastprice = db3.get(`BrodcastP`) || `15000`;
//   let brodcastcheck = db6.get(`Brodcast`);
//   let Brodcast = "";
//   if (!db6.has(`Brodcastcheck`)) Brodcast = `Working :green_circle:`;
//   if (brodcastcheck === "1") Brodcast = `Working :green_circle:`;
//   if (brodcastcheck === "0") Brodcast = `Not working :red_circle:`;

//   const GiveawayID = db4.get(`Giveaways_ID`) || 1;
//   const giveawayrealnum = GiveawayID - 1;
//   let giveawayprice = db3.get(`GiveawayP`) || `15000`;
//   let giveawaycheck = db6.get(`Giveaway`);
//   let Giveaway = "";
//   if (!db6.has(`giveawaycheck`)) Giveaway = `Working :green_circle:`;
//   if (giveawaycheck === "1") Giveaway = `Working :green_circle:`;
//   if (giveawaycheck === "0") Giveaway = `Not working :red_circle:`;

//   const ScammerID = db4.get(`Scammer_ID`) || 1;
//   const scammerrealnum = ScammerID - 1;
//   let scammerprice = db3.get(`ScammerP`) || `15000`;
//   let scammercheck = db6.get(`Scammer`);
//   let Scammer = "";
//   if (!db6.has(`scammercheck`)) Scammer = `Working :green_circle:`;
//   if (scammercheck === "1") Scammer = `Working :green_circle:`;
//   if (scammercheck === "0") Scammer = `Not working :red_circle:`;

//   const ProbotID = db4.get(`Probot_ID`) || 1;
//   const probotrealnum = ProbotID - 1;
//   let probotprice = db3.get(`ProbotP`) || `15000`;
//   let probotcheck = db6.get(`Probot`);
//   let Probot = "";
//   if (!db6.has(`probotcheck`)) Probot = `Working :green_circle:`;
//   if (probotcheck === "1") Probot = `Working :green_circle:`;
//   if (probotcheck === "0") Probot = `Not working :red_circle:`;

//   const LogsID = db4.get(`Log_ID`) || 1;
//   const logrealnum = LogsID - 1;
//   let logprice = db3.get(`LogP`) || `15000`;
//   let logcheck = db6.get(`Log`);
//   let Log = "";
//   if (!db6.has(`logcheck`)) Log = `Working :green_circle:`;
//   if (logcheck === "1") Log = `Working :green_circle:`;
//   if (logcheck === "0") Log = `Not working :red_circle:`;

//   const FeedID = db4.get(`Feedback_ID`) || 1;
//   const feedrealnum = FeedID - 1;
//   let feedprice = db3.get(`FeedP`) || `15000`;
//   let feedcheck = db6.get(`Feed`);
//   let feed = "";
//   if (!db6.has(`feedcheck`)) feed = `Working :green_circle:`;
//   if (feedcheck === "1") feed = `Working :green_circle:`;
//   if (feedcheck === "0") feed = `Not working :red_circle:`;

//   const ShopID = db4.get(`Shop_ID`) || 1;
//   const shoprealnum = ShopID - 1;
//   let shopprice = db3.get(`ShopP`) || `15000`;
//   let shopcheck = db6.get(`Shop`);
//   let shop = "";
//   if (!db6.has(`shopcheck`)) shop = `Working :green_circle:`;
//   if (shopcheck === "1") shop = `Working :green_circle:`;
//   if (shopcheck === "0") shop = `Not working :red_circle:`;

//   const days = Math.floor(client.uptime / 86400000);
//   const hours = Math.floor(client.uptime / 3600000) % 25;
//   const minutes = Math.floor(client.uptime / 60000) % 60;
//   const seconds = Math.floor(client.uptime / 1000) % 60;

//   const liveEmbed = new Discord.MessageEmbed()
//     .setColor(`RANDOM`)
//     .setTitle(`__***Live Status for bots.***__`)
//     .setFields(
//       { name: " ", value: `**Auto line bots:** ${Autoline} \`${autolineprice}$\`\n**There is** \`${autolinerealnum}\` **Auto-line Bots**`, inline: false, },
//       { name: " ", value: `**Suggestion bots:** ${Suggestion} \`${suggestionprice}$\`\n**There is** \`${suggestionrealnum}\` **Suggestion Bots**`, inline: false, },
//       { name: " ", value: `**Auto tax bots:** ${Autotax} \`${taxprice}$\`\n**There is** \`${autotaxrealnum}\` **Auto tax Bots**`, inline: false, },
//       { name: " ", value: `**Bank bots:** ${Bank} \`${bankprice}$\`\n**There is** \`${bankrealnum}\` **Bank Bots**`, inline: false, },
//       { name: " ", value: `**Ticket bots:** ${Ticket} \`${ticketprice}$\`\n**There is** \`${ticketrealnum}\` **Ticket Bots**`, inline: false, },
//       { name: " ", value: `**System bots:** ${System} \`${systemprice}$\`\n**There is** \`${systemrealnum}\` **System Bots**`, inline: false, },
//       { name: " ", value: `**Brodcast bots:** ${Brodcast} \`${brodcastprice}$\`\n**There is** \`${brodcastrealnum}\` **Brodcast Bots**`, inline: false, },
//       { name: " ", value: `**Giveaway bots:** ${Giveaway} \`${giveawayprice}$\`\n**There is** \`${giveawayrealnum}\` **Giveaway Bots**`, inline: false, },
//       { name: " ", value: `**Scammer checker bots:** ${Scammer} \`${scammerprice}$\`\n**There is** \`${scammerrealnum}\` **Scammer checker Bots**`, inline: false, },
//       { name: " ", value: `**Probot Primuim bots:** ${Probot} \`${probotprice}$\`\n**There is** \`${probotrealnum}\` **Probot Primuim Bots**`, inline: false, },
//       { name: " ", value: `**Logs bots:** ${Log} \`${logprice}$\`\n**There is** \`${logrealnum}\` **Logs Bots**`, inline: false, },
//       { name: " ", value: `**Feedback bots:** ${feed} \`${feedprice}$\`\n**There is** \`${feedrealnum}\` **Feedback Bots**`, inline: false, },
//       { name: " ", value: `**Shop bots:** ${shop} \`${shopprice}$\`\n**There is** \`${shoprealnum}\` **Shop Bots**`, inline: false, }
//     );
//   await LiveMessage.edit({ embeds: [liveEmbed] });
// }, 25000);





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


client.on('err', (error) => {
  console.error('The bot encountered an error:', error);
});

process.on('unhandledRejection', (error) => {
  console.log(error)
});

process.on('uncaughtException', (err, origin) => {
  console.error(err)
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error(err)

});
process.on('warning', (warning) => {
  
});

client.on('error', (error) => {
  console.error('An error occurred:', error);
});

client.on('shardError', (error) => {
  console.error('A shard error occurred:', error);
});

// =================VC Joiner=================
// const { joinVoiceChannel } = require("@discordjs/voice");
// client.on("ready", () => {
//   setInterval(async () => {
//     const data = await db.get("24/7voice");
//     if (!data) return;
//     client.channels
//       .fetch(data)
//       .then((channel) => {
//         const VoiceConnection = joinVoiceChannel({
//           channelId: channel.id,
//           guildId: channel.guild.id,
//           adapterCreator: channel.guild.voiceAdapterCreator,
//         });
//       })
//       .catch((error) => {
//         return;
//       });
//   }, 1000);
// });
// =================VC Joiner=================

// =================Dev=================
//Whitelist System
client.on("guildCreate", async (guild) => {
  const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client.user.id}`);
  if (!subs.includes(guild.id) &&
    guild.id !== "1077593691247620097" &&
    guild.id !== "1102027278646513724" &&
    guild.id !== "1071040653678608414") {
    guild.leave().catch(err => { })
  }
});

//guildCreate
client.on("guildCreate", async (guild) => {
  const { CoderServer, selllogsch, join_leavelog, owner } = require('./config.json');
  const targetGuildId = CoderServer;
  const targetChannelId = join_leavelog;
  const targetGuild = client.guilds.cache.get(targetGuildId);
  const Serverowner = await client.users.fetch(guild.ownerId);
  const ownerUsername = Serverowner ? Serverowner.username : "Unknown";
  const targetChannel = targetGuild.channels.cache.get(targetChannelId);

  const joinsEmbed = new Discord.MessageEmbed()
    .setTitle("Bot Maker Tier 1")
    .setColor("GREEN")
    .setDescription(`Joined: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}`);

  targetChannel.send({ embeds: [joinsEmbed] });
});

//guildDelete
client.on("guildDelete", async (guild) => {
  const { CoderServer, selllogsch, join_leavelog, owner } = require('./config.json');
  const targetGuildId = CoderServer;
  const targetChannelId = join_leavelog;
  const targetGuild = client.guilds.cache.get(targetGuildId);
  const Serverowner = await client.users.fetch(guild.ownerId);
  const ownerUsername = Serverowner ? Serverowner.username : "Unknown";
  const targetChannel = targetGuild.channels.cache.get(targetChannelId);

  const leavesEmbed = new Discord.MessageEmbed()
    .setTitle("Bot Maker Tier 1")
    .setColor("RED")
    .setDescription(`Left: ${guild.name}\nOwner Mention: <@!${guild.ownerId}>\nOwner user: ${ownerUsername}`);

  targetChannel.send({ embeds: [leavesEmbed] });
});

client.on('ready', () => {
  const subs = BOTMAKERSUBSDB.get(`AllowedServers_${client.user.id}`) || []
  client.guilds.cache.forEach((guild) => {
    if (!subs.includes(guild.id) && guild.id !== '1077593691247620097' && guild.id !== '1102027278646513724') {
      if (guild) {
        guild.leave().catch(err => { })
      }
    }
  });
});


// =================require Dev=================

// =================Bots requires=================
const db6 = new Database("/Json-db/Others/bots-statusdb.json");
const ondb =  new Database("/Json-db/Others/ONStatus");

client.on('ready', () => {
  ondb.deleteAll()
});
  setInterval(async () => {
    const autolinestatus = db6.get(`Autoline`) || "1"
    const sta = ondb.get("AutolineS") || "off"
    if (autolinestatus === "0" && sta !== "on") {

    } else {
      require(`./Bots/Auto-line/Autoline-Bots`)
      await ondb.set(`AutolineS`,"on")
    }
  }, 7000);
  setInterval(async () => {
    const suggestionstatus = db6.get(`Suggestion`) || "1"
    const sta = ondb.get("SuggestionS") || "off"
    if (suggestionstatus === "0" && sta !== "on") {

    } else {
      require(`./Bots/Suggestion/Suggestion-Bots`)
      await ondb.set(`SuggestionS`,"on");
    }
  }, 25000);
  setInterval(async () => {
    const taxstatus = db6.get(`Tax`) || "1"
    const sta = ondb.get("TaxS") || "off"
    if (taxstatus === "0" && sta !== "on") {

    } else {
      require(`./Bots/Tax/Tax-Bots`)
      await ondb.set(`TaxS`,"on");
    }
  }, 40000);
  setInterval(async () => {
    const credittatus = db6.get(`Credit`) || "1"
    const sta = ondb.get("CreditS") || "off"
    if (credittatus === "0" && sta !== "on") {

    } else {
      require(`./Bots/Credit/Credit-bots`)
      await ondb.set(`CreditS`,"on");
    }
  }, 65000);
  setInterval(async () => {
    const ticketstatus = db6.get(`Ticket`) || "1"
    const sta = ondb.get("TicketS") || "off"
    if (ticketstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Ticket/Ticket-Bots`)
      await ondb.set(`TicketS`,"on");
    }
  }, 80000);
  setInterval(async () => {
    const systemstatus = db6.get(`System`) || "1"
    const sta = ondb.get("SystemS") || "off"
    if (systemstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/System/System-bots`)
      await ondb.set(`SystemS`,"on");
    }
  }, 100000);
  setInterval(async () => {
    const brodcaststatus = db6.get(`Brodcast`) || "1"
    const sta = ondb.get("BrodcastS") || "off"
    if (brodcaststatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Brodcast/Brodcast-Bots`)
      await ondb.set(`BrodcastS`,"on");
    }
  }, 120000);
  setInterval(async () => {
    const scammerstatus = db6.get(`Scammer`) || "1"
    const sta = ondb.get("ScammerS") || "off"
    if (scammerstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Scammer/Scammer-Bots`)
      await ondb.set(`ScammerS`,"on");
    }
  }, 135000);
  setInterval(async () => {
    const probotstatus = db6.get(`Probot`) || "1"
    const sta = ondb.get("ProbotS") || "off"
    if (probotstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/ProBot/Probot-Bots`)
      await ondb.set(`ProBotS`,"on");
    }
  }, 145000);
  setInterval(async () => {
    const feedstatus = db6.get(`Feed`) || "1"
    const sta = ondb.get("FeedbackS") || "off"
    if (feedstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Feedback/Feedback-Bots`)
      await ondb.set(`FeedbackS`,"on")
    }
  }, 160000);
  setInterval(async () => {
    const shopstatus = db6.get(`Shop`) || "1"
    const sta = ondb.get("ShopS") || "off"
    if (shopstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Shop/Shop-Bots`)
      await ondb.set(`ShopS`,"on")
    }
  }, 175000);
  setInterval(async () => {
    const logstatus = db6.get(`Log`) || "1"
    const sta = ondb.get("LogS") || "off"
    if (logstatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Log/Log-Bots`)
      await ondb.set(`LogS`,"on")
    }
  }, 195000);
  setInterval(async () => {
    const giveawaystatus = db6.get(`Giveaway`) || "1"
    const sta = ondb.get("GiveawayS") || "off"
    if (giveawaystatus === "0" && sta !== "on") {
    } else {
      require(`./Bots/Giveaways/Giveaways-Bots`)
      await ondb.set(`GiveawayS`,"on")
    }
  }, 215000);








// =================Bots requires=================
client.on(`ready`, () => {
  const db11 = new Database("/Json-db/Others/BuyerChecker.json");
  db11.deleteAll();
});

require(`./BotMaker2Bots`)
require(`./BotMaker3Bots`)


//require intercationCreate
// const folderPath = path.join(__dirname, 'intercationCreate');
// fs.readdirSync(folderPath).forEach(folder => {
//   const folderFullPath = path.join(folderPath, folder);
//   if (fs.lstatSync(folderFullPath).isDirectory()) {
//     fs.readdirSync(folderFullPath).forEach(file => {
//       if (file.endsWith('.js')) {
//         const filePath = path.join(folderFullPath, file);
//         require(filePath);
//       }
//     });
//   }
// });

//اشتراكات بوت ميكر تاير 1
const BOTMKERSUBSDB = new Database("/Json-db/BotMaker/BotMakerSubTime.json");
const BOTMAKETDB = new Database("/Json-db/BotMaker/BotMakerSub.json");
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
            BOTMAKETDB.pull(`AllowedServers_${client.user.id}`, serverId).then(() => {
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


client.on('ready', async () => {
  const data = await BOTMAKERSUBSDB.get(`AllowedServers_${client.user.id}`) || []

  client.guilds.cache.forEach((guild) => {
    if (!data.includes(guild.id) && guild.id !== `1077593691247620097` && guild.id !== `1102027278646513724` && guild.id !== `1071040653678608414`) {
      guild.leave().catch(err => { })
      console.log(`left ${guild.id}`)
    }
  });
});


