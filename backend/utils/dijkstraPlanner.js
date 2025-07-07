const BusStop = require('../models/BusStop');
const weightedGraph = require('./weightedGraph');

const dijkstra = async (sourceName, destinationName) => {
  await weightedGraph.build();
  const graph = weightedGraph.getGraph();
  const allStops = await BusStop.find();

  const stopMap = {};
  allStops.forEach(stop => stopMap[stop.name.toLowerCase()] = stop);

  const source = stopMap[sourceName.toLowerCase()];
  const destination = stopMap[destinationName.toLowerCase()];

  if (!source || !destination) return { error: "Invalid source or destination" };

  const distances = {};
  const prev = {};
  const visited = new Set();
  const pq = new Map();

  // Initialize distances and priority queue
  for (let stop of allStops) {
    const id = stop._id.toString();
    distances[id] = id === source._id.toString() ? 0 : Infinity;
    pq.set(id, distances[id]);
  }

  while (pq.size > 0) {
    const currentId = [...pq.entries()].reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    pq.delete(currentId);
    visited.add(currentId);

    if (currentId === destination._id.toString()) break;

    const neighbors = graph[currentId] || [];
    for (let neighbor of neighbors) {
      if (visited.has(neighbor.to)) continue;

      const alt = distances[currentId] + neighbor.weight;
      if (alt < distances[neighbor.to]) {
        distances[neighbor.to] = alt;
        prev[neighbor.to] = { from: currentId, route: neighbor.route };
        pq.set(neighbor.to, alt);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = destination._id.toString();
  while (current && prev[current]) {
    const stop = allStops.find(s => s._id.toString() === current);
    const { from, route } = prev[current];
    const fromStop = allStops.find(s => s._id.toString() === from);
    path.unshift({
      stopName: stop.name,
      route,
      latitude: stop.latitude,
      longitude: stop.longitude,
      stopNameCoords: `${stop.latitude},${stop.longitude}`,
      distanceFromPrevious: (distances[current] - distances[from]).toFixed(1) + " m"
    });
    current = from;
  }

  if (source._id.toString() === current) {
    path.unshift({
      stopName: source.name,
      route: null,
      latitude: source.latitude,
      longitude: source.longitude,
      stopNameCoords: `${source.latitude},${source.longitude}`
    });
    return path;
  }

  return { error: "No path found." };
};

module.exports = { dijkstra };
