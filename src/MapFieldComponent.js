import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

// Assuming the parent component passes the function as onBoundaryChange
const MapFieldComponent = ({ onSubmit}) => {
  const [mapCenter, setMapCenter] = useState(null);
  
  useEffect(() => {
    // Attempt to fetch the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.log("Unable to retrieve your location. Using a default location.");
        // Use a default location (e.g., center of Manitoba) if unable to fetch location
        setMapCenter([55.0, -97.0]);
      }
    );
  }, []);

  const handleCreateOrEdit = (e) => {
    // Checking if layer exists in the event
    if (!e.layer) {
      console.error("Layer data is missing from the event.");
      return;
    }
  
    try {
      const boundaryData = e.layer.toGeoJSON().geometry; // Extracting the boundary data
      onSubmit(boundaryData); // Submitting the boundary data
    } catch (error) {
      console.error("Error processing boundary data:", error);
    }
  };
  
  

  return mapCenter ? (
    <MapContainer center={mapCenter} zoom={9} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            polyline: false,
            circlemarker: false,
            marker: false,
            // Enable polygons for drawing complex shapes
            polygon: true,
          }}
          edit={{
            featureGroup: L.featureGroup(), // Necessary for editing capabilities
            remove: true,
          }}
          onCreated={handleCreateOrEdit}
          onEdited={handleCreateOrEdit}
        />
      </FeatureGroup>
    </MapContainer>
  ) : (
    <p>Loading map... If it takes too long, ensure you've allowed location access.</p> // Provide a more informative loading/error message
  );
};

export default MapFieldComponent;
