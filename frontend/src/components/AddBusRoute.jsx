import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddBusRoute = ({ onRouteAdded }) => {
  const [stops, setStops] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [form, setForm] = useState({ routeNumber: '', busNumber: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/busstops')
      .then((res) => setStops(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleStopSelect = (e) => {
    const stopId = e.target.value;
    if (stopId && !selectedStops.find(s => s.stop === stopId)) {
      setSelectedStops([...selectedStops, { stop: stopId, order: selectedStops.length + 1 }]);
    }
  };

  const removeStop = (index) => {
    const updated = selectedStops.filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, order: i + 1 }));
    setSelectedStops(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/busroutes', {
        routeNumber: form.routeNumber,
        busNumber: form.busNumber,
        stops: selectedStops,
      });
      setForm({ routeNumber: '', busNumber: '' });
      setSelectedStops([]);
      onRouteAdded();
    } catch (error) {
      alert("Failed to add route");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-2xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Add Bus Route</h2>

      <input
        type="text"
        name="routeNumber"
        placeholder="Route Number"
        value={form.routeNumber}
        onChange={(e) => setForm({ ...form, routeNumber: e.target.value })}
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        name="busNumber"
        placeholder="Bus Number"
        value={form.busNumber}
        onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
        required
        className="w-full p-2 mb-2 border rounded"
      />

      <select onChange={handleStopSelect} className="w-full p-2 mb-4 border rounded">
        <option value="">Select Stop to Add</option>
        {stops.map(stop => (
          <option key={stop._id} value={stop._id}>{stop.name}</option>
        ))}
      </select>

      <div className="mb-4">
        <h3 className="font-semibold">Selected Stops (Ordered):</h3>
        <ul className="list-disc ml-6">
          {selectedStops.map((s, index) => {
            const stopName = stops.find(st => st._id === s.stop)?.name || "Unknown";
            return (
              <li key={index}>
                {index + 1}. {stopName}
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="ml-2 text-red-600"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Route
      </button>
    </form>
  );
};

export default AddBusRoute;
