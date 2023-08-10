const Discord = require('discord.js')
const {
  Client,
  Collection,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageSelectMenu,
  Intents,
  Modal,
  TextInputComponent
} = require("discord.js");
const { type } = require('os');

const { Database } = require("st.db")
const ticketdb3 = new Database("/Json-db/Others/ticket-Number.json");
const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
const db6 = new Database("/Json-db/Others/bots-statusdb.json");
const {CoderServer} = require(`../../config.json`)
const db = new Database("/Json-db/BotMaker/BOTMAKERDB.json")

module.exports = {
  name: "BOTMAKER_Selector",
  description: "",
  usage: [""],
  botPermission: ["MANAGE_CHANNELS"],
  authorPermission: [""],
  cooldowns: [0],
  ownerOnly: false,
  run: async (client, interaction, args, config) => {
    try {
      interaction.reply({content:`[!] Please wait.`,ephemeral: true})
      const Selected = interaction.values[0];
      if (Selected === 'Reset_Selected') {
        if (interaction.replied) {
          return;
        } else {
          try {
            if (!interaction.replied) {
             interaction.update()
            }
          } catch (error) {
            
          }
        }
      }else if (Selected === `Autoline_Selected`) {
        const Type = `Auto-line`//تعديل
        try {
          const autolinestatus = db6.get(`Autoline`) || "1";//تعديل
          if (autolinestatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
              **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
            });
          }
          if (!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
          })
          const user = interaction.user.id
          const ticketnumber =
            ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
          const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
  
          const ticketcategory = data.Category;
          const category = interaction.guild.channels.cache.find(
            (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
          );
  
          const welcomeMSG = new Discord.MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setDescription(
              `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
            );
  
          const OrderButtons = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`BOTMAKER_Close`) //تعديل
              .setStyle(`DANGER`)
              .setLabel(`Close`)
              .setDisabled(false),
            new MessageButton()
              .setCustomId(`AutoLine_Continue`) //تعديل
              .setStyle(`SUCCESS`)
              .setLabel("Continue")
              .setDisabled(false),
              new MessageButton()
              .setCustomId(`Redeem_${Type}_CouponButton`) //تعديل
              .setStyle(`SECONDARY`)
              .setLabel("Redeem")
              .setDisabled(false),
          ]);
  
          const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
            type: "text",
            parent: category,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL"],
              },
              {
                id: `${user}`,
                allow: ["VIEW_CHANNEL"],
              },
            ],
            topic: `${user}`,
          });
          await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
          ticketdb3.set(
            `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
            parseInt(ticketnumber + 1)
          );
           channel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [welcomeMSG],
            components: [OrderButtons],
          });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Suggestion_Selected`){
        const Type = `Suggestion`
        try {
          const suggestionstatus = db6.get(`Suggestion`) || "1";
          if (suggestionstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Suggestion_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Tax_Selected`){
        const Type = `Auto-Tax`
        try {
          const taxstatus = db6.get(`Tax`) || "1";
          if (taxstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Tax_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
        channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Credit_Selected`){
        const Type = `Credits`
        try {
          const creditstatus = db6.get(`Credit`) || "1";
          if (creditstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Credit_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });

        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Ticket_Selected`){
        const Type = `Ticket`
        try {
          const ticketstatus = db6.get(`Ticket`) || "1";
          if (ticketstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Ticket_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `System_Selected`){
        const Type = `System`
        try {
          const systemstatus = db6.get(`System`) || "1";
          if (systemstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`System_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Brodcast_Selected`){
        const Type = `Brodcast`
        try {
          const brodcaststatus = db6.get(`Brodcast`) || "1";
          if (brodcaststatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Brodcast_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Scammers_Selected`){
        const Type = `Scammer-checker`
        try {
          const scammerstatus = db6.get(`Scammer`) || "1";
          if (scammerstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Scammer_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Giveaway_Selected`){
        const Type = `Giveaway`
        try {
          const giveawaystatus = db6.get(`Giveaway`) || "1";
          if (giveawaystatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Giveaways_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Probot_selected`){
        const Type = `Probot-Fake`
        try {
          const probotstatus = db6.get(`Probot`) || "1";
          if (probotstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Probot_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));

        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Feedback_selected`){
        const Type = `FeedBack`
        try {
          const feedbackstatus = db6.get(`Feed`) || "1";
          if (feedbackstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Feedback_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Logs_selected`){
        const Type = `logs`
        try {
          const logstatus = db6.get(`Log`) || "1";
          if (logstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Log_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `Shop_selected`){
        const Type = `Shop`
        try {
          const shopstatus = db6.get(`Shop`) || "1";
          if (shopstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
          if(!interaction.guild.me.permissions.has('ADMINISTRATOR')) return i.reply({
            content: `I dont have permissions`,
            ephemeral: true,
            })
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Shop_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`)
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `BOTMAKER_Tier1_Selected`){//تعديل
        try {
          
          const Type = `BOTMAKER-Tier-1`
          const botmakerstatus = db6.get(`BotMaker`) || "1";//تعديل
          if (botmakerstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`BOTMAKER_Tier1_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`) //تعديل
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `BOTMAKER_Tier2_Selected`){//تعديل
        try {
         
          const amount = db.get(`BotMaker_Amount_${client.user.id}_Tier_2`) || 0
          if(interaction.guild.id !== CoderServer && amount <=0){
            return await interaction.editReply({content:`[😞] لا يوجد كميه متوفره من هذا النوع`,ephemeral: true})
          }
          const Type = `BOTMAKER-Tier-2`
          const botmakerstatus = db6.get(`BotMaker`) || "1";//تعديل
          if (botmakerstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`BOTMAKER_Tier2_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`) //تعديل
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }else if(Selected === `BOTMAKER_Tier3_Selected`){//تعديل
        try {
          
          const amount = db.get(`BotMaker_Amount_${client.user.id}_Tier_3`) || 0
          if(interaction.guild.id !== CoderServer && amount <=0){
            return await interaction.editReply({content:`[😞] لا يوجد كميه متوفره من هذا النوع`,ephemeral: true})
          }
          const Type = `BOTMAKER-Tier-3`
          const botmakerstatus = db6.get(`BotMaker`) || "1";//تعديل
          if (botmakerstatus === "0") {//تعديل
            return await interaction.editReply({content:`***لا تستطيع شراء هذا البوت في الوقت الحالي***
            **تستطيع ان تحاول مره ثانيه عندما يكون متوفر**`,ephemeral: true,
          });
          }
        const user = interaction.user.id
        const ticketnumber =
        ticketdb3.get(`BOTMAKERORDERNUMBER_${interaction.guild.id}`) || 1;
        const data = BOTMAKETDB.get(`BotMakerTicket_${interaction.guild.id}`);
        
        const ticketcategory = data.Category;
        const category = interaction.guild.channels.cache.find(
        (c) => c.id === `${ticketcategory}` && c.type === "GUILD_CATEGORY"
        );
        
        const welcomeMSG = new Discord.MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setDescription(
        `**لاستكمال عمليه الشراء قم بضغط علي زر**\n**"Continue"**\n**BotType :** __${Type}__`
        );
        
        const OrderButtons = new MessageActionRow().addComponents([
        new MessageButton()
        .setCustomId(`BOTMAKER_Close`) //تعديل
        .setStyle(`DANGER`)
        .setLabel(`Close`)
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`BOTMAKER_Tier3_Continue`) //تعديل
        .setStyle(`SUCCESS`)
        .setLabel("Continue")
        .setDisabled(false),
        new MessageButton()
        .setCustomId(`Redeem_${Type}_CouponButton`) //تعديل
        .setStyle(`SECONDARY`)
        .setLabel("Redeem")
        .setDisabled(false),
        ]);
        
        const channel = await interaction.guild.channels.create(`ticket-${ticketnumber}`, {
        type: "text",
        parent: category,
        permissionOverwrites: [
        {
        id: interaction.guild.roles.everyone.id,
        deny: ["VIEW_CHANNEL"],
        },
        {
        id: `${user}`,
        allow: ["VIEW_CHANNEL"],
        },
        ],
        topic: `${user}`,
        });
        await interaction.editReply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
        })
        .catch((err) => console.log(err));
        ticketdb3.set(
        `BOTMAKERORDERNUMBER_${interaction.guild.id}`,
        parseInt(ticketnumber + 1)
        );
         channel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [welcomeMSG],
        components: [OrderButtons],
        });
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      
    }

  }
}