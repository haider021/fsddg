const mongoose = require('mongoose');

const CreditDB = new mongoose.Schema({
    clientID: String,
    Guild: {
        Admin: String,
    },
    User:{
        User: String,
        Credit: Number,
    }
});

module.exports = mongoose.model('CreditDB', CreditDB);
