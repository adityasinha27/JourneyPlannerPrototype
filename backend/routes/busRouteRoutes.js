const express = require('express');
const router = express.Router();
const { addBusRoute, getAllRoutes } = require('../controllers/busRouteController');

router.post('/', addBusRoute);
router.get('/', getAllRoutes);

module.exports = router;
