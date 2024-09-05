import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, 
Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu 
,MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import 'jspdf-autotable';




const Laboratorio = () => {

    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        id: "",
        nombre: "",
        direccion: "",
        telefono: "",
        correo_electronico: "",
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);


    const init = async () => {
        const { data } = await ApiRequest().get('/laboratorio');
        setUsuariosList(data);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'nombre', headerName: 'Nombre', width: 220 },
        { field: 'direccion', headerName: 'Dirección', width: 220 },
        { field: 'telefono', headerName: 'Telefono', width: 220 },
        { field: 'correo_electronico', headerName: 'Correo', width: 220 },
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
			const { data } = await ApiRequest().post('eliminar_lab', { id: idDelete })
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			handleDialogDelete()
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

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
            [name]: name === 'rol' ? Number(value) : value // Convertir a número si es el rol
        });
    };
    
    

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_lab', body);
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
            
            const { data } = await ApiRequest().post('/editar_lab', body);
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

    const fetchRoles = async () => {
        try {
        const response = await ApiRequest().get('/roles'); 
        setRoles(response.data);
        } catch (error) {
        console.error('Error fetching roles data:', error);
        }
    };

    useEffect(() => {
        fetchRoles(); // Fetch marca options when the component mounts.
        init();
    }, []);

    
	
	useEffect(() => {
        // Verifica si el usuario ha iniciado sesión y tiene un rol asignado
        if (globalState.auth && globalState.auth.rol) {
            setUserRole(globalState.auth.rol);
        }
    }, [globalState]);
	
	
   // useEffect(init, []);

   return (
    <>
        {/* Dialogo para Eliminar Usuario */}
        <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
            <DialogTitle>¿Desea eliminar este laboratorio?</DialogTitle>
            <DialogContent>
                <Typography variant='body1' color='textSecondary'>
                    Esta acción es irreversible.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
                <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
            </DialogActions>
        </Dialog>

        {/* Dialogo para Crear/Editar Usuario */}
        <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
            <DialogTitle>{isEdit ? 'Editar Laboratorio' : 'Crear Laboratorio'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='nombre'
                            value={body.nombre}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Nombre del laboratorio'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='direccion'
                            value={body.direccion}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Dirección'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='telefono'
                            value={body.telefono}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Telefono'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='correo_electronico'
                            value={body.correo_electronico}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Correo'
                        />
                    </Grid>
                  
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>Guardar</Button>
            </DialogActions>
        </Dialog>

        {/* Página de Usuarios */}
        <Page title="Chapina | Laboratorios">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Lista de laboratorios</Typography>
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
                        <CommonTable
                            data={usuariosList}
                            columns={columns.map(column => {
                                if (column.field === '') {
                                    return {
                                        ...column,
                                        renderCell: (params) => (
                                            <Stack
                                                direction='row'
                                                divider={<Divider orientation="vertical" flexItem />}
                                                justifyContent="center"
                                                alignItems="center"
                                                spacing={2}
                                            >
                                                {userRole === 'ADMIN' && (
                                                    <>
                                                        <IconButton size='small' onClick={() => { setIsEdit(true); setBody(params.row); handleDialog(); }}>
                                                            <EditOutlined />
                                                        </IconButton>
                                                        <IconButton size='small' onClick={() => { handleDialogDelete(); setIdDelete(params.id); }}>
                                                            <DeleteOutline />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </Stack>
                                        )
                                    };
                                }
                                return column;
                            })}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    </>
);

};

export default Laboratorio;
