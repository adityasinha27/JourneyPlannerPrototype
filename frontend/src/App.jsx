import React, { useState } from 'react';
import AddBusStop from './components/AddBusStop';
import BusStopList from './components/BusStopList';
import AddBusRoute from './components/AddBusRoute';
import BusRouteList from './components/BusRouteList';
import JourneyPlanner from './components/JourneyPlanner';

function App() {
  const [stopRefresh, setStopRefresh] = useState(false);
  const [routeRefresh, setRouteRefresh] = useState(false);

  const handleBusStopAdded = () => setStopRefresh(!stopRefresh);
  const handleRouteAdded = () => setRouteRefresh(!routeRefresh);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Mo Bus – Bus Management System
      </h1>

      {/* Bus Stop Section */}
      <section className="mb-10">
        <AddBusStop onBusStopAdded={handleBusStopAdded} />
        <BusStopList refreshTrigger={stopRefresh} />
      </section>

      {/* Bus Route Section */}
      <section className="mb-10">
        <AddBusRoute onRouteAdded={handleRouteAdded} />
        <BusRouteList refreshTrigger={routeRefresh} />
      </section>

      {/* Journey Planner Section */}
      <section className="mb-10">
        <JourneyPlanner />
      </section>
    </div>
  );
}

export default App;
