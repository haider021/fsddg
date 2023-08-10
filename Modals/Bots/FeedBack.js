const { Discord } = require('discord.js');
const client = require(`../../index`)
const { Client, MessageActionRow, MessageButton,WebhookClient, MessageEmbed,Collection, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
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
    name: "Feedback_MODAL",
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
            const FeedbackID = db4.get(`Feedback_ID`) || 1;
            let token = interaction.fields.getTextInputValue("Bot_Token");
            let prefix = interaction.fields.getTextInputValue("Bot_prefix");
            let owner = interaction.user.id;
            const feeddb = new Database("/Json-db/Bots/FeedbackDB.json")
            const unWantedJson = new Database("/Json-db/Others/unWanted")
            const client13 = new Client({ intents: 32767 });
            client13.login(token)
                .then(async () => {
                    db4.set(`Feedback_ID`, FeedbackID + 1);

                    const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
                    const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
                    const logchannel = await client.channels.cache.get(channel);

                    const invite_Button = new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle(`LINK`)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client13.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                    ]);

                    const buyer = interaction.user;
                    const buyerembed = new MessageEmbed()
                        .setColor(`#d5d5d5`)
                        .setTitle(`__***Feedback bot purchase***___`)
                        .setDescription(
                            `**Hello <@${interaction.user.id}> you have bought a Feedback bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${FeedbackID}\`\n`
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
                            console.log(`I cant find client role in Feedback`)//تعديل
                        }
                    }

                    try {
                      const MainServer = mainBot.guilds.cache.get(CoderServer);
                      const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
                      if (MainServerLogChannel) {
                          MainServerLogChannel.send(`Feedback bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
                      }
                  } catch (error) {
                      console.log(error.message)
                  }

                    if (logchannel && logchannel.type === 'GUILD_TEXT') {
                        try {
                            logchannel.send(
                                `Feedback bot has been purchased by **${buyer.username}**`
                            );
                        } catch (error) {
                            console.log(`I cant find sells log channel in Feedback`)//تعديل
                        }
                    }

                    client13.events = new Collection();
                    require("../../Bots/Feedback/handlers/events")(client13);

                    client13.on("messageCreate", async (message) => {
                      if (message.author.bot) return;
                      const feedbackrooms = feeddb.get(`feedback_room_${message.guild.id}`)
                      if (feeddb.has(`feedback_webhook_${message.guild.id}`) && message.channel.id.includes(feedbackrooms)) {
                        let weburl = feeddb.get(`feedback_webhook_${message.guild.id}`);
                        await message.delete();
                        const embed = new Discord.MessageEmbed()
                          .setDescription(`**Feedback :**\n${message.content}`)
                          .setURL(`https://discord.com/users/${message.author.id}`)
                          .setTitle(`[${message.author.username}] (${message.author.id})`)
                          .setColor("DARK_BUT_NOT_BLACK")
                          .addFields({
                            name: "Rate :", value: "⭐⭐⭐⭐⭐"
                          })
                          .setTimestamp(Date.now());
                  
                        const row = new MessageActionRow()
                          .addComponents(
                            new MessageButton()
                              .setCustomId('feedback_1')
                              .setLabel('1 ⭐')
                              .setStyle('PRIMARY')
                              .setDisabled(false),
                              new MessageButton()
                              .setCustomId('feedback_2')
                              .setLabel('2 ⭐')
                              .setStyle('PRIMARY')
                              .setDisabled(false),
                              new MessageButton()
                              .setCustomId('feedback_3')
                              .setLabel('3 ⭐')
                              .setStyle('PRIMARY')
                              .setDisabled(false),
                              new MessageButton()
                              .setCustomId('feedback_4')
                              .setLabel('4 ⭐')
                              .setStyle('PRIMARY')
                              .setDisabled(false),
                              new MessageButton()
                              .setCustomId('feedback_5')
                              .setLabel('5 ⭐')
                              .setStyle('PRIMARY')
                              .setDisabled(false),
                          )
                  
                          const line = feeddb.get(`feedback_line_${message.guild.id}`)
                          const mode = feeddb.get(`Rating_System_${message.guild.id}`) || `true`
                          if(mode === `true`){
                            await new WebhookClient({ url: weburl }).send({
                              username: message.author.username,
                              avatarURL: message.author.avatarURL(),
                              embeds: [embed],
                              components: [row]
                            }).then((msg) => {
                              if(line){
                                message.channel.send({files:[line]})
                              }
                              unWantedJson.set(`FeedBackWebhook_${msg.id}`, weburl);
                              setInterval(async() => {
                                const webhook = new WebhookClient({ url: `${weburl}` });
                                await webhook.editMessage(msg.id, {
                                  content: null,
                                  components: []
                                });
                                unWantedJson.delete(`FeedBackWebhook_${msg.id}`)
                              }, 30000);
                            });
                          }else{
                            await new WebhookClient({ url: weburl }).send({
                              username: message.author.username,
                              avatarURL: message.author.avatarURL(),
                              embeds: [embed]
                            }).then(()=>{
                              if(line){
                                message.channel.send({files:[line]})
                              }
                            })
                          }
                      }
                    });
                  
                    client13.on(`interactionCreate`, async interaction =>{
                      if(interaction.customId ===`feedback_1`){
                        const feedbackowner = interaction.message.embeds[0].title;
                        if (!feedbackowner.includes(interaction.user.id)) {
                          await interaction.deferUpdate();
                        }else{
                          await interaction.deferUpdate();
                          const messageID = interaction.message.id;
                          const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
                          const Embedcolor = interaction.message.embeds[0].color;
                          const EmbedURL = interaction.message.embeds[0].url;
                          const des = interaction.message.embeds[0].description;
                  
                          const webhook = new WebhookClient({ url: `${webhookURL}` });
                          const message = interaction.message;
                  
                          const newFields = [
                            { name: "Rate :", value: "⭐" },
                          ];
                  
                          const newEmbed = new MessageEmbed()
                          .setDescription(des)
                          .setTitle(feedbackowner)
                          .setURL(EmbedURL)
                          .setColor(Embedcolor)
                          .addFields(newFields)
                          .setTimestamp(Date.now());
                  
                        await webhook.editMessage(message.id, {
                          content: null,
                          embeds: [newEmbed],
                          components: []
                        }).then(()=>{
                          unWantedJson.delete(`FeedBackWebhook_${messageID}`)
                        })
                        }
                      }else if(interaction.customId ===`feedback_2`){
                        const feedbackowner = interaction.message.embeds[0].title;
                        if (!feedbackowner.includes(interaction.user.id)) {
                          await interaction.deferUpdate();
                        }else{
                          await interaction.deferUpdate();
                          const messageID = interaction.message.id;
                          const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
                          const Embedcolor = interaction.message.embeds[0].color;
                          const EmbedURL = interaction.message.embeds[0].url;
                          const des = interaction.message.embeds[0].description;
                  
                          const webhook = new WebhookClient({ url: `${webhookURL}` });
                          const message = interaction.message;
                  
                          const newFields = [
                            { name: "Rate :", value: "⭐⭐" },
                          ];
                  
                          const newEmbed = new MessageEmbed()
                          .setDescription(des)
                          .setTitle(feedbackowner)
                          .setURL(EmbedURL)
                          .setColor(Embedcolor)
                          .addFields(newFields)
                          .setTimestamp(Date.now());
                  
                        await webhook.editMessage(message.id, {
                          content: null,
                          embeds: [newEmbed],
                          components: []
                        }).then(()=>{
                          unWantedJson.delete(`FeedBackWebhook_${messageID}`)
                        })
                        }
                      }else if(interaction.customId ===`feedback_3`){
                        const feedbackowner = interaction.message.embeds[0].title;
                        if (!feedbackowner.includes(interaction.user.id)) {
                          await interaction.deferUpdate();
                        }else{
                          await interaction.deferUpdate();
                          const messageID = interaction.message.id;
                          const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
                          const Embedcolor = interaction.message.embeds[0].color;
                          const EmbedURL = interaction.message.embeds[0].url;
                          const des = interaction.message.embeds[0].description;
                  
                          const webhook = new WebhookClient({ url: `${webhookURL}` });
                          const message = interaction.message;
                  
                          const newFields = [
                            { name: "Rate :", value: "⭐⭐⭐" },
                          ];
                  
                          const newEmbed = new MessageEmbed()
                          .setDescription(des)
                          .setTitle(feedbackowner)
                          .setURL(EmbedURL)
                          .setColor(Embedcolor)
                          .addFields(newFields)
                          .setTimestamp(Date.now());
                  
                        await webhook.editMessage(message.id, {
                          content: null,
                          embeds: [newEmbed],
                          components: []
                        }).then(()=>{
                          unWantedJson.delete(`FeedBackWebhook_${messageID}`)
                        })
                        }
                      }else if(interaction.customId ===`feedback_4`){
                        const feedbackowner = interaction.message.embeds[0].title;
                        if (!feedbackowner.includes(interaction.user.id)) {
                          await interaction.deferUpdate();
                        }else{
                          await interaction.deferUpdate();
                          const messageID = interaction.message.id;
                          const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
                          const Embedcolor = interaction.message.embeds[0].color;
                          const EmbedURL = interaction.message.embeds[0].url;
                          const des = interaction.message.embeds[0].description;
                  
                          const webhook = new WebhookClient({ url: `${webhookURL}` });
                          const message = interaction.message;
                  
                          const newFields = [
                            { name: "Rate :", value: "⭐⭐⭐⭐" },
                          ];
                  
                          const newEmbed = new MessageEmbed()
                          .setDescription(des)
                          .setTitle(feedbackowner)
                          .setURL(EmbedURL)
                          .setColor(Embedcolor)
                          .addFields(newFields)
                          .setTimestamp(Date.now());
                  
                        await webhook.editMessage(message.id, {
                          content: null,
                          embeds: [newEmbed],
                          components: []
                        }).then(()=>{
                          unWantedJson.delete(`FeedBackWebhook_${messageID}`)
                        })
                        }
                      }else if(interaction.customId ===`feedback_5`){
                        const feedbackowner = interaction.message.embeds[0].title;
                        if (!feedbackowner.includes(interaction.user.id)) {
                          await interaction.deferUpdate();
                        }else{
                          await interaction.deferUpdate();
                          const messageID = interaction.message.id;
                          const webhookURL = unWantedJson.get(`FeedBackWebhook_${messageID}`);
                          const Embedcolor = interaction.message.embeds[0].color;
                          const EmbedURL = interaction.message.embeds[0].url;
                          const des = interaction.message.embeds[0].description;
                  
                          const webhook = new WebhookClient({ url: `${webhookURL}` });
                          const message = interaction.message;
                  
                          const newFields = [
                            { name: "Rate :", value: "⭐⭐⭐⭐⭐" },
                          ];
                  
                          const newEmbed = new MessageEmbed()
                          .setDescription(des)
                          .setTitle(feedbackowner)
                          .setURL(EmbedURL)
                          .setColor(Embedcolor)
                          .addFields(newFields)
                          .setTimestamp(Date.now());
                  
                        await webhook.editMessage(message.id, {
                          content: null,
                          embeds: [newEmbed],
                          components: []
                        }).then(()=>{
                          unWantedJson.delete(`FeedBackWebhook_${messageID}`)
                        })
                        }
                      }
                    })

                    db2.push(`feedback`, {
                        token: token,
                        prefix: prefix,
                        owner: owner,
                        BotID: `${FeedbackID}`,
                        CLIENTID: client13.user.id
                    }).then(() => {
                        prefixDB.set(`Prefix_${client13.user.id}_feedback`, prefix).then(() => {
                            ownerDB.set(`Owner_${client13.user.id}_feedback`, owner)
                        }).then(()=>{

                          interaction.message.delete();
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                    return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
                })

                client13.on('ready', async () => {
                  unWantedJson.deleteAll()
                    const data = feeddb.get(`feed_Status_${client13.user.id}`) || []
                    const Activity = await data.Activity
                    const type = await data.Type
                    const botstatus = await data.Presence || "online"
              
                    client13.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
                    client13.user.setPresence({
                      status: botstatus,
                    });
                });
                
                  client13.Feedbackbotsslashcommands = new Collection();
                  const Feedbackbotsslashcommands = [];

                  client13.on("ready", async () => {
                    const rest = new REST({ version: "9" }).setToken(token);
                    (async () => {
                      try {
                        await rest.put(Routes.applicationCommands(client13.user.id), {
                          body: Feedbackbotsslashcommands,
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    })();
                  });
                
                  const folderPath = path.join(__dirname, '../../Bots/Feedback/slashcommand13');
                
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
                        Feedbackbotsslashcommands.push(command.data);
                        client13.Feedbackbotsslashcommands.set(command.data.name, command);
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