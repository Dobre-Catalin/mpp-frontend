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
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useContext} from "react";
import {CarContext} from "../../Context/CarListContext";
import {queueRequest} from "../../Utils";
import {LocationContext} from "../../Context/LocationListContext";
import {MenuItem, Select} from "@mui/material";

const theme = createTheme();

export default function ModifyCar() {
    const location = useLocation();
    const { cars, setCars } = useContext(CarContext);
    const { locations, setLocations } = useContext(LocationContext);

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

    // Check if location.state is defined before accessing properties
    if (!location.state || !location.state.car) {
        // Handle the case where state is not properly passed
        return <div>Error: Car details not found</div>;
    }

    const car = location.state.car;

    const navigate = useNavigate();

    const [carMake, setMake] = React.useState(car.make)
    const [carModel, setModel] = React.useState(car.model)
    const [carYear, setYear] = React.useState(car.year)
    const [carColor, setColor] = React.useState(car.color)
    const [carMileage, setMileage] = React.useState(car.mileage)
    const [carAccidents, setAccidents] = React.useState(car.accidents)
    const [carEngineCapacity, setEngineCapacity] = React.useState(car.engineCapacity)
    const [carEngineType, setEngineType] = React.useState(car.engineType)
    const [carPrice, setPrice] = React.useState(car.price)
    const [carAbout, setAbout] = React.useState(car.about)

    const handleSubmit = (event) => {
        event.preventDefault();
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
        window.alert(make, model, year, color, mileage, accidents, engineCapacity, engineType, price, about, location)

        const authAxios = axios.create({
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

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

        authAxios.put(`http://192.168.110.250:8080/api/cars/update/${car.ID}`, newCar)
            .then(response => {
                console.log(response);
                setCars([...cars.filter((c) => c.ID !== car.ID), newCar]);

                navigate('/products');
            })
            .catch(error => {
                console.log(error);
                console.log("Error updating car from the server");
                window.alert(error);
                // Queue the request to be sent later

                queueRequest(`http://192.168.110.250:8080/api/cars/update/${car.ID}`, 'PUT', newCar);

                // Update the local state to reflect the update
                setCars([...cars.filter((c) => c.ID !== car.ID), newCar]);
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
                        alignItems: 'center'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Modify Car
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="Make"
                                    required
                                    fullWidth
                                    id="Make"
                                    label="Make"
                                    autoFocus
                                    defaultValue={carMake}
                                    onChange={(e) => setMake(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="Model"
                                    label="Model"
                                    name="Model"
                                    defaultValue={carModel}
                                    onChange={(e) => setModel(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="year"
                                    label="Year"
                                    name="year"
                                    defaultValue={carYear}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="color"
                                    label="Color"
                                    name="color"
                                    defaultValue={carColor}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="mileage"
                                    label="Mileage"
                                    name="mileage"
                                    defaultValue={carMileage}
                                    onChange={(e) => setMileage(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="accidents"
                                    label="Accidents"
                                    name="accidents"
                                    defaultValue={carAccidents}
                                    onChange={(e) => setAccidents(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="engineCapacity"
                                    label="Engine Capacity"
                                    name="engineCapacity"
                                    defaultValue={carEngineCapacity}
                                    onChange={(e) => setEngineCapacity(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="engineType"
                                    label="Engine Type"
                                    name="engineType"
                                    defaultValue={carEngineType}
                                    onChange={(e) => setEngineType(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    data-testid="price-input"
                                    testid="price-input"


                                    required
                                    fullWidth
                                    id="price"
                                    label="Price"
                                    name="price"
                                    defaultValue={carPrice}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="about"
                                    label="About"
                                    name="about"
                                    defaultValue={carAbout}
                                    onChange={(e) => setAbout(e.target.value)}
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
                            variant="contained"
                            data-testid='update-car'
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Modify Car
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
