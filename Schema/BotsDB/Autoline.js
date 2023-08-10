const mongoose = require('mongoose');

const AutolineDB = new mongoose.Schema({
  line: String,
  guildID: String,
  channels: [String],
  allowedchannels: [String],
});

module.exports = mongoose.model('AutolineDB', AutolineDB);
