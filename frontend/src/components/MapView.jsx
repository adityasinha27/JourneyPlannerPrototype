import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon (optional fix for missing icon)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapView = ({ path }) => {
  if (!path || path.length === 0) return null;

  const coordinates = path.map(step => {
    const match = step.stopNameCoords?.split(',');
    return match ? [parseFloat(match[0]), parseFloat(match[1])] : null;
  }).filter(coord => coord);

  return (
    <MapContainer center={coordinates[0]} zoom={13} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.map((position, index) => (
        <Marker key={index} position={position}>
          <Popup>{path[index].stopName}</Popup>
        </Marker>
      ))}
      <Polyline positions={coordinates} color="blue" />
    </MapContainer>
  );
};

export default MapView;
