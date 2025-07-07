import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "./MapView"; // new map component

const JourneyPlanner = () => {
  const [stops, setStops] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [paths, setPaths] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/busstops")
      .then((res) => setStops(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handlePlanJourney = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/journey`, {
        params: { source, destination },
      });
      setPaths(res.data);
    } catch (err) {
      alert("Error finding journey paths");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDijkstra = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/dijkstra`, {
        params: { source, destination },
      });
      setShortestPath(res.data);
    } catch (err) {
      alert("Error finding shortest path");
      console.error(err);
    }
    setLoading(false);
  };

  const getTotalSummary = (path) => {
    let totalDistance = 0;
    let totalDuration = 0;

    path.forEach((step) => {
      const d = parseFloat(step.distanceFromPrevious?.split(" ")[0] || 0);
      const t = parseFloat(step.durationFromPrevious?.split(" ")[0] || 0);
      if (!isNaN(d)) totalDistance += d;
      if (!isNaN(t)) totalDuration += t;
    });

    return {
      distance: totalDistance.toFixed(1),
      duration: totalDuration.toFixed(0),
    };
  };

  return (
    <div className="bg-white max-w-3xl mx-auto p-6 rounded shadow my-10">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Journey Planner</h2>
      <form
        onSubmit={handlePlanJourney}
        className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Source</option>
          {stops.map((stop) => (
            <option key={stop._id} value={stop.name}>
              {stop.name}
            </option>
          ))}
        </select>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Destination</option>
          {stops.map((stop) => (
            <option key={stop._id} value={stop.name}>
              {stop.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Find All Paths
        </button>
      </form>

      <button
        onClick={handleDijkstra}
        className="bg-green-600 text-white py-2 px-4 mb-6 rounded hover:bg-green-700"
      >
        Find Shortest Path (Dijkstra)
      </button>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {shortestPath.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2 text-green-700">
              Shortest Path (by Distance):
            </h3>
            <p className="text-sm text-green-600 mb-2">
              Total Distance: {getTotalSummary(shortestPath).distance} m
            </p>
            <ol className="list-decimal ml-6">
              {shortestPath.map((step, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-semibold">{step.stopName}</span>
                  {step.route && (
                    <span className="text-sm text-gray-600 ml-2">
                      (via Route {step.route})
                    </span>
                  )}
                  {step.distanceFromPrevious && (
                    <div className="text-sm text-gray-500 ml-2">
                      🧭 {step.distanceFromPrevious}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* 🚍 Map visualization of shortest path */}
          <MapView path={shortestPath} />
        </>
      )}

      {!loading && paths.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-lg">
            Available Paths (Multi-route):
          </h3>
          {paths.map((path, index) => {
            const summary = getTotalSummary(path);
            return (
              <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
                <p className="text-sm text-blue-700 mb-2">
                  Total Distance: {summary.distance} km | Estimated Time:{" "}
                  {summary.duration} mins
                </p>
                <ol className="list-decimal ml-6">
                  {path.map((step, idx) => (
                    <li key={idx} className="mb-1">
                      <div>
                        <span className="font-semibold">{step.stopName}</span>
                        {step.route && (
                          <span className="text-sm text-gray-600 ml-2">
                            (via Route {step.route})
                          </span>
                        )}
                      </div>
                      {step.distanceFromPrevious &&
                        step.durationFromPrevious && (
                          <div className="text-sm text-gray-500 ml-2">
                            🧭 {step.distanceFromPrevious} – ⏱️{" "}
                            {step.durationFromPrevious}
                          </div>
                        )}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JourneyPlanner;
