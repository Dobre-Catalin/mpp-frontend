import React, { useContext, useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LocationContext } from "../../Context/LocationListContext";
import { queueRequest } from "../../Utils";

export default function LocationList() {
    const { locations, setLocations } = useContext(LocationContext);
    const navigate = useNavigate();

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [fetchTimeout, setFetchTimeout] = useState(null);
    const [infiniteScroll, setInfiniteScroll] = useState(false); // State for infinite scrolling

    useEffect(() => {
        // Fetch locations when the component mounts
        fetchLocations();

        // Clean up function to clear timeout
        return () => {
            clearTimeout(fetchTimeout);
        };
    }, []); // Empty dependency array to run only once when component mounts

    const fetchLocations = () => {
        axios
            .get("http://localhost:8080/api/locations/get")
            .then((response) => {
                setLocations(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data from the server:", error);
            });
    };

    const debouncedFetchLocations = () => {
        // Clear previous timeout
        clearTimeout(fetchTimeout);

        // Set new timeout to fetch locations after 500ms
        const timeout = setTimeout(fetchLocations, 500);
        setFetchTimeout(timeout);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleUpdateLocation(e, location) {
        e.stopPropagation(); // Stop the propagation of the click event
        navigate(`/location/update/${location.id}`, { state: { location } });
    }

    function handleDeleteLocation(e, location) {
        e.stopPropagation();
        const confirmDelete = window.confirm(`Are you sure you want to remove ${location.name} from the list?`);
        if (confirmDelete) {
            axios
                .delete(`http://localhost:8080/api/locations/delete/${location.id}`)
                .then(() => {
                    fetchLocations();
                })
                .catch((error) => {
                    console.error("Error deleting location:", error);
                    queueRequest(`http://localhost:8080/api/locations/delete/${location.id}`, "DELETE", location.id);

                    // Update the local state to reflect the deletion
                    setLocations(locations.filter((loc) => loc.id !== location.id));
                });
        }
    }

    function onLocationClick(location) {
        console.log("Location clicked", location);
        navigate(`/location/${location.id}`, { state: { location } });
    }

    const toggleInfiniteScroll = () => {
        setInfiniteScroll(!infiniteScroll);
    };

    return (
        <div>
            <div>
                <h1>List of current locations</h1>
                <button onClick={toggleInfiniteScroll}>
                    {infiniteScroll ? "Disable Infinite Scroll" : "Enable Infinite Scroll"}
                </button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Car Count</TableCell>
                            <TableCell>Update</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {infiniteScroll
                            ? locations.map((location, index) => (
                                <TableRow key={index} onClick={() => onLocationClick(location)}>
                                    <TableCell>{location.id}</TableCell>
                                    <TableCell>{location.name}</TableCell>
                                    <TableCell>{location.address}</TableCell>
                                    <TableCell>{location.carCount}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => handleUpdateLocation(e, location)}
                                        >
                                            Update
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => handleDeleteLocation(e, location)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            ))
                            : locations
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((location, index) => (
                                    <TableRow key={index} onClick={() => onLocationClick(location)}>
                                        <TableCell>{location.id}</TableCell>
                                        <TableCell>{location.name}</TableCell>
                                        <TableCell>{location.address}</TableCell>
                                        <TableCell>{location.carCount}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => handleUpdateLocation(e, location)}
                                            >
                                                Update
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={(e) => handleDeleteLocation(e, location)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {!infiniteScroll && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={locations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </div>
    );
}
