import React, { useState, useContext, useEffect } from 'react';
import { Grid, CssBaseline, Paper, Avatar, Typography, TextField, Button, InputAdornment, IconButton, LinearProgress, Box, Link } from '@mui/material';
import { LockOpen, Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import ApiRequest from '../../../helpers/axiosInstances';
import { MainContext, APP_STATE, AUTH_TYPES } from '../../../Context/MainContext';
import ToastAutoHide from '../../common/ToastAutoHide';
import Page from '../../common/Page';
import imagesList from '../../../assets'

const Login = () => {
    const { globalDispatch } = useContext(MainContext);
    const [bodyLogin, setBodyLogin] = useState({ username: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const { push } = useHistory();

    const onChange = e => {
        const { name, value } = e.target;
        setBodyLogin({
            ...bodyLogin,
            [name]: value
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        ApiRequest().post('/login', bodyLogin)
            .then(({ data }) => {
                const userRole = data.rol;

                globalDispatch({
                    type: AUTH_TYPES.LOGIN_OK,
                    payload: { ...data, role: userRole }
                });
                setIsLoading(false);
                push('/app');
            })
            .catch(({ response }) => {
                globalDispatch({ type: AUTH_TYPES.LOGIN_FAIL });
                setMensaje({
                    ident: new Date().getTime(),
                    message: response.data,
                    type: 'error'
                });
                setIsLoading(false);
            });
    };

    const init = () => {
        globalDispatch({
            type: APP_STATE.CLEAR_APP_STATE
        });
        localStorage.clear();
    };

    useEffect(init, []);

    return (
        <Page title="Chapina | Login">
            <ToastAutoHide message={mensaje} />
            <Grid
                container
                component="main"
                sx={{
                    height: '100vh',
                    backgroundColor: '#ffffff', // Fondo blanco
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CssBaseline />
                <Grid container spacing={0} alignItems="center" justifyContent="center">
                    <Grid item xs={12} sm={5} md={5} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        backgroundImage: `url(${imagesList.Logo})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        maxWidth: '400px' // Ajustar el ancho máximo de la imagen
                    }} />
                    <Grid item xs={12} sm={7} md={5} component={Paper} elevation={6} square
                        sx={{
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#e0f7fa', // Celeste claro
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                            maxWidth: '400px', // Ajustar el ancho máximo del formulario
                            margin: 'auto'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                            Iniciar Sesión
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                value={bodyLogin.username}
                                onChange={onChange}
                                variant="outlined"
                                margin="normal"
                                label="Correo electrónico"
                                name="username"
                                autoComplete="email"
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}
                            />
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                value={bodyLogin.password}
                                onChange={onChange}
                                margin="normal"
                                name="password"
                                label="Contraseña"
                                type={showPass ? "text" : "password"}
                                autoComplete="current-password"
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPass(!showPass)}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                }}
                                            >
                                                {showPass ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {isLoading && <LinearProgress sx={{ mt: 2, mb: 2 }} />}
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                onClick={handleSubmit}
                            >
                                Iniciar sesión
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Page>
    );
};

export default Login;
