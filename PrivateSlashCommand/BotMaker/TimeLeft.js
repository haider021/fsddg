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
const { Database } = require('st.db');
const BOTMAKERDB = new Database("/Json-db/BotMaker/BotMakerSubTime.json");
const Canvas = require(`canvas`)
const {CoderSubBackground} = require("../../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`subscription-time`)
        .setDescription(`Subscription expiration time`)
        .addStringOption(type => type
            .setName(`subscription-id`)
            .setDescription(`قم بوضع ايدي السيرفر او ايدي الاشتراك`)
            .setRequired(true)
        ),
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {
         await interaction.deferReply({ ephemeral: false });
        try {
            const ID = interaction.options.getString(`subscription-id`)
            if (isNaN(ID)) return interaction.editReply({ content: `قمت بادخال ايدي السيرفر او ايدي الاشتراك بطريقه خطأ.` })
            const DB = await BOTMAKERDB.get('TIMELEFTSUB');
            const botData = DB.find((data) => data.serverId === ID || data.Whitelist === parseInt(ID));
            if (!botData) return interaction.editReply(`لا يوجد بيانات للاشتراك في هذا السيرفر.`)
            if(botData.owner !== interaction.user.id && !interaction.member.permissions.has(`ADMINISTRATOR`)){
                return interaction.editReply(`❗ لا تستطيع الاستعلام عن اشتراك شخص اخر`)
            }
            const owner = await client.users.fetch(botData.owner).catch(err => { })
            const endTime = botData.endTime
            const Type = botData.Type

            const canvas = Canvas.createCanvas(400, 400);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage(CoderSubBackground);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const ownerName = owner ? owner.username : 'Unknown'; // اسم صاحب البوت
            const typeName = Type ? Type : 'Unknown'; // نوع البوت

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${ownerName}`, canvas.width / 1.4, canvas.height / 2 + 35);
            ctx.fillText(`${endTime}`, canvas.width / 1.6, canvas.height / 2 + 105);
            ctx.fillText(`${typeName}`, canvas.width / 1.3, canvas.height / 2 + 180);

            const avatarURL = interaction.member.user.displayAvatarURL({ format: `png`, size: 4096 });
            const avatarSize = parseInt(avatarURL.slice(avatarURL.lastIndexOf("?size=") + 6));
            if (avatarSize > 8000000) {
                return console.log("❌ The avatar size is too large to be loaded");
            }
            const avatar = await Canvas.loadImage(avatarURL);
            const newAvatarSize = 145;

            const avatarCanvas = Canvas.createCanvas(newAvatarSize, newAvatarSize);
            const avatarCtx = avatarCanvas.getContext('2d');
            avatarCtx.beginPath();
            avatarCtx.arc(newAvatarSize / 2, newAvatarSize / 2, newAvatarSize / 2, 0, Math.PI * 2, true);
            avatarCtx.closePath();
            avatarCtx.clip();
            avatarCtx.drawImage(avatar, 0, 0, newAvatarSize, newAvatarSize);

            const x = canvas.width / 2 - avatarCanvas.width / 2;
            const y = canvas.height / 7 - avatarCanvas.height / 4.7;
            ctx.drawImage(avatarCanvas, x, y);


            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'Welcome.png');

           await interaction.editReply({ files: [attachment] })
        } catch (error) {
            console.log(error)
            await interaction.editReply(`حدث خطا`)
        }
    },
};
