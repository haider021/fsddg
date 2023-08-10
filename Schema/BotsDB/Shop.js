const mongoose = require('mongoose');

const ShopDB = new mongoose.Schema({
    guildID:String,
    clientID: String,
    RolesEmbed: String,
    Badwords:[String],
    Buy: {
        Probot: String,
        Bank: String,
    },
    Order:{
        orders_channel:String,
        designs_room:String,
        coding_room:String,
        products_room:String,
        designs_role_mention:String,
        coding_role_mention:String,
        products_role_mention:String,
    },
    Setup:{
        shop_rooms_category:String,
        shop_mention_room:String,
        private_rooms_category:String,
    }
});

module.exports = mongoose.model('ShopDB', ShopDB);
