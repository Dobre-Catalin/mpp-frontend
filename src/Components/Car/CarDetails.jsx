import React from "react";
import { useLocation } from "react-router-dom";

export default function CarDetails() {
    const location = useLocation();

    // Check if location.state is defined before accessing properties
    if (!location.state || !location.state.car) {
        // Handle the case where state is not properly passed
        return <div>Error: Car details not found</div>;
    }

    const car = location.state.car;

    const getBack = () => {
        // Navigate back to the previous page
        window.history.back();
    };

    return (
        <div>
            <table>
                <tbody>
                <tr>
                    <th>Detail</th>
                    <th>Info</th>
                </tr>
                <tr>
                    <td>Make:</td>
                    <td>{car.make}</td>
                </tr>
                <tr>
                    <td>Model:</td>
                    <td>{car.model}</td>
                </tr>
                <tr>
                    <td>Year:</td>
                    <td>{car.year}</td>
                </tr>
                <tr>
                    <td>Color:</td>
                    <td>{car.color}</td>
                </tr>
                <tr>
                    <td>Mileage:</td>
                    <td>{car.mileage}</td>
                </tr>
                <tr>
                    <td>Accidents:</td>
                    <td>{car.accidents}</td>
                </tr>
                <tr>
                    <td>Engine Capacity:</td>
                    <td>{car.engineCapacity}</td>
                </tr>
                <tr>
                    <td>Engine Type:</td>
                    <td>{car.engineType}</td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td>{car.price}</td>
                </tr>
                <tr>
                    <td>Location</td>
                    <td>{car.location}</td>
                </tr>
                </tbody>
            </table>
            <p>About: {car.about}</p>
            <button onClick={getBack}>Back</button>
        </div>
    );
}
