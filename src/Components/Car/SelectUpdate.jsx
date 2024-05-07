import * as React from "react";
import CarDetails from "./CarDetails";
import ModifyCar from "./ModifyCar";

export default function SelectUpdate({cars, modifyCar}) {
    const [selectedCar, setSelectedCar] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);

    function onCarClick({index, car, modifyCar}) {
        setSelectedCar(car);
        setSelectedIndex(index);
    }


    return(
        selectedCar ?
            <ModifyCar car={selectedCar} changeCar={modifyCar} index={selectedIndex}/> :(
                <>
                <div>
                    <h1>List of current cars</h1>
                    <h2>Press on a car to modify it</h2>
                </div>
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Year</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cars.map((car, index) => (
                            <tr key={index} onClick={() => onCarClick({index, car})}>
                                <td>{car.make}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div></>)
    );
};