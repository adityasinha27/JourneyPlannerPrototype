import React, { useState } from 'react';
import axios from 'axios';

const AddBusStop = ({ onBusStopAdded }) => {
  const [form, setForm] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/busstops', form);
      onBusStopAdded(); // Refresh list
      setForm({ name: '', latitude: '', longitude: '' });
    } catch (error) {
      alert('Failed to add bus stop');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-md max-w-md mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Add Bus Stop</h2>
      <input
        type="text"
        name="name"
        placeholder="Bus Stop Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="number"
        step="any"
        name="latitude"
        placeholder="Latitude"
        value={form.latitude}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="number"
        step="any"
        name="longitude"
        placeholder="Longitude"
        value={form.longitude}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Stop
      </button>
    </form>
  );
};

export default AddBusStop;
