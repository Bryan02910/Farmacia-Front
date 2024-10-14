import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { HomeOutlined, SupervisorAccountOutlined, ShoppingCartOutlined, Inventory2Outlined, NotificationsOutlined } from '@mui/icons-material';
import Page from '../../common/Page';
import imagesList from '../../../assets';
import { useHistory } from 'react-router-dom'; // Cambiar useNavigate por useHistory

const Acceso = () => {
    const history = useHistory(); // Cambiar useNavigate por useHistory

    // Función para crear un botón de acceso a cada módulo
    const createButton = (title, path, icon) => (
        <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: 3, textAlign: 'center' }}>
                <Button
                    onClick={() => history.push(path)} // Cambiar navigate(path) por history.push(path)
                    startIcon={icon}
                    variant="contained"
                    sx={{ width: '100%', py: 2 }}
                >
                    {title}
                </Button>
            </Paper>
        </Grid>
    );

    return (
        <Page title="Chapina | Dashboard">
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 5 }}>
                    <Typography sx={{ fontWeight: 'bold', mb: 2 }} variant='h5'>
                        Acceso denagado
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold', mb: 4 }} variant='h2'>
                        Farmacia Chapina
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={8} md={6}>
                            <Paper sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                                <img src={imagesList.Logo} alt='Dashboard' style={{ width: '100%', height: 'auto' }} />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justifyContent="center">
                        {createButton('Inicio', '/app', <HomeOutlined />)}
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
}

export default Acceso;
