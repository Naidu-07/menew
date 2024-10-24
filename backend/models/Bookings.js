// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  members: Number,
  tableId: Number,
  area: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
