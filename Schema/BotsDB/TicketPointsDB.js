const mongoose = require('mongoose');

const TicketpointsDB = new mongoose.Schema({
  guildID: String,
  User: String,
  Points: Number
});

module.exports = mongoose.model('TicketpointsDB', TicketpointsDB);
