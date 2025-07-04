import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusRouteList = ({ refreshTrigger }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/busroutes')
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-4 rounded">
      <h2 className="text-xl font-bold mb-4">All Bus Routes</h2>
      {routes.map(route => (
        <div key={route._id} className="border-b py-3">
          <p><strong>Route No:</strong> {route.routeNumber}</p>
          <p><strong>Bus No:</strong> {route.busNumber}</p>
          <p><strong>Stops:</strong></p>
          <ul className="list-decimal ml-6 text-sm text-gray-700">
            {route.stops.map((s, idx) => (
              <li key={idx}>{s.stop.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BusRouteList;
