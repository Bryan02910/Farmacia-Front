import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, 
Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu, MenuItem, Select, InputLabel, Checkbox } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined, Close } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import { MainContext, APP_STATE } from '../../../Context/MainContext';
import 'jspdf-autotable';

const Permisos = () => {

    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        id: "",
        rol: "",
        ver_usuarios: "",
        ver_ventas: "",
        ver_compras: "",
        ver_inventario: "",
        ver_notificaciones: "",
        view_home: "",
        ver_rol: "",
        ver_lab: "",
        ver_prov: "",
        ver_historial_compras: "",
        ver_historial_ventas: "",
        ver_tipod:"",
        ver_permisos:""
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
  

    const init = async () => {
        const { data } = await ApiRequest().get('/permisos');
        setUsuariosList(data);
    };

    // Función para manejar el diálogo
    const handleDialog = () => {
        setOpenDialog(!openDialog); // Alterna el estado del diálogo
    };

    // Función que maneja el cambio del checkbox
    /*const handleCheckboxChange = async (event, row, permisoId) => {
        const isChecked = event.target.checked;
    
        try {
            const body = {
                rolId: row.id, // Usamos 'id' de la fila que representa el rol
                permisoId, // ID del permiso a agregar o eliminar
            };
    
            // Determinamos el endpoint basado en el estado del checkbox
            const endpoint = isChecked ? '/guardar_permiso' : '/eliminar_permiso';
            
            // Realizamos la solicitud al backend
            const { data } = await ApiRequest().post(endpoint, body);
    
            // Manejar la respuesta, como mostrar un mensaje de éxito
            console.log(data.message); // Muestra el mensaje que regresa del servidor
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            // Manejo de errores aquí (puedes mostrar un mensaje al usuario)
        }
    };*/
    
    const handleCheckboxChange = async (event, row, permisoId) => {
        const isChecked = event.target.checked;
    
        // Creamos un mapeo de permisos
        const permisoMap = {
            1: 'ver_usuarios',
            2: 'ver_ventas',
            3: 'ver_compras',
            4: 'ver_inventario',
            5: 'ver_notificaciones',
            6: 'view_home',
            7: 'ver_rol',
            8: 'ver_lab',
            9: 'ver_prov',
            10: 'ver_historial_compras',
            11: 'ver_historial_ventas',
            12: 'ver_tipod',
            13: 'ver_permisos',
        };
    
        const permisoKey = permisoMap[permisoId];
    
        // Actualiza el estado local antes de realizar la solicitud
        const updatedUsuariosList = usuariosList.map(item => {
            if (item.id === row.id) {
                return {
                    ...item,
                    [permisoKey]: isChecked ? 'Sí' : 'No' // Actualiza el permiso correspondiente
                };
            }
            return item;
        });
    
        setUsuariosList(updatedUsuariosList); // Actualiza el estado con la nueva lista
    
        try {
            const body = {
                rolId: row.id, // Usamos 'id' de la fila que representa el rol
                permisoId, // ID del permiso a agregar o eliminar
            };
    
            // Determinamos el endpoint basado en el estado del checkbox
            const endpoint = isChecked ? '/guardar_permiso' : '/eliminar_permiso';
            
            // Realizamos la solicitud al backend
            const { data } = await ApiRequest().post(endpoint, body);
    
            // Manejar la respuesta, como mostrar un mensaje de éxito
            console.log(data.message); // Muestra el mensaje que regresa del servidor
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            // Si ocurre un error, revertir el cambio en el estado
            setUsuariosList(prevState =>
                prevState.map(item => {
                    if (item.id === row.id) {
                        return {
                            ...item,
                            [permisoKey]: isChecked ? 'No' : 'Sí' // Revierte el cambio
                        };
                    }
                    return item;
                })
            );
        }
    };
    

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'rol', headerName: 'ROL', width: 220 },
        { 
            field: 'ver_usuarios', 
            headerName: 'Permiso usuario', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_usuarios === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 1)} // Asumiendo que el ID del permiso es 1
                />
            )
        },
        { 
            field: 'ver_ventas', 
            headerName: 'Permiso ventas', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_ventas === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 2)}
                />
            )
        },
        { 
            field: 'ver_compras', 
            headerName: 'Permiso compras', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_compras === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 3)}
                />
            )
        },
        { 
            field: 'ver_inventario', 
            headerName: 'Permiso inventario', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_inventario === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 4)}
                />
            )
        },
        { 
            field: 'ver_notificaciones', 
            headerName: 'Permiso notificaciones', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_notificaciones === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 5)}
                />
            )
        },
        { 
            field: 'ver_rol', 
            headerName: 'Permiso roles', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_rol === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 7)}
                />
            )
        },
        { 
            field: 'ver_lab', 
            headerName: 'Permiso laboratorios', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_lab === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 8)}
                />
            )
        },
        { 
            field: 'ver_prov', 
            headerName: 'Permiso proveedores', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_prov === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 9)}
                />
            )
        },
        { 
            field: 'ver_historial_compras', 
            headerName: 'Permiso historial compras', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_historial_compras === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 10)}
                />
            )
        },
        { 
            field: 'ver_historial_ventas', 
            headerName: 'Permiso historial ventas', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_historial_ventas === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 11)}
                />
            )
        },
        { 
            field: 'ver_tipod', 
            headerName: 'Permiso tipo de documento', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_tipod === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 12)}
                />
            )
        },
        { 
            field: 'ver_permisos', 
            headerName: 'Permiso a permisos rol', 
            width: 220,
            renderCell: (params) => (
                <Checkbox 
                    checked={params.row.ver_permisos === 'Sí'} 
                    onChange={(e) => handleCheckboxChange(e, params.row, 13)}
                />
            )
        },
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

   

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {/* Dialogo para eliminar */}
            
            {/* Página de Usuarios */}
            <Page title="Chapina | Roles">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h4">Lista de permisos</Typography>
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
                                columns={columns}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
};

export default Permisos;
