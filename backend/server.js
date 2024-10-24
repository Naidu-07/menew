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
  orderedItems: [{
    itemId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
  }],
});

const Booking = mongoose.model('Booking', bookingSchema);

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

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

// API endpoint to add a menu item
app.post('/api/menuitems', async (req, res) => {
  const { name, price, description } = req.body;

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

// API endpoint to place an order by updating the booking
// API endpoint to place an order by updating the booking
app.post('/api/orders', async (req, res) => {
  const { itemId, quantity, tableId } = req.body;

  if (!itemId || quantity <= 0) {
      return res.status(400).json({ error: 'Item ID and quantity are required' });
  }

  try {
      // Find the booking for the table
      const booking = await Booking.findOne({ tableId });

      if (booking) {
          // Add the ordered item to the booking
          booking.orderedItems.push({ itemId, quantity });
          await booking.save();
          res.status(200).json(booking);
      } else {
          res.status(404).json({ message: 'Booking not found for this table' });
      }
  } catch (error) {
      res.status(400).json({ message: 'Error updating booking with order', error: error.message });
  }
});

// API endpoint to get all orders (ordered items) for a table
app.get('/api/orders/:tableId', async (req, res) => {
  const { tableId } = req.params;

  try {
      const booking = await Booking.findOne({ tableId }).populate('orderedItems.itemId');
      res.status(200).json(booking || { message: 'No orders found for this table' });
  } catch (error) {
      res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});