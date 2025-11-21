const { Router } = require('express');
const orderController = require('../controllers/order.controller');

const router = Router();

router.route('/').get(orderController.getOrders).post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrderStatus);

module.exports = router;

