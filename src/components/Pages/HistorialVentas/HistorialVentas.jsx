import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, 
Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu 
,MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined, Close} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import 'jspdf-autotable';




const HistorialVentas = () => {

    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        id: "",
        nombre_cliente:"",
        total_venta: "",
        fecha_venta: "",
        Nofactura: ""
        
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);


    const init = async () => {
        const { data } = await ApiRequest().get('/historial_ventas');
        setUsuariosList(data);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
          { field: 'nombre_cliente', headerName: 'Cliente', width: 220 },
          { field: 'total_venta', headerName: 'Total venta', width: 220 },
          {
			field: 'fecha_venta',
			headerName: 'Fecha de venta',
			width: 220,
			valueFormatter: (params) => {
			  const fechaCompleta = params.value; // Suponemos que params.value contiene la fecha y la hora
			  const fecha = new Date(fechaCompleta);
			  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
			  return fecha.toLocaleDateString('es-ES', options); // Ajusta 'es-ES' al idioma deseado
			},
		  },
          { field: 'Nofactura', headerName: 'No. Recibo', width: 220 },
          
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
			const { data } = await ApiRequest().post('/eliminar_rol', { id: idDelete })
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
            const { data } = await ApiRequest().post('/guardar_rol', body);
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
            
            const { data } = await ApiRequest().post('/editar_rol', body);
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
            <DialogTitle>
                ¿Desea eliminar este rol?
                <IconButton 
                    aria-label="close" 
                    onClick={handleDialogDelete} 
                    style={{ position: 'absolute', right: 8, top: 8 }} 
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography variant='body1' color='textSecondary'>
                    Esta acción es irreversible.
                </Typography>
            </DialogContent> 
            <DialogActions> 
                <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
            </DialogActions>
        </Dialog>

        {/* Dialogo para Crear/Editar Usuario */}
        <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
            <DialogTitle>
                {isEdit ? 'Editar rol' : 'Crear rol'}
                <IconButton 
                    aria-label="close" 
                    onClick={handleDialog} 
                    style={{ position: 'absolute', right: 8, top: 8 }} 
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='descripcion'
                            value={body.descripcion}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Descripción'
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>Guardar</Button>
            </DialogActions>
        </Dialog>

        {/* Página de Usuarios */}
        <Page title="Chapina | Historial compras">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Historial de compras</Typography>
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

export default HistorialVentas;
