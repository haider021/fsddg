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
const { SlashCommandBuilder } = require("@discordjs/builders");
const { text } = require("body-parser");


module.exports = {
  data: new SlashCommandBuilder()
    .setName(`leave`)
    .setDescription(`Makes the bot leave the serevr by ID`)
    .addStringOption(text=>
      text.setName(`serverid`).setDescription(`The ID of target server`)
      .setRequired(true)
    ),
  botPermission: [""],
  authorPermission: [""],
  ownerOnly: true,
  async run(client, interaction) {
    try {
      let serverid = interaction.options.getString('serverid');
      let theguild = await client.guilds.cache.get(serverid);
      let lev;
      let embed1 = new Discord.MessageEmbed()
      .setColor('GREEN');
      if (!theguild) {
          lev = "لم يتم العثور علي السيرفر او حدث خطا ما";
      } else {
          lev = `Left the server Successfully "${serverid}"`;
      }
      embed1.setDescription(`**${lev}**`);
      theguild.leave();
      return interaction.reply({ embeds: [embed1] });
    } catch (error) {
      console.log(error)
      await interaction.reply(`حدث خطا`)
    }
  },
};