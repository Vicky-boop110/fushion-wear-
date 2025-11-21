const { Router } = require('express');

const healthRoutes = require('./health.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);

module.exports = router;

