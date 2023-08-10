const mongoose = require('mongoose');

const SuggestionDB = new mongoose.Schema({
  line: String,
  guildID: String,
  channels: [String]
});

module.exports = mongoose.model('SuggestionDB', SuggestionDB);
