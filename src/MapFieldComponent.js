import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';


const MapFieldComponent = ({ onFieldsChange }) => {
  const [position, setPosition] = useState(null);

  const LocateControl = () => {
    const map = useMap();
  
    useEffect(() => {
      if (!position) { // Only locate if position has not been set
        map.locate({ setView: true, maxZoom: 16 });
      }
    }, [map, position]); // Depend on position to avoid repeated locating
  
    useMapEvents({
      locationfound(e) {
        setPosition(e.latlng);
      },
    });

    return position ? (
      <FeatureGroup>
        <EditControl
          position="topright"
          onEdited={(e) => {
            const layers = e.layers;
            let coordinates = [];
            layers.eachLayer((layer) => {
              coordinates.push(layer.toGeoJSON().geometry.coordinates);
            });
            onFieldsChange(coordinates);
          }}
          onCreated={(e) => {
            const { layer } = e;
            const coordinates = layer.toGeoJSON().geometry.coordinates;
            onFieldsChange(coordinates);
          }}
          draw={{
            rectangle: false,
            polyline: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      </FeatureGroup>
    ) : null;
  };

  return (
    <MapContainer center={position || [51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocateControl />
    </MapContainer>
  );
};

export default MapFieldComponent;
