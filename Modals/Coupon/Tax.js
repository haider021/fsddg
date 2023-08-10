const { Client, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Intents, Modal, TextInputComponent } = require("discord.js");
const Discord = require('discord.js');
const client = require(`../../index`)

const { Database } = require("st.db")
const db = new Database("/Json-db/BotMaker/Coupons.json");
const { Probot } = require("discord-probot-transfer");
const checkdb = new Database("/Json-db/Others/BuyerChecker");
const db3 = new Database("/Json-db/Others/Bots-Price.json");
const BOTMAKETDB = new Database("/Json-db/BotMaker/BOTMAKERDB");


module.exports = {
    name: "Tax_Redeem",
    aliases: ["", ""],
    description: "",
    usage: [""],
    botPermission: [""],
    authorPermission: [""],
    cooldowns: [],
    ownerOnly: false,
    run: async (client, interaction, args, config) => {
      const data = db.get(`BotMaker_Cuopon_${interaction.guild.id}`) || db.get(`BotMaker_Cuopons`)
      try {
        if(data){
            let Code = interaction.fields.getTextInputValue("Tax_Redeem")
            const checkRedeemer = db.get(`UsedCode_${Code}`) || []
            if(checkRedeemer.includes(interaction.user.id)) return interaction.reply(`لقد قمت باستخدام هذا الكود من قبل`)
            const da = data.find(d => d.coupon === Code);
            if(da){
                const max = da.max
                if(max <= 0){
                    return interaction.reply(`😞 تم اجتياز الحد الاقصي لاستخدمات هذا الكود.`)
                }
                db.push(`UsedCode_${Code}`,interaction.user.id)
                const discount = da.discount

                const TaxPrice = db3.get(`TaxP_${interaction.guild.id}`) || db3.get(`TaxP`) || 2;
                const Taxtotalprice = Math.floor(TaxPrice * (1 - (discount / 100)) * (20 / 19) + 1);
                const checkDB = checkdb.get(`${interaction.channel.id}`)

                const ownerID = BOTMAKETDB.get(`trID_${interaction.guild.id}`)//TheOwner
                const probotid = BOTMAKETDB.get(`probotID_${interaction.guild.id}`)//probotID
                if (!ownerID) return interaction.reply(`**لا يمكنك الشراء بسبب عدم تحديد الاونر**`)
                if (!probotid) return interaction.reply(`**لا يمكنك الشراء بسبب عدم تحديد ايدي برو بوت**`)
    
                if (checkDB) return interaction.reply({ content: `لا يمكنك الضغط علي الزر مره اخري قبل انتهاء الوقت`, ephemeral: true })
                checkdb.set(`${interaction.channel.id}`, `true`)
                client.probot = Probot(client, {
                    fetchGuilds: true,
                    data: [
    
                        {
                            fetchMembers: true,
                            guildId: interaction.guild.id,
                            probotId: probotid,
                            owners: ownerID,
                        },
                    ],
                });
                interaction.channel.send(`🥳%تم استخدام الكود بنجاح حصلت علي خصم ${discount}`)
                data.forEach(da=>{
                    if(da.coupon === Code){
                        da.max = max - 1
                        db.set(`BotMaker_Cuopon_${interaction.guild.id}`,data)
                    }
                })
                await interaction.reply(
                    `__***.قم بكتابه امر التحويل التالي***__
                    - **لديك 5 دقايق حتي تقوم بتحويل المبلغ**
                    \`\`\`c ${ownerID} ${Taxtotalprice}\`\`\``//تعديل
                )
    
    
                var check = await client.probot.collect(interaction, {
                    probotId: probotid,
                    owners: ownerID,
                    time: 1000 * 60 * 5,
                    userId: interaction.user.id,
                    price: Taxtotalprice,
                    fullPrice: false,
                });
                if (check.status) {
                    let Autoline_BUTTON = new MessageActionRow().addComponents(//تعديل
                        new MessageButton()
                            .setCustomId(`BuyTax`)//تعديل
                            .setLabel("Tax")
                            .setStyle("PRIMARY")
                    );
                    interaction.channel.send({ components: [Autoline_BUTTON] }).then(() => {
                        checkdb.delete(`${interaction.channel.id}`);
                    })
                } else if (check.error) {
                    return interaction.channel.send(`> ${check.error.message} 😢`);
                } else {
                    return interaction.channel.send(`**❌ اعد المحاوله.**`);
                }
            }
        }

    } catch (error) {
        console.log(error)
    }
    }
}