const mongoose = require('mongoose');

const TicketDB = new mongoose.Schema({
    guildID: String,
    TransScript: String,
    TicketButtonsPanal: {
        panal: String,
        buttons: String,
        channel: String,
        ticketMessage: String,

        button_1_Name: String,
        button_1_Support: String,
        button_1_Mention: String,
        button_1_Category: String,
        button_1_Welcome: String,
        button_1_Color: String,

        button_2_Name: String,
        button_2_Support: String,
        button_2_Mention: String,
        button_2_Category: String,
        button_2_Welcome: String,
        button_2_Color: String,

        button_3_Name: String,
        button_3_Support: String,
        button_3_Mention: String,
        button_3_Category: String,
        button_3_Welcome: String,
        button_3_Color: String,
    },
    TicketSelectMenuPanal: {
        panal: Number,
        buttons: Number,
        channel: String,
        ticketMessage: String,
        ticketHolder: String,
        option_1_Name: String,
        option_1_Support: String,
        option_1_Mention: String,
        option_1_Category: String,
        option_1_Welcome: String,
        option_1_description: String,

        option_2_Name: String,
        option_2_Support: String,
        option_2_Mention: String,
        option_2_Category: String,
        option_2_Welcome: String,
        option_2_description: String,

        option_3_Name: String,
        option_3_Support: String,
        option_3_Mention: String,
        option_3_Category: String,
        option_3_Welcome: String,
        option_3_description: String,
    },
});

module.exports = mongoose.model('TicketDB', TicketDB);
