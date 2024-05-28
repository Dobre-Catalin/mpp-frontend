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
import {UserContext} from "../../Context/UserContext";
import {useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const defaultTheme = createTheme();

export default function SignIn() {
    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    const authAxios = axios.create({
baseURL: 'http://192.168.110.250:8080/api/login/authenticate',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            password: data.get('password'),
        });
        await authAxios.post('', {
            username: data.get('username'),
            password: data.get('password'),
        })
            .then(response => {
                if(response.status === 200){
                    console.log(response.data);
                    updateUser({
                        username: data.get('username'),
                        token: response.data.token,
                    });
                    sessionStorage.setItem('username', data.get('username'));
                    sessionStorage.setItem('token', response.data.token);
                    localStorage.setItem('username', data.get('username'));
                    localStorage.setItem('token', response.data.token);
                    window.alert('Login successful.');
                    navigate('/home');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.alert('Login failed.');
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}