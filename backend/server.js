// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

// // Booking Schema
// const bookingSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   members: { type: Number, required: true },
//   tableId: { type: Number, required: true },
//   area: { type: String, required: true },
//   orderedItems: [{
//     itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
//     quantity: { type: Number, required: true },
//   }],
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Menu Item Schema
// const menuItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   description: { type: String, required: true },
// });

// const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// // API endpoint to create a booking
// app.post('/api/book-table', async (req, res) => {
//   const { name, members, tableId, area } = req.body;

//   if (!name || !members || !tableId || !area) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const booking = new Booking({ name, members, tableId, area });
//   await booking.save();
//   res.status(201).json(booking);
// });

// // API endpoint to fetch bookings
// app.get('/api/bookings', async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to fetch menu items
// app.get('/api/menuitems', async (req, res) => {
//   try {
//     const items = await MenuItem.find();
//     res.json(items);
//   } catch (error) {
//     console.error("Error fetching menu items:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to place an order
// app.post('/api/bookings', async (req, res) => {
//   const { orders, tableId } = req.body;

//   if (!orders || orders.length === 0) {
//     return res.status(400).json({ error: 'Orders are required' });
//   }

//   try {
//     const booking = await Booking.findOne({ tableId });

//     if (booking) {
//       orders.forEach(order => {
//         booking.orderedItems.push(order);
//       });
//       await booking.save();
//       res.status(200).json(booking);
//     } else {
//       res.status(404).json({ message: 'Booking not found for this table' });
//     }
//   } catch (error) {
//     console.error("Error updating booking with order:", error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to add a menu item
// app.post('/api/menuitems', async (req, res) => {
//   const { name, price, description } = req.body;

//   const menuItem = new MenuItem({ name, price, description });
//   await menuItem.save();
//   res.status(201).json(menuItem);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


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

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    orderedItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        quantity: { type: Number, required: true },
    }],
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: Number, required: true },
    tableId: { type: Number, required: true },
    area: { type: String, required: true },
    orderedItems: [{
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: { type: Number, required: true },
    }],
  });

const Booking = mongoose.model('Booking', bookingSchema);

// API endpoint to fetch menu items
app.get('/api/menuitems', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to add a menu item
app.post('/api/menuitems', async (req, res) => {
    const { name, price, description } = req.body;
    const menuItem = new MenuItem({ name, price, description });
    await menuItem.save();
    res.status(201).json(menuItem);
});

// API endpoint to place an order
app.post('/api/orders', async (req, res) => {
    const { orderedItems } = req.body;

    if (!orderedItems || orderedItems.length === 0) {
        return res.status(400).json({ error: 'Ordered items are required' });
    }

    try {
        const order = new Order({ orderedItems });
        await order.save();
        res.status(201).json({ orderId: order._id, orderedItems });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to fetch all orders
// API endpoint to fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('orderedItems.itemId');
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// API endpoint to create a booking
app.post('/api/book-table', async (req, res) => {
    const { name, members, tableId, area } = req.body;

    if (!name || !members || !tableId || !area) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const booking = new Booking({ name, members, tableId, area });
    await booking.save();
    res.status(201).json(booking);
});

// API endpoint to fetch bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('orderedItems.itemId');
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to place an order under a booking
app.post('/api/bookings', async (req, res) => {
    const { orders, tableId } = req.body;

    if (!orders || orders.length === 0) {
        return res.status(400).json({ error: 'Orders are required' });
    }

    try {
        const booking = await Booking.findOne({ tableId });

        if (booking) {
            orders.forEach(order => {
                booking.orderedItems.push(order);
            });
            await booking.save();
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found for this table' });
        }
    } catch (error) {
        console.error("Error updating booking with order:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
