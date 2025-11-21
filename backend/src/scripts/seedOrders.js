require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../config/db');
const Product = require('../models/Product');
const Order = require('../models/Order');
const orderSeeds = require('../data/orders');

const buildOrderPayload = (order, productMap) => ({
  items: order.items.map((item) => {
    const productId = productMap.get(item.productName);
    if (!productId) {
      throw new Error(`Missing product "${item.productName}" – seed products first.`);
    }

    return {
      product: productId,
      quantity: item.quantity,
      size: item.size,
    };
  }),
  customer: order.customer,
  status: order.status,
  total: order.total,
  notes: order.notes,
});

const seedOrders = async () => {
  await connectDB(process.env.MONGODB_URI);

  try {
    const products = await Product.find({}, 'name _id');
    const productMap = new Map(products.map((product) => [product.name, product._id]));

    const payload = orderSeeds.map((order) => buildOrderPayload(order, productMap));

    await Order.deleteMany();
    const inserted = await Order.insertMany(payload);
    console.log(`✅ Seeded ${inserted.length} orders.`);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedOrders()
    .then(() => {
      console.log('🌱 Order collection refreshed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to seed orders:', error);
      process.exit(1);
    });
}

module.exports = seedOrders;

