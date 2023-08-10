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
const { Database } = require("st.db")
const db1 = new Database("/Json-db/Others/Bots-Price.json")
const {CoderServer} = require(`../../config.json`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`change-price`)
    .setDescription(`Change the price of bots`)
    .addStringOption(type => type
      .setName(`bot-type`)
      .setDescription(`Select the bot Type`)
      .addChoices(
        { name: `Autoline`, value: `AutolineP` },
        { name: `Suggestion`, value: `SuggestionP` },
        { name: `Auto-Tax`, value: `TaxP` },
        { name: `Bank`, value: `BankP` },
        { name: `Ticket`, value: `TicketP` },
        { name: `System`, value: `SystemP` },
        { name: `Brodcast`, value: `BrodcastP` },
        { name: `Scammer-Checker`, value: `ScammerP` },
        { name: `Giveaway`, value: `GiveawayP` },
        { name: `Probot`, value: `ProbotP` },
        { name: `Logs`, value: `LogP` },
        { name: `FeedBack`, value: `FeedbackP` },
        { name: `Shop`, value: `ShopP` },
        { name: `BotMaker-Tier1`, value: `BOTMAKERP_Tier1` },
        { name: `BotMaker-Tier2`, value: `BOTMAKERP_Tier2` },
        { name: `BotMaker-Tier3`, value: `BOTMAKERP_Tier3` },
      )
      .setRequired(true)
      )

    .addStringOption(p => p
      .setName(`bots-price`)
      .setDescription(`Type the price in numbers`)
      .setRequired(true)),
  botPermission: [""],
  authorPermission: [""],
  ownerOnly: true,
  async run(client, interaction) {
    try {
      const botType = interaction.options.getString(`bot-type`)
      const botprice = interaction.options.getString(`bots-price`)

      if (isNaN(botprice)) return interaction.reply({ content: `قمت بادخال السعر بطريقه خطأ.` })

      db1.set(`${botType}`, botprice).then(async () => {
        const AutolinePrice = db1.get(`AutolineP`) || 15000
        const SuggestionPrice = db1.get(`SuggestionP`) || 15000
        const TaxPrice = db1.get(`TaxP`) || 15000
        const BankPrice = db1.get(`BankP`) || 15000
        const TicketPrice = db1.get(`TicketP`) || 15000
        const SystemPrice = db1.get(`SystemP`) || 15000
        const BrodcastPrice = db1.get(`BrodcastP`) || 15000
        const ScammerPrice = db1.get(`ScammerP`) || 15000
        const GiveawayPrice = db1.get(`GiveawayP`) || 15000
        const ProbotPrice = db1.get(`ProbotP`) || 15000
        const BotMakerPrice1 = db1.get(`BOTMAKERP_Tier1`) || 15000
        const BotMakerPrice2 = db1.get(`BOTMAKERP_Tier2`) || 15000
        const BotMakerPrice3 = db1.get(`BOTMAKERP_Tier3`) || 15000
        const embed = new Discord.MessageEmbed()
      .setColor(`#d5d5d5`)
      .setDescription(
      `Autoline : \`${AutolinePrice}\`
      Suggestion : \`${SuggestionPrice}\`
      Tax : \`${TaxPrice}\`
      Bank : \`${BankPrice}\`
      Ticket : \`${TicketPrice}\`
      System : \`${SystemPrice}\`
      Brodcast : \`${BrodcastPrice}\`
      Scammer : \`${ScammerPrice}\`
      Giveaway : \`${GiveawayPrice}\`
      Probot : \`${ProbotPrice}\`
      BotMaker_Tier1: \`${BotMakerPrice1}\`
      BotMaker_Tier2: \`${BotMakerPrice2}\`
      BotMaker_Tier3: \`${BotMakerPrice3}\``)

      interaction.reply({embeds: [embed]})
      })
    } catch (error) {
      console.log(error)
      await interaction.reply(`حدث خطا`)
    }
  },
};