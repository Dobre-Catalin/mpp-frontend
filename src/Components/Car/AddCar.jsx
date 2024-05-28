import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {CarContext} from "../../Context/CarListContext";
import {MenuItem, Select} from "@mui/material";
import {LocationContext} from "../../Context/LocationListContext";
import {queueRequest} from "../../Utils";



const theme = createTheme();

export default function AddCar() {
    const navigate = useNavigate();

    const { user } = useContext(CarContext);
    const { cars, setCars } = useContext(CarContext);
    const { locations, setLocations } = useContext(LocationContext);

    ///load the locations in the select
    const loadLocations = () => {
        axios.get('http://188.27.132.161:8080/api/locations/get')
            .then(response => {
                setLocations(response.data);
            })
            .catch(error => {
                console.error("Error fetching data from the server:", error);
                ///set the location based on context if the server is not reachable
                setLocations(locations);
            });
    }

    const authAxios = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
            },
        withCredentials: true
    })

    const handleSubmit = async (event) => {
        const data = new FormData(event.currentTarget);
        const make = data.get('Make');
        const model = data.get('Model');
        const year = data.get('year');
        const color = data.get('color');
        const mileage = data.get('mileage');
        const accidents = data.get('accidents');
        const engineCapacity = data.get('engineCapacity');
        const engineType = data.get('engineType');
        const price = data.get('price');
        const about = data.get('about');
        const location = data.get('location');

        console.log(make, model, year, color, mileage, accidents, engineCapacity, engineType, price, about, location)

        console.log('submitting');

        const newCar = {
            make: make,
            model: model,
            year: year,
            color: color,
            mileage: mileage,
            accidents: accidents,
            engineCapacity: engineCapacity,
            engineType: engineType,
            price: price,
            about: about,
            locationId: location
        };
        await authAxios.post('http://188.27.132.161:8080/api/cars/create', newCar)
            .then(response => {
                console.log('response given for debug:', response.data);
                const updatedCars = [...cars, response.data];
                setCars(updatedCars);
                window.alert('Car added successfully');
                navigate('/products');
            })
            .catch(error => {
                if(error.response.status !== 403){
                    console.log("Error fetching data from the server debug:", error);
                    window.alert('Error adding car, queueing request');
                    queueRequest('POST', 'http://188.27.132.161:8080/api/cars/add', newCar, setCars);
                    navigate('/products');
                }
                else{
                    console.log('Error:', error);
                    console.log("Not authorized to add a car");
                    window.alert('You are not authorized to add a car');
                }
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Add Car
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="Make"
                                    required
                                    fullWidth
                                    id="Make"
                                    label="Make"
                                    areaLavel="Make"
                                    autoFocus
                                    data-testid="makeid"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="Model"
                                    label="Model"
                                    name="Model"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="year"
                                    label="Year"
                                    name="year"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="color"
                                    label="Color"
                                    name="color"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="mileage"
                                    label="Mileage"
                                    name="mileage"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="accidents"
                                    label="Accidents"
                                    name="accidents"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="engineCapacity"
                                    label="Engine Capacity"
                                    name="engineCapacity"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="engineType"
                                    label="Engine Type"
                                    name="engineType"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="price"
                                    label="Price"
                                    name="price"
                                    data-testid="price-input"
                                    testid="price-input"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="about"
                                    label="About"
                                    name="about"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    required
                                    fullWidth
                                    id="location"
                                    label="Location"
                                    name="location"
                                >
                                    {locations.map(location => (
                                        <MenuItem key={location.id} value={location.id}>
                                            {location.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            data-testid='add-car'
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
Add the Car
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
