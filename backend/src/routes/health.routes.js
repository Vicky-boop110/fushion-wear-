const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fusion Wear backend is up',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

