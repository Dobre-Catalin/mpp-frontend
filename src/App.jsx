import React from 'react';
//import Car from './Components/Car';
import CarDetails from './Components/Car/CarDetails';
import CarList from './Components/Car/CarList';
import AppOptions from "./Components/AppOptions";
import {CarContext, CarListContext} from "./Context/CarListContext";
import { LocationListContext } from './Context/LocationListContext';


const App = () => {

    return (
        <>
            <LocationListContext>
            <CarListContext>
                <div>
                    <AppOptions></AppOptions>
                </div>
            </CarListContext>
            </LocationListContext>
        </>
    );
};

export default App;
