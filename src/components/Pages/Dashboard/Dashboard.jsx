import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Page from '../../common/Page';
import imagesList from '../../../assets'

const Dashboard = () => {
    return (
        <Page title="Chapina | Dashboard">
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 5 }}>
                    <Typography sx={{ fontWeight: 'bold', mb: 2 }} variant='h5'>
                        Bienvenido a
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold', mb: 4 }} variant='h2'>
                        Farmacia Chapina
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={8} md={6}>
                            <Paper sx={{ padding: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
                                <img src={imagesList.Logo} alt='Dashboard' style={{ width: '100%', height: 'auto' }} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Page>
    );
}

export default Dashboard;
