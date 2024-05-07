import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CarContext = createContext();

export const CarListContext = ({ children }) => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        axios.get('http://localhost:8080/api/cars/get')
            .then(response => {
                setCars(response.data);
            })
            .catch(error => {
                console.log(error);
                console.log("Error fetching data from the server");
            });
    };

    const addCar = (newCar) => {
        setCars([...cars, newCar]);
    };

    const updateCar = (updatedCar) => {
        setCars(cars.map(car => car.ID === updatedCar.ID ? updatedCar : car));
    };

    const deleteCar = (carID) => {
        setCars(cars.filter(car => car.ID !== carID));
    };

    return (
        <CarContext.Provider value={{ cars, setCars, addCar, updateCar, deleteCar, fetchCars }}>
            {children}
        </CarContext.Provider>
    );
}
