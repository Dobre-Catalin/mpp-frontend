import React, { useContext, useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CarContext } from "../../Context/CarListContext";
import { queueRequest } from "../../Utils";

export default function CarList() {
    const { cars, setCars } = useContext(CarContext);
    const navigate = useNavigate();

    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchCars(); // Fetch cars when the component mounts
    }, [page]); // Fetch cars whenever the page changes

    const fetchCars = () => {
        axios
            .get(`http://localhost:8080/api/cars/get-more-entities?page=${page}&pageSize=5`) // Adjust the API endpoint to accept pagination parameters
            .then((response) => {
                if (page === 0) {
                    // If it's the first page, replace the existing data
                    setCars(response.data.content);
                } else {
                    // If it's not the first page, append the new data to the existing data
                    setCars((prevCars) => [...prevCars, ...response.data.content]);
                }
            })
            .catch((error) => {
                console.error("Error fetching data from the server:", error);
            });
    };

    const onCarClick = (car) => {
        navigate(`/products/${car.ID}`, { state: { car: car } });
    };

    const handleUpdateCar = (e, car) => {
        e.stopPropagation();
        navigate(`/update/${car.ID}`, { state: { car: car } });
    };

    const handleDeleteCar = (e, car) => {
        e.stopPropagation();
        axios
            .delete(`http://localhost:8080/api/cars/delete/${car.ID}`)
            .then((response) => {
                console.log(response);
                window.alert("Car deleted successfully");
                fetchCars(); // Fetch new data after deleting a car
            })
            .catch((error) => {
                console.error("Error deleting car:", error);
                window.alert("Error deleting car");
                queueRequest(`http://localhost:8080/api/cars/delete/${car.ID}`, "DELETE", car.ID);
                setCars(cars.filter((c) => c.ID !== car.ID)); // Update the local state without the deleted car
            });
    };

    //listen for bottom of page
    window.onscroll = function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                ///load more
                setPage(page + 1);
        }
    };

    return (
        <>
            <div>
                <div>
                    <h1>List of current cars</h1>
                    <h2>Press on any car to display details</h2>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Make</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Update</TableCell>
                                <TableCell>Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cars.map((car, index) => (
                                <TableRow key={index} onClick={() => onCarClick(car)}>
                                    <TableCell>{car.ID}</TableCell>
                                    <TableCell>{car.make}</TableCell>
                                    <TableCell>{car.model}</TableCell>
                                    <TableCell>{car.year}</TableCell>
                                    <TableCell>{car.price}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => handleUpdateCar(e, car)}
                                        >
                                            Update
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => handleDeleteCar(e, car)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button onClick={() => setPage(page + 1)}>Load More</Button> {/* Button to manually load more data */}
            </div>
        </>
    );
}