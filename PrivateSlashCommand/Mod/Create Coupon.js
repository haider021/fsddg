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
const db = new Database("/Json-db/BotMaker/Coupons.json");
const Canvas = require(`canvas`)
const {SupportRole} = require("../../config.json")
module.exports = {
    data: new SlashCommandBuilder()
        .setName(`add-server-coupon`)
        .setDescription(`Make coupon code for spical server`)
        .addStringOption(type => type
            .setName(`server-id`)
            .setDescription(`قم بوضع ايدي السيرفر`)
            .setRequired(true)
        )
        .addStringOption(type => type
            .setName(`coupon`)
            .setDescription(`قم بكتابه كود الخصم`)
            .setRequired(true)
        )
        .addStringOption(type => type
            .setName(`max-uses`)
            .setDescription(`قم بكتابه كود الخصم`)
            .setRequired(true)
        )
        .addStringOption(type => type
            .setName(`discount`)
            .setDescription(`قيمه الخصم`)
            .setRequired(true)
        )
        ,
    botPermission: [""],
    authorPermission: [""],
    ownerOnly: false,
    async run(client, interaction) {

        try {
            const server = interaction.options.getString(`server-id`)
            const coupon = interaction.options.getString(`coupon`)
            const max = interaction.options.getString(`max-uses`)
            const discount = interaction.options.getString(`discount`)

            const supportRoleID = SupportRole
            if (!interaction.member.roles.cache.find((ro) => ro.id === supportRoleID))
                return interaction.reply({
                    content: `[x] ليس لديك صلاحيه لاستخدام هذا الامر`
                });
                if(isNaN(server)) return interaction.reply(`قم بادخال ايدي السيرفر بطريقه صحيحه`)
                
            const data = db.get(`BotMaker_Cuopon_${server}`)
            if(data){
                const da = data.find(d => d.coupon === coupon);
                if(da){
                    interaction.reply(`هذا الكود موجود بالفعل لهذا السيرفر ${server}`)
                }else{
                    db.push(`BotMaker_Cuopon_${server}`,{
                        server:server,
                        coupon:coupon,
                        max:parseInt(max),
                        discount:parseInt(discount)
                    }).then(()=>{
                        interaction.reply(`تم اضافه الكود بنجاح الي ${server}\nالكود: ${coupon}\nعدد مرات الاستخدام: ${max}`)
                    })
                }
            }else{
                db.push(`BotMaker_Cuopon_${server}`,{
                    server:server,
                    coupon:coupon,
                    max:parseInt(max),
                    discount:parseInt(discount)
                }).then(()=>{
                    interaction.reply(`تم اضافه الكود بنجاح الي ${server}\nالكود: ${coupon}\nعدد مرات الاستخدام: ${max}`)
                })
            }
        } catch (error) {
            console.log(error)
            await interaction.reply(`حدث خطا`)
        }
    },
};
