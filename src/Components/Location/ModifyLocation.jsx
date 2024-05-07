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
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { LocationContext } from '../../Context/LocationListContext';
import {queueRequest} from "../../Utils";

const theme = createTheme();

export default function ModifyLocation() {
    const location = useLocation();
    const { locations, setLocations } = useContext(LocationContext);

    console.log(location.state.location)

    // Check if location.state is defined before accessing properties
    if (!location.state || !location.state.location) {
        // Handle the case where state is not properly passed
        return <div>Error: Location details not found</div>;
    }

    const locationData = location.state.location;

    const navigate = useNavigate();

    const [locationName, setName] = React.useState(locationData.name);
    const [locationAddress, setAddress] = React.useState(locationData.address);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const address = data.get('address');

        const newLocation = {
            nameOfLocation: name,
            address: address,
        };

        axios.put(`http://localhost:8080/api/locations/update/${locationData.id}`, newLocation)
            .then((response) => {
                console.log(response);
                window.alert('Location modified successfully');
                const updatedLocations = locations.map((location) => {
                    if (location.id === locationData.id) {
                        return newLocation;
                    }
                    return location;
                });
                setLocations(updatedLocations);
                navigate('/locations');
            })
            .catch((error) => {
                console.error('Error modifying Location:', error);
                window.alert('Error modifying Location');

                queueRequest(`http://localhost:8080/api/locations/update/${locationData.id}`, 'PUT', newLocation);

                setLocations(locations.filter((location) => location.id !== locationData.id).concat(newLocation));
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
                        Modify Location
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    defaultValue={locationName}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    defaultValue={locationAddress}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Modify Location
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
