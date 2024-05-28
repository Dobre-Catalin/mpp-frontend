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
import {useContext} from "react";
import {CarContext} from "../../Context/CarListContext";
import {Select} from "@mui/material";
import {LocationContext} from "../../Context/LocationListContext";
import {queueRequest} from "../../Utils";



const theme = createTheme();


export default function AddLocation() {
    const navigate = useNavigate();

    const { locations, setLocations } = useContext(LocationContext);

    const authAxios = axios.create({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        withCredentials: true
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const locationName = data.get('Name');
        const addressData = data.get('Address');

        console.log(locationName, addressData)

        const newLocation = {
            nameOfLocation: locationName,
            address: addressData
        }
        authAxios.post('http://192.168.110.250:8080/api/locations/create', newLocation).then(response => {
            console.log(response);
            window.alert("location added successfully");
            setLocations([...locations, newLocation]);
            navigate('/locations');
        }).catch(error => {
            window.alert(error);

            var locationstring = JSON.stringify(newLocation);
            console.log(locationstring);
            window.alert("location added successfully" + locationstring);

            setLocations([...locations, newLocation]);

            queueRequest('http://192.168.110.250:8080/api/locations/create', 'POST', newLocation);
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
                        Add Location
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="Name"
                                    required
                                    fullWidth
                                    id="Name"
                                    label="Name"
                                    areaLavel="Name"
                                    autoFocus
                                    data-testid="nameid"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="Address"
                                    label="Address"
                                    name="Address"
                                />
                            </Grid>


                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            data-testid='add-Location'
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add the Location
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
