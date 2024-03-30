import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

const { BaseLayer } = LayersControl;

const MapView = () => {
  const position = [55.0, -97.0]; // Center position on Manitoba

  // Define tile layers for different map styles
  const tileLayers = {
    Satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    Standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    
    Topographic: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" // Example topographic layer URL
  };

  return (
    <div className="map-container">
      <MapContainer center={position} zoom={6} className="leaflet-container">
        <LayersControl position="topright">
          {Object.entries(tileLayers).map(([name, url]) => (
            <BaseLayer checked={name === "Standard"} name={name} key={name}>
              <TileLayer
                url={url}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </BaseLayer>
          ))}
        </LayersControl>
        <Marker position={position}>
          <Popup>Manitoba</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
