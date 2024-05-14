import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './BoundaryThumbnail.css'; // Ensure to create a CSS file for thumbnail styling

const BoundaryThumbnail = ({ boundary }) => {
  const boundaryData = JSON.parse(boundary);

  useEffect(() => {
    if (!boundaryData || !boundaryData.geometry || !boundaryData.geometry.coordinates) {
      return;
    }
  }, [boundaryData]);

  return (
    <div className="boundary-thumbnail">
      <MapContainer
        center={[boundaryData.geometry.coordinates[0][0][1], boundaryData.geometry.coordinates[0][0][0]]} // Center the map on the first coordinate
        zoom={15} // Set a higher zoom level to focus on the boundary
        style={{ height: "150px", width: "100%" }} // Size of the thumbnail map
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={boundaryData} />
      </MapContainer>
    </div>
  );
};

export default BoundaryThumbnail;
