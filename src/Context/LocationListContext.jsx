import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const LocationContext = createContext();

export const LocationListContext = ({ children }) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetchLocations();
    }, []); // Empty dependency array because fetchLocations doesn't depend on any external variables

    const fetchLocations = () => {
        axios.get('http://localhost:8080/api/locations/get')
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error(error);
                console.error("Error fetching data from the server");
            });
    };

    const addLocation = (newLocation) => {
        setLocations([...locations, newLocation]);
    };

    const updateLocation = (updatedLocation) => {
        // Consistency: Use IDs for comparison
        setLocations(locations.map(location => location.ID === updatedLocation.ID ? updatedLocation : location));
    };

    const deleteLocation = (locationID) => {
        // Consistency: Use IDs for comparison
        setLocations(locations.filter(location => location.ID !== locationID));
    };

    return (
        <LocationContext.Provider value={{ locations, setLocations, addLocation, updateLocation, deleteLocation, fetchLocations }}>
            {children}
        </LocationContext.Provider>
    );
}
