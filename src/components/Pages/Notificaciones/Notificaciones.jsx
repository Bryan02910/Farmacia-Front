import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardActions, Button } from '@mui/material';
import Page from '../../common/Page';
import ApiRequest from '../../../helpers/axiosInstances';
import { MainContext } from '../../../Context/MainContext';
import ToastAutoHide from '../../common/ToastAutoHide';

const StockYVencimientos = () => {
    const { globalState } = useContext(MainContext);
    const [stockBajo, setStockBajo] = useState([]);
    const [farmacosProntosAVencer, setFarmacosProntosAVencer] = useState([]);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

    const init = async () => {
        try {
            const stockResponse = await ApiRequest().get('/stock_bajo');
            setStockBajo(stockResponse.data);
            const vencimientosResponse = await ApiRequest().get('/farmacos_prontos_a_vencer');
            setFarmacosProntosAVencer(vencimientosResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setMensaje({
                ident: new Date().getTime(),
                message: 'Error al obtener los datos',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <Page title="Chapina | Stock Bajo y Fármacos Prontos a Vencer">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Stock Bajo</Typography>
                </Box>
                <Grid container spacing={2}>
                    {stockBajo.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{item.nombre}</Typography>
                                    <Typography color="textSecondary">ID: {item.id}</Typography>
                                    <Typography color="textSecondary">Stock Total: {item.stock_total_calculado}</Typography>
                                    <Typography color="textSecondary">Nivel de Reorden: {item.nivel_reorden}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">Detalles</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ pb: 5, mt: 5 }}>
                    <Typography variant="h4">Fármacos Prontos a Vencer</Typography>
                </Box>
                <Grid container spacing={2}>
                    {farmacosProntosAVencer.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6">{item.nombre}</Typography>
                                    <Typography color="textSecondary">ID: {item.id}</Typography>
                                    <Typography color="textSecondary">Fecha de Vencimiento: {item.fecha_vencimiento}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">Detalles</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Page>
    );
};

export default StockYVencimientos;
