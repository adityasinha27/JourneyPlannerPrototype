const BusRoute = require('../models/BusRoute');

exports.addBusRoute = async (req, res) => {
  try {
    const { routeNumber, busNumber, stops } = req.body;

    const routeExists = await BusRoute.findOne({ routeNumber });
    if (routeExists) return res.status(400).json({ message: "Route already exists" });

    const newRoute = new BusRoute({
      routeNumber,
      busNumber,
      stops
    });

    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(500).json({ message: "Failed to create route", error: err });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find().populate('stops.stop');
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching routes", error: err });
  }
};
