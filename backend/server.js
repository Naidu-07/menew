const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  members: Number,
  tableId: Number,
  area: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

// API endpoint to create a booking
app.post('/api/book-table', async (req, res) => {
  const { name, members, tableId, area } = req.body;
  const newBooking = new Booking({ name, members, tableId, area });

  try {
    await newBooking.save();
    res.status(201).send(newBooking);
  } catch (error) {
    res.status(400).send(error);
  }
});

// API endpoint to get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).send(bookings);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// API endpoint to add a menu item
app.post('/api/menuitems', async (req, res) => {
  const { name, price, description } = req.body;

  // Log the incoming request data
  console.log('Request Body:', req.body);

  // Validate fields
  if (!name || !price || !description) {
      return res.status(400).json({ error: 'All fields (name, price, description) are required' });
  }

  try {
      const newMenuItem = new MenuItem({ name, price, description });
      await newMenuItem.save();
      res.status(201).json(newMenuItem);
  } catch (err) {
      res.status(400).json({ message: 'Error adding menu item', error: err.message });
  }
});

// API endpoint to get all menu items
app.get('/api/menuitems', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching menu items', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
