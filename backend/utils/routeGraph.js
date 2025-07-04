const BusStop = require('../models/BusStop');
const BusRoute = require('../models/BusRoute');

class RouteGraph {
  constructor() {
    this.adjacencyList = {}; // { stopId: [ { to, routeNumber } ] }
  }

  async buildGraph() {
    this.adjacencyList = {};

    const busRoutes = await BusRoute.find().populate('stops.stop');

    for (const route of busRoutes) {
      const orderedStops = route.stops.sort((a, b) => a.order - b.order);
      for (let i = 0; i < orderedStops.length - 1; i++) {
        const from = orderedStops[i].stop._id.toString();
        const to = orderedStops[i + 1].stop._id.toString();

        if (!this.adjacencyList[from]) this.adjacencyList[from] = [];
        this.adjacencyList[from].push({
          to,
          routeNumber: route.routeNumber,
        });

        // If bidirectional, also add reverse
        if (!this.adjacencyList[to]) this.adjacencyList[to] = [];
        this.adjacencyList[to].push({
          to: from,
          routeNumber: route.routeNumber,
        });
      }
    }

    return this.adjacencyList;
  }

  getGraph() {
    return this.adjacencyList;
  }
}

module.exports = new RouteGraph();
