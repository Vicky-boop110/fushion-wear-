const { Router } = require('express');
const productController = require('../controllers/product.controller');

const router = Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/featured')
  .get(productController.getFeaturedProducts);

router
  .route('/:id')
  .get(productController.getProduct)
  .put(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;

