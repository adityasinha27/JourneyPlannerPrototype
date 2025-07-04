const express = require('express');
const router = express.Router();
const { addBusStop, getAllBusStops } = require('../controllers/busStopController');

router.post('/', addBusStop);
router.get('/', getAllBusStops);

module.exports = router;
