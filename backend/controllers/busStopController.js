const BusStop = require('../models/BusStop');

// Add a new bus stop
exports.addBusStop = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    const existingStop = await BusStop.findOne({ name });
    if (existingStop) return res.status(400).json({ message: "Bus stop already exists" });

    const stop = new BusStop({ name, latitude, longitude });
    await stop.save();

    res.status(201).json(stop);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all bus stops
exports.getAllBusStops = async (req, res) => {
  try {
    const stops = await BusStop.find().sort({ name: 1 });
    res.status(200).json(stops);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
