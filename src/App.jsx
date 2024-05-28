import React from 'react';
//import Car from './Components/Car';
import CarDetails from './Components/Car/CarDetails';
import CarList from './Components/Car/CarList';
import AppOptions from "./Components/AppOptions";
import {CarContext, CarListContext} from "./Context/CarListContext";
import {LocationListContext} from './Context/LocationListContext';
import {UserContext, UserProvider} from "./Context/UserContext";


const App = () => {

    return (
        <>
            <UserProvider>
                <LocationListContext>
                    <CarListContext>
                        <div>
                            <AppOptions></AppOptions>
                        </div>
                    </CarListContext>
                </LocationListContext>
            </UserProvider>
        </>
    );
};

export default App;
