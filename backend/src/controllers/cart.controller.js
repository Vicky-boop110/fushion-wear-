const asyncHandler = require('../utils/asyncHandler');

// Simple cart controller - returns empty cart for now
// In production, this would be connected to a database and user sessions
exports.getCart = asyncHandler(async (req, res) => {
  res.json({
    cart: [],
    items: [],
    total: 0,
  });
});

exports.addItem = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: 'Item added to cart (localStorage only)',
    item: req.body,
  });
});

exports.updateItem = asyncHandler(async (req, res) => {
  res.json({
    message: 'Item updated (localStorage only)',
    itemId: req.params.itemId,
  });
});

exports.removeItem = asyncHandler(async (req, res) => {
  res.json({
    message: 'Item removed (localStorage only)',
    itemId: req.params.itemId,
  });
});

exports.clearCart = asyncHandler(async (req, res) => {
  res.json({
    message: 'Cart cleared (localStorage only)',
  });
});

