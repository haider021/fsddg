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
    name: "Brodcast_MODAL",
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
        const BrodcastID = db4.get(`Brodcast_ID`) || 1;
        let token = interaction.fields.getTextInputValue("Bot_Token");
        let prefix = interaction.fields.getTextInputValue("Bot_prefix");
        let owner = interaction.user.id;
  
        const brodcastdb = new Database("/Json-db/Bots/BrodcastDB.json")
  
        const client17 = new Client({ intents: 32767 });
        client17.login(token)
          .then(async () => {
            db4.set(`Brodcast_ID`, BrodcastID + 1);

            const client_role = BOTMAKETDB.get(`ClientRole_${interaction.guild.id}`)
            const channel = BOTMAKETDB.get(`SellsLog_${interaction.guild.id}`)
            const logchannel = await client.channels.cache.get(channel);
  
            const invite_Button = new MessageActionRow().addComponents([
              new MessageButton()
                  .setStyle(`LINK`)
                  .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client17.user.id}&permissions=8&scope=bot%20applications.commands`)
                  .setLabel(`invite`)
                  .setDisabled(false),
          ]);
  
            const buyer = interaction.user;
            const buyerembed = new MessageEmbed()
              .setColor(`#d5d5d5`)
              .setTitle(`__***Brodcast bot purchase***___`)
              .setDescription(
                `**Hello <@${interaction.user.id}> you have bought a Brodcast bot.**\n__and your Bot informantion are here__\n**Your bot Token.** **:**\`${token}\`\n**Your bot Prefix.** **:** \`${prefix}\`\n**Your bot ID.** **:**\`${BrodcastID}\``
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
                  setTimeout(() => interaction.channel.delete().catch(err=>{}), 10000);
                })
                .catch(async (error) => {
                  return console.log(error.message);
                });
                
            if (client_role) {
              try {
                const role = interaction.guild.roles.cache.find(
                  (r) => r.id === client_role
                );
                await interaction.member.roles.add(role)
              } catch (error) {
                console.log(`I cant find client role in Brodcast`)//تعديل
              }
            }
            try {
              const MainServer = mainBot.guilds.cache.get(CoderServer);
              const MainServerLogChannel = MainServer.channels.cache.get(selllogsch);
              if (MainServerLogChannel) {
                  MainServerLogChannel.send(`Brodcast bot has been purchased by **${buyer.username}**\nServerName:${interaction.guild.name}\nID:${interaction.guild.id}\nOwner:<@!${interaction.guild.ownerId}>`);
              }
          } catch (error) {
              console.log(error.message)
          }
            if (logchannel && logchannel.type === 'GUILD_TEXT') {
              try {
                logchannel.send(
                  `Brodcast bot has been purchased by **${buyer.username}**`
                );
              } catch (error) {
                console.log(`I cant find sells log channel in Brodcast`)//تعديل
              }
            }
  
            client17.commands = new Collection();
            client17.events = new Collection();
            require("../../handlers/Brodcast-commands")(client17);
            require("../../Bots/Brodcast/handlers/events")(client17);
            
            db2.push(`brodcast`, {
              token: token,
              prefix:prefix,
              owner: owner,
              BotID: `${BrodcastID}`,
              CLIENTID:client17.user.id
            }).then(()=>{
              prefixDB.set(`Prefix_${client17.user.id}_brodcast`,prefix).then(()=>{
                ownerDB.set(`Owner_${client17.user.id}_brodcast`,owner)
              }).then(()=>{

                interaction.message.delete();
              })
            })
          })
          .catch((error) => {
            console.log(error)
            return interaction.channel.send('قم بتفعيل الثلاث خيارات في البوت الخاص بك وأعد المحاولة.');
          })
          client17.on('ready', async () => {
            let statusIndex = 0;
            setInterval(() => {
              const data = brodcastdb.get(`Brodcast_Status_${client17.user.id}`) || []
              const Activity = data.Activity
              const type = data.Type
              const botstatus = data.Presence || "online"
              const statuses = [
                Activity
              ];
        
              client17.user.setActivity(statuses[statusIndex], { type: type, url: 'https://www.twitch.tv/Coder' });
              client17.user.setPresence({
                status: botstatus,
              });
              statusIndex = (statusIndex + 1) % statuses.length;
            }, 1000);
          });
          
          const folderPath = path.join(__dirname, '../../Bots/Brodcast/slashcommand17');
  
          client17.Brodcastbotsslashcommands = new Collection();
          const Brodcastbotsslashcommands = [];
        
        
          client17.on("ready", async () => {
            const rest = new REST({ version: "9" }).setToken(token);
            (async () => {
              try {
                await rest.put(Routes.applicationCommands(client17.user.id), {
                  body: Brodcastbotsslashcommands,
                });
              } catch (error) {
                console.error(error);
              }
            })();
          });
  
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
                Brodcastbotsslashcommands.push(command.data);
                client17.Brodcastbotsslashcommands.set(command.data.name, command);
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