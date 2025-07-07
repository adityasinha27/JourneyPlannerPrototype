const axios = require('axios');
const BusStop = require('../models/BusStop');
const BusRoute = require('../models/BusRoute');

const RADAR_SECRET_KEY = process.env.RADAR_SECRET_KEY;

const weightedGraph = {
  adjacencyList: {},

  // Fetch real distance using Radar API
  async getDistance(from, to) {
    if (
      typeof from.latitude !== 'number' || typeof from.longitude !== 'number' ||
      typeof to.latitude !== 'number' || typeof to.longitude !== 'number'
    ) return Infinity;

    try {
      const res = await axios.get('https://api.radar.io/v1/route/distance', {
        params: {
          origin: `${from.latitude},${from.longitude}`,
          destination: `${to.latitude},${to.longitude}`,
          modes: 'car',
          units: 'metric'
        },
        headers: {
          Authorization: RADAR_SECRET_KEY
        }
      });

      return res.data.routes.car?.distance?.value || Infinity; // in meters
    } catch (err) {
      console.error("Radar error:", err.response?.data || err.message);
      return Infinity;
    }
  },

  // Build the weighted graph (once at runtime or refresh)
  async build() {
    this.adjacencyList = {};

    const busRoutes = await BusRoute.find().populate('stops.stop');
    const allStops = await BusStop.find();

    const stopMap = {};
    allStops.forEach(s => stopMap[s._id.toString()] = s);

    for (const route of busRoutes) {
      const sortedStops = route.stops.sort((a, b) => a.order - b.order);

      for (let i = 0; i < sortedStops.length - 1; i++) {
        const fromId = sortedStops[i].stop._id.toString();
        const toId = sortedStops[i + 1].stop._id.toString();

        const fromStop = stopMap[fromId];
        const toStop = stopMap[toId];

        const distance = await this.getDistance(fromStop, toStop);

        if (!this.adjacencyList[fromId]) this.adjacencyList[fromId] = [];
        if (!this.adjacencyList[toId]) this.adjacencyList[toId] = [];

        // Add forward connection
        this.adjacencyList[fromId].push({
          to: toId,
          route: route.routeNumber,
          weight: distance
        });

        // Optionally add reverse connection (if routes are bidirectional)
        this.adjacencyList[toId].push({
          to: fromId,
          route: route.routeNumber,
          weight: distance
        });
      }
    }

    console.log("✅ Weighted graph built.");
    return this.adjacencyList;
  },

  getGraph() {
    return this.adjacencyList;
  }
};

module.exports = weightedGraph;
