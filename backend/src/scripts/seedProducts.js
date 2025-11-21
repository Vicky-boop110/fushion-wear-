require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = require('../config/db');
const Product = require('../models/Product');
const products = require('../data/products');

const seedProducts = async () => {
  await connectDB(process.env.MONGODB_URI);

  try {
    await Product.deleteMany();
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products.`);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('🌱 Product collection refreshed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to seed products:', error);
      process.exit(1);
    });
}

module.exports = seedProducts;

