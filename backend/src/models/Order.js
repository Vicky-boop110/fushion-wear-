const { Schema, model, Types } = require('mongoose');

const orderSchema = new Schema(
  {
    items: [
      {
        product: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
        },
      },
    ],
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: 'IN' },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = model('Order', orderSchema);

