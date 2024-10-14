import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import Page from '../../common/Page';
import CommonTable from '../../common/CommonTable';
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

    const stockColumns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 300 },
        { field: 'stock_total_calculado', headerName: 'Stock Total', width: 150 },
        { field: 'nivel_reorden', headerName: 'Nivel de Reorden', width: 150 },
    ];

    const vencimientoColumns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 300 },
        { field: 'fecha_vencimiento', headerName: 'Fecha de Vencimiento', width: 200 },
    ];

    return (
        <Page title="Chapina | Stock Bajo y Fármacos Prontos a Vencer">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Stock Bajo</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CommonTable
                            data={stockBajo}
                            columns={stockColumns}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ pb: 5, mt: 5 }}>
                    <Typography variant="h4">Fármacos Prontos a Vencer</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CommonTable
                            data={farmacosProntosAVencer}
                            columns={vencimientoColumns}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page> 
    );
};

export default StockYVencimientos;
