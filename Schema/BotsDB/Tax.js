const mongoose = require('mongoose');

const TaxDB = new mongoose.Schema({
  line: String,
  guildID: String,
  channels: [String],
  message: String,
  // mode: Number,
  type: String
});

module.exports = mongoose.model('TaxDB', TaxDB);
