import React, { useContext, useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Link, Navigate, useNavigate} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';
import { CarContext } from "../Context/CarListContext";
import CarList from './Car/CarList';
import AddCar from './Car/AddCar';
import CarDetails from "./Car/CarDetails";
import ModifyCar from "./Car/ModifyCar";
import Settings from "./Settings";
import axios from "axios";
import ChartPrices from "./Car/ChartPrices";
import { LocationContext } from "../Context/LocationListContext";
import LocationList from "./Location/LocationList";
import AddLocation from "./Location/AddLocation";
import ModifyLocation from "./Location/ModifyLocation";
import {queueRequest} from "../Utils";
import {popQueueRequest} from "../Utils";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/signup";
import {UserContext, UserProvider} from "../Context/UserContext";
import Home from "./Home";
import Logout from "./Logout";

const notLoggedInPages = ['SignIn', 'SignUp'];

const pages = ['Products', 'AddCar', 'Locations', 'AddLocation', 'Settings', 'Charts', 'LogOut'];

function ResponsiveAppBar() {
    const { setCars } = useContext(CarContext);
    const { setLocations } = useContext(LocationContext);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    const { user } = useContext(UserContext);

    useEffect(() => {
        const checkBackendConnection = () => {
            axios.get('192.168.110.250:8080/api/cars/check-backend-connection')
                .then(response => {
                    if (response.status === 200) {
                        setIsConnected(true); // Set connection status to true
                        fetchUpdatedCarList();
                        fetchUpdatedLocationList();
                        sendQueuedRequests(); // Send queued requests if any
                    } else {
                        throw new Error('Unable to connect to backend server.');
                    }
                })
                .catch(error => {
                    console.error('Error connecting to backend:', error);
                    setIsConnected(false); // Set connection status to false
                    setError(error.message);
                });
        };

        const intervalId = setInterval(checkBackendConnection, 1000000); // Check every 0.5 seconds

        // Initial check on mount
        checkBackendConnection();

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, []);

    const fetchUpdatedCarList = () => {
        axios.get('http://192.168.110.250:8080/api/cars/get')
            .then(response => {
                const updatedCars = response.data;
                setCars(updatedCars);
            })
            .catch(error => {
                console.error('Error fetching updated car list:', error);
            });
    };

    const fetchUpdatedLocationList = () => {
        axios.get('http:/192.168.110.250:9090/api/locations/get')
            .then(response => {
                const updatedLocations = response.data;
                setLocations(updatedLocations);
            })
            .catch(error => {
                console.error('Error fetching updated location list:', error);
            });
    };

    const sendQueuedRequests = () => {
        let queuedRequest = popQueueRequest(); // Retrieve and remove the first queued request
        while (queuedRequest) {
            window.alert(queuedRequest.url.toString() + queuedRequest.method.toString() + queuedRequest.body.toString());
            axios.request({
                url: queuedRequest.url,
                method: queuedRequest.method,
                data: queuedRequest.body
            }).catch(error => {
                console.error('Error sending queued request:', error);
                // Handle error as needed
            });
            queuedRequest = popQueueRequest(); // Get the next queued request
        }
    };

    return (
        <BrowserRouter>
            <React.Fragment>
                {error && !isConnected && (
                    <AppBar position="static" color="error">
                        <Container maxWidth="xl">
                            <Toolbar>
                                <Typography variant="h6" color="inherit">
                                    {error}
                                </Typography>
                            </Toolbar>
                        </Container>
                    </AppBar>
                )}
                <AppBar position="static" id="appbar">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                to="/home"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Car Dealer
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                {localStorage.token ? pages.map((page, index) => (
                                    <Button
                                        key={index}
                                        component={Link}
                                        to={`/${page.toLowerCase()}`}
                                        sx={{ color: 'inherit', textDecoration: 'none', textTransform: 'none' }}
                                    >
                                        {page}
                                    </Button>
                                )) : notLoggedInPages.map((page, index) => (
                                    <Button
                                        key={index}
                                        component={Link}
                                        to={`/${page.toLowerCase()}`}
                                        sx={{ color: 'inherit', textDecoration: 'none', textTransform: 'none' }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Container>
                    <Routes>
                        <Route path="/" element={<Navigate to="/signin" replace />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path= "/signup" element={<SignUp />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/products" element={<CarList />} />
                        <Route path="/addcar" element={<AddCar />} />
                        <Route path="/products/:id" element={<CarDetails />} />
                        <Route path="/update/:id" element={<ModifyCar />} />
                        <Route path="/remove/:id" element={<h1>Remove car</h1>} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/charts" element={<ChartPrices />} />
                        <Route path="/locations" element={<LocationList />} />
                        <Route path="/addlocation" element={<AddLocation />} />
                        <Route path="/location/update/:id" element={<ModifyLocation />} />
                        <Route path="/logout" element={<Logout/>} />
                    </Routes>
                </Container>
            </React.Fragment>
        </BrowserRouter>
    );
}

export default ResponsiveAppBar;
