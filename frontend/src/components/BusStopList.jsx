import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusStopList = ({ refreshTrigger }) => {
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const fetchStops = async () => {
      const res = await axios.get('http://localhost:5000/api/busstops');
      setStops(res.data);
    };
    fetchStops();
  }, [refreshTrigger]); // refetch when a stop is added

  return (
    <div className="max-w-2xl mx-auto my-4 bg-white shadow p-4 rounded-md">
      <h2 className="text-xl font-bold mb-4">All Bus Stops</h2>
      <ul>
        {stops.map((stop) => (
          <li key={stop._id} className="border-b py-2">
            <span className="font-semibold">{stop.name}</span>
            <br />
            <span className="text-sm text-gray-600">
              Lat: {stop.latitude}, Lon: {stop.longitude}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusStopList;
