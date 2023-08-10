const mongoose = require('mongoose');


const GiveawayDB = new mongoose.Schema({
    ClintID: String,
    Time: String,
    RealEndsTime: String,
    StartedTime: String,
    messageID: String,
    Status: String,
    channelID: String,
    guild: String,
    Winners: Number,
    Entries: Number,
    EntriesCounter: Number,
    Joined: [String],
    Reroll: [String],
    winner: [String],
    Pause: String,
    Started: String,
    Prize: String,
    Ended: String

});

module.exports = mongoose.model('GiveawayDB', GiveawayDB);
