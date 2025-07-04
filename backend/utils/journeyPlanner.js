const axios = require('axios');
const BusStop = require('../models/BusStop');
const routeGraph = require('./routeGraph');

const RADAR_SECRET_KEY = process.env.RADAR_SECRET_KEY;

// Call Radar's Distance API between two coordinates
const getRadarDistance = async (from, to) => {
  if (
    typeof from.latitude !== 'number' || typeof from.longitude !== 'number' ||
    typeof to.latitude !== 'number' || typeof to.longitude !== 'number'
  ) {
    console.warn("Missing lat/lon for distance calculation:", from.name, to.name);
    return { distance: 'N/A', duration: 'N/A' };
  }

  try {
    console.log(`🔁 Radar: ${from.name} -> ${to.name}`);
    console.log(`Coords: ${from.latitude},${from.longitude} -> ${to.latitude},${to.longitude}`);

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

    const route = res.data.routes.car;
    return {
      distance: route?.distance?.text || 'N/A',
      duration: route?.duration?.text || 'N/A'
    };
  } catch (err) {
    console.error("❌ Radar API error:", err.response?.data || err.message);
    return { distance: 'N/A', duration: 'N/A' };
  }
};


const findAllPaths = async (sourceName, destinationName) => {
  await routeGraph.buildGraph();
  const graph = routeGraph.getGraph();

  const allStops = await BusStop.find();
  const stopMap = {};
  allStops.forEach(stop => stopMap[stop.name.toLowerCase()] = stop);

  const source = stopMap[sourceName.toLowerCase()];
  const destination = stopMap[destinationName.toLowerCase()];
  if (!source || !destination) return { error: "Invalid source or destination" };

  const queue = [[{ stop: source._id.toString(), route: null }]];
  const paths = [];

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current.stop === destination._id.toString()) {
      paths.push(path);
      continue;
    }

    if (path.length > 50) continue;

    const neighbors = graph[current.stop] || [];
    for (const neighbor of neighbors) {
      if (!path.find(p => p.stop === neighbor.to)) {
        queue.push([...path, { stop: neighbor.to, route: neighbor.routeNumber }]);
      }
    }
  }

  const pathsWithDetails = [];

  for (const path of paths) {
    const enrichedPath = [];

    for (let i = 0; i < path.length; i++) {
      const entry = path[i];
      const stop = allStops.find(s => s._id.toString() === entry.stop);

      const detail = {
        stopName: stop.name,
        route: entry.route
      };

      if (i > 0) {
        const from = allStops.find(s => s._id.toString() === path[i - 1].stop);
        const to = stop;

        const { distance, duration } = await getRadarDistance(from, to);
        detail.distanceFromPrevious = distance;
        detail.durationFromPrevious = duration;
      }

      enrichedPath.push(detail);
    }

    pathsWithDetails.push(enrichedPath);
  }

  return pathsWithDetails;
};

module.exports = { findAllPaths };
