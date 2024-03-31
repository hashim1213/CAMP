import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import 'leaflet/dist/leaflet.css';
import FarmView from './FarmView';

import Header from './Header'; // Import the Header component

const Dashboard = () => {
   
//main content of the dashboard
    return (
        <div className="dashboard">
             <Header /> {/* Self-contained Header is used here */}

            <main className="content">
                <div><FarmView /></div>
            </main>

           
        </div>
    );
};

export default Dashboard;
