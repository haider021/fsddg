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
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Database } = require("st.db");
const db = new Database("/Json-db/BotMaker/BOTMAKERDB.json")


module.exports = {
  data: new SlashCommandBuilder()
    .setName(`add-botmaker-to-server`)
    .setDescription(`Give BotMaker to guild`)
    .addStringOption(gu => gu
      .setName(`bot-id`)
      .setDescription(`Put the ID of the bot`)
      .setRequired(true)
    )
    .addStringOption(p => p
      .setName(`type`)
      .setDescription(`Select what type of bots you want to add to the bot`)
      .addChoices(
        { name: `Tier 2`, value: `Tier_2` },
        { name: `Tier 3`, value: `Tier_3` },
      )
      .setRequired(true))
    .addStringOption(p => p
      .setName(`amount`)
      .setDescription(`Type the amount in numbers`)
      .setRequired(true))
  ,
  botPermission: [""],
  authorPermission: [""],
  ownerOnly: true,
  async run(client, interaction) {

    try {
      const ID = interaction.options.getString(`bot-id`)
      const Type = interaction.options.getString(`type`)
      const amount = interaction.options.getString(`amount`)

      const check = db.get(`BotMaker_Amount_${ID}_${Type}`) || 0
      db.set(`BotMaker_Amount_${ID}_${Type}`,parseInt(check) + parseInt(amount)).then(() => {
        interaction.reply(`✔ تم اضافه البوتات بنجاح الكميه ${amount} - ${Type}`)
      })
    } catch (error) {
      console.log(error)
      await interaction.reply(`حدث خطا`)
    }
  },
};