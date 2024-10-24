// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  // category: { type: String, required: true },
  // isBestSeller: { type: Boolean, required: true },
  description: { type: String, required: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
