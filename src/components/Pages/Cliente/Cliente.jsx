import React, { useState, useEffect, useContext } from 'react';
import { InputLabel, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, Close } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import { MainContext } from '../../../Context/MainContext';

const Cliente = () => {
    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        id: "",
        nombre: "",
        correo: "",
        dpi: "",
        nit: "",
        telefono: "",
        direccion: "",
        estado: ""
    };

    const [clientesList, setClientesList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const init = async () => {
        const { data } = await ApiRequest().get('/cliente_select');
        setClientesList(data);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 200 },
        { field: 'correo', headerName: 'Correo', width: 220 },
        { field: 'dpi', headerName: 'DPI', width: 150 },
        { field: 'nit', headerName: 'NIT', width: 120 },
        { field: 'telefono', headerName: 'Teléfono', width: 150 },
        { field: 'direccion', headerName: 'Dirección', width: 200 },
        { field: 'estado', headerName: 'Estado', width: 100 },
        {
            field: '',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    {userRole === 'ADMIN' && (
                        <>
                            <IconButton size='small' onClick={() => {
                                setIsEdit(true);
                                setBody(params.row);
                                handleDialog();
                            }}>
                                <EditOutlined />
                            </IconButton>
                            <IconButton size='small' onClick={() => {
                                handleDialogDelete();
                                setIdDelete(params.id);
                            }}>
                                <DeleteOutline />
                            </IconButton>
                        </>
                    )}
                </Stack>
            )
        }
    ];

    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_cliente', { id: idDelete });
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            handleDialogDelete();
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const handleDialog = () => {
        setOpenDialog(prev => !prev);
    };

    const handleDialogDelete = () => {
        setOpenDialogDelete(prev => !prev);
    };

    const onChange = ({ target }) => {
        const { name, value } = target;
        setBody({
            ...body,
            [name]: value
        });
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_cliente', body);
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const onEdit = async () => {
        try {
            const { data } = await ApiRequest().post('/editar_cliente', body);
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (globalState.auth && globalState.auth.rol) {
            setUserRole(globalState.auth.rol);
        }
    }, [globalState]);

    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>¿Desea eliminar este cliente?</DialogTitle>
                <DialogActions>
                    <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
            <DialogTitle>{isEdit ? 'Editar cliente' : 'Crear cliente'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    {Object.keys(initialState).map((field, index) => (
                        field !== "id" && field !== "estado" && ( // Excluir "id" y "estado" de la generación dinámica
                            <Grid item xs={12} key={index}>
                                <TextField
                                    name={field}
                                    value={body[field]}
                                    onChange={onChange}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                />
                            </Grid>
                        )
                    ))}
                    {/* Campo de selección para Estado */}
                    <Grid item xs={12}>
                        <InputLabel htmlFor="estado">Estado del cliente</InputLabel>
                        <Select
                            name='estado'
                            value={body.estado || "Activo"} // Valor predeterminado "Activo" si está vacío
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                        >
                            <MenuItem value="Activo">Activo</MenuItem>
                            <MenuItem value="Inactivo">Inactivo</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>Guardar</Button>
            </DialogActions>
        </Dialog>

            <Page title="Chapina | Clientes">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h4">Lista de clientes</Typography>
                    </Box>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        {userRole === 'ADMIN' && (
                            <Grid item>
                                <Button
                                    onClick={() => { setIsEdit(false); handleDialog(); setBody(initialState); }}
                                    startIcon={<AddOutlined />}
                                    variant='contained'
                                    color='primary'
                                >
                                    Nuevo
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <CommonTable data={clientesList} columns={columns} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Cliente;
