const { Discord } = require('discord.js');
const client = require(`../../index`)
const { Client, MessageActionRow, MessageButton, MessageEmbed, Collection, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
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

const { CoderServer, selllogsch } = require('../../config.json');
const mainBot = require('../../')

module.exports = {
  name: "Suggestion_MODAL",
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
      const SuggestionID = db4.get(`Suggestion_ID`) || 1;
      let token = interaction.fields.getTextInputValue("Bot_Token");
      let prefix = interaction.fields.getTextInputValue("Bot_prefix");
      let owner = interaction.user.id;
      const suggestiondb = require("../../Schema/BotsDB/Suggestion")
      const jsonDB = new Database("/Json-db/Bots/SuggestionDB.json")

      const client3 = new Client({ intents: 32767 });
      client3.login(token)
        .then(async () => {
          db4.set(`Suggestion_ID`, SuggestionID + 1);

          const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
          const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
          const logchannel = await client.channels.cache.get(channel);

          const invite_Button = new MessageActionRow().addComponents([
            new MessageButton()
              .setStyle(`LINK`)
              .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client3.user.id}&permissions=8&scope=bot%20applications.commands`)
              .setLabel(`invite`)
              .setDisabled(false),
          ]);

          const buyer = interaction.user;
          const buyerembed = new MessageEmbed()
            .setColor(`#d5d5d5`)
            .setTitle(`__***Suggestion bot purchase***___`)
            .setDescription(
              `**Hello <@${interaction.user.id}> you have bought a Suggestion bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${SuggestionID}\`\n`
            );
          buyer
            .send({ embeds: [buyerembed], components: [invite_Button] })
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
              console.log(`I cant find client role in Suggestion`)//تعديل
            }
          }

          try {
            const MainServer = mainBot.guilds.cache.get(CoderServer);
            const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
            if (MainServerLogChannel) {
              MainServerLogChannel.send(`Suggestion bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
            }
          } catch (error) {
            console.log(error.message)
          }

          if (logchannel && logchannel.type === 'GUILD_TEXT') {
            try {
              logchannel.send(
                `Suggestion bot has been purchased by **${buyer.username}**`
              );
            } catch (error) {
              console.log(`I cant find sells log channel in Suggestion`)//تعديل
            }
          }

          client3.commands = new Collection();
          client3.events = new Collection();
          require("../../handlers/Suggestion-commands")(client3);
          require("../../Bots/Suggestion/handlers/events")(client3);

          client3.on("messageCreate", async function (message) {
            if (message.author.bot) return;
            if (!message.guild) return;
            const ServerData = await suggestiondb.findOne({ guildID: message.guild.id }) || []
            if (ServerData && ServerData.channels && !ServerData.channels.includes(message.channel.id)) return;

            try {
              if(ServerData.channels.includes(message.channel.id)){
                if (message.content.startsWith("https://")) {
                  return message.delete();
                }
                const args = message.content.split(",");
                const embed = new Discord.MessageEmbed()
                  .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                  .setThumbnail(message.author.avatarURL({ dynamic: true }))
                  .setColor("RANDOM")
                  .setDescription(`> ${args[0]}`)
                  .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }));
                const attachment = message.attachments.first();
                if (attachment) {
                  embed.setImage(attachment.proxyURL);
                }
                message.delete();
                message.channel.send({ embeds: [embed] }).then(async (msg) => {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${msg.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel("0")
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${msg.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel("0")
                      .setDisabled(false),
                  ]);
  
                  msg.edit({ components: [SugButtons] })
                  if (ServerData && ServerData.line) return message.channel.send({ files: [ServerData.line] })
  
  
                });
              }

            } catch (err) {
              console.log(err);
            }
          });


          //YesVotes
          client3.on(`interactionCreate`, async i => {
            if (!i.isButton()) return
            try {
              const SugChannel = client3.channels.cache.get(i.channel.id)
              const SugMessage = SugChannel.messages.cache.get(i.message.id)

              const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
              const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

              if (i.customId === `Yes_${i.message.id}`) {
                const check1 = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)
                const check = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)

                if (check1 && check1.includes(i.user.id)) {
                  return i.reply({ content: `قم بسحب تصويتك من التصويتات بالرفض 🔴 ثم حاول مره اخري ❗`, ephemeral: true })
                }

                if (check && check.includes(i.user.id)) {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes - 1}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.pull(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                      i.deferReply({ ephemeral: true }).then(() => {
                        return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                          jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes - 1)
                        })
                      });
                    })
                  })
                } else {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes + 1}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.set(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`, YesVotes + 1).then(() => {
                      jsonDB.push(`Yes_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                        i.deferReply({ ephemeral: true }).then(() => {
                          i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                        });
                      });
                    })
                  })
                }
              }
            } catch (error) {
              console.error(error);
            }
          });

          //NoVotes
          client3.on(`interactionCreate`, async i => {
            if (!i.isButton()) return
            try {
              const SugChannel = client3.channels.cache.get(i.channel.id)
              const SugMessage = SugChannel.messages.cache.get(i.message.id)

              const YesVotes = jsonDB.get(`Yes_MembersVotes_${i.guild.id}_${i.message.id}`) || 0
              const NoVotes = jsonDB.get(`No_MembersVotes_${i.guild.id}_${i.message.id}`) || 0

              if (i.customId === `No_${i.message.id}`) {
                const check1 = jsonDB.get(`Yes_Members_${i.guild.id}_${i.message.id}`)
                const check = jsonDB.get(`No_Members_${i.guild.id}_${i.message.id}`)

                if (check1 && check1.includes(i.user.id)) {
                  return i.reply({ content: `قم بسحب تصويتك من التصويتات بالموافقه 🟢 ثم حاول مره اخري ❗`, ephemeral: true })
                }

                if (check && check.includes(i.user.id)) {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes - 1}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.pull(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                      i.deferReply({ ephemeral: true }).then(() => {
                        return i.editReply(`لقد سحبت تصويتك من الاقتراح`).then(() => {
                          jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes - 1)
                        })
                      });
                    })
                  })
                } else {
                  const SugButtons = new MessageActionRow().addComponents([
                    new MessageButton()
                      .setCustomId(`Yes_${i.message.id}`)
                      .setStyle(`SUCCESS`)
                      .setEmoji(`✔`)
                      .setLabel(`${YesVotes}`)
                      .setDisabled(false),
                    new MessageButton()
                      .setCustomId(`No_${i.message.id}`)
                      .setStyle(`DANGER`)
                      .setEmoji(`✖`)
                      .setLabel(`${NoVotes + 1}`)
                      .setDisabled(false),
                  ]);
                  SugMessage.edit({ components: [SugButtons] }).then(() => {
                    jsonDB.set(`No_MembersVotes_${i.guild.id}_${i.message.id}`, NoVotes + 1).then(() => {
                      jsonDB.push(`No_Members_${i.guild.id}_${i.message.id}`, i.user.id).then(() => {
                        i.deferReply({ ephemeral: true }).then(() => {
                          i.editReply(`شكرا لمشاركتك بصوتك في الاقتراح`)
                        });
                      });
                    })
                  })
                }
              }
            } catch (error) {
              console.error(error);
            }
          });

          db2.push(`suggestion`, {
            token: token,
            prefix: prefix,
            owner: owner,
            BotID: `${SuggestionID}`,
            CLIENTID: client3.user.id
          }).then(() => {
            prefixDB.set(`Prefix_${client3.user.id}_suggestion`, prefix).then(() => {
              ownerDB.set(`Owner_${client3.user.id}_suggestion`, owner)
            }).then(() => {
              interaction.message.delete();
            })
          })
        })
        .catch((err) => {
          console.log(err)
          return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
        })

        client3.on('ready', async () => {
          const data = await jsonDB.get(`suggestion_Status_${client3.user.id}`) || []
          const Activity = await data.Activity
          const type = await data.Type
          const botstatus = await data.Presence || "online"
          const statuses = [
            Activity
          ];
      
          client3.user.setActivity(Activity, { type: type, url: 'https://www.twitch.tv/Coder' });
          client3.user.setPresence({
            status: botstatus,
          });
        });



      client3.Suggestionbotsslashcommands = new Collection();
      const Suggestionbotsslashcommands = [];


      client3.on("ready", async () => {
        const rest = new REST({ version: "9" }).setToken(token);
        (async () => {
          try {
            await rest.put(Routes.applicationCommands(client3.user.id), {
              body: Suggestionbotsslashcommands,
            });
          } catch (error) {
            console.error(error);
          }
        })();
      });

      const folderPath = path.join(__dirname, '../../Bots/Suggestion/slashcommand3');
      const ascii = require("ascii-table");
      const table = new ascii("autoline commands").setJustify();
      for (let folder of readdirSync(folderPath).filter(
        (folder) => !folder.includes(".")
      )) {
        for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
          f.endsWith(".js")
        )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
            Suggestionbotsslashcommands.push(command.data);
            client3.Suggestionbotsslashcommands.set(command.data.name, command);
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