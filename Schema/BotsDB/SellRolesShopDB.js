const mongoose = require('mongoose');

const RolesShopDB = new mongoose.Schema({
    guildID:String,
    SellsRoles:{
        Role: String,
        Price: Number
    } 
});

module.exports = mongoose.model('RolesShopDB', RolesShopDB);
