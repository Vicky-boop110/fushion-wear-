const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('items.product').sort('-createdAt');
  res.json(orders);
});

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

