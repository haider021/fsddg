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
  const { ChannelType } = require("discord-api-types/v9");
  const Discord = require('discord.js');
  const { SlashCommandBuilder } = require("@discordjs/builders")

const { Database } = require("st.db");
const BOTMAKERDB = new Database("/Json-db/BotMaker/BOTMAKERDB");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName(`setup`)
      .setDescription(`Setup BotMaker panal`)
      .addChannelOption(ch =>ch
        .setName(`botmaker-channel`)
        .setDescription(`Select the panal location`)
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        )
        .addChannelOption(ch =>ch
            .setName(`botmaker-category`)
            .setDescription(`Select the category for BotMaker tickets`)
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
            )
        .addStringOption(text => text
            .setName(`botmaker-message`)
            .setDescription(`The panal message`)
            .setRequired(false)),
    botPermission: [""],
    authorPermission: ["ADMINISTRATOR"],
    ownerOnly: false,
    async run(client, interaction) {
      try {
        const botmakerchannel = interaction.options.getChannel('botmaker-channel').id
        const botmakercategory = interaction.options.getChannel('botmaker-category').id
        const botmakermessage = interaction.options.getString(`botmaker-message`)

        BOTMAKERDB.set(`BotMakerTicket_${interaction.guild.id}`, {
            Message: botmakermessage,
            Channel: botmakerchannel,
            Category: botmakercategory,
          }).then(async () => {
            await interaction.reply('Setuped BotMaker Successfully');
          });
      } catch (error) {
        console.log(error)
        await interaction.reply(`حدث خطا`)
      }
    },
  };