import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu ,MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf';
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import imagesList from '../../../assets'
import 'jspdf-autotable';




const Usuarios = () => {

    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        username: "",
        user: "",
        password: "",
        correo: "",
        carnet: "",
        rol: "",
        descripcion: "",
        dpi: "",
        telefono: "",
        direccion: "",
        estado: "",
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [password, setPassword] = useState("");


    const init = async () => {
        const { data } = await ApiRequest().get('/usuarios');
        setUsuariosList(data);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'username', headerName: 'Usuario', width: 220 },
        { field: 'user', headerName: 'Nombre', width: 220 },
        { field: 'password', headerName: 'Password', width: 220 },
        { field: 'correo', headerName: 'Correo', width: 220 },
        { field: 'carnet', headerName: 'Carnet', width: 220 },
        { field: 'descripcion', headerName: 'Descripcion', width: 220 },
        { field: 'dpi', headerName: 'DPI', width: 220 },
        { field: 'telefono', headerName: 'Teléfono', width: 220 },
        { field: 'direccion', headerName: 'Dirección', width: 220 },
        { field: 'estado', headerName: 'Estado', width: 220 },
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
            // Obtener el usuario antes de eliminarlo
            const userToDelete = usuariosList.find(user => user.id === idDelete);
            setDeletedUsers(prev => [...prev, userToDelete]);

            const { data } = await ApiRequest().post('/eliminar', { id: idDelete });
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
            [name]: name === 'rol' ? Number(value) : value // Convertir a número si es el rol
        });
    };
    
    

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar', body);
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

    /*const onEdit = async () => {
        try {
            
            const { data } = await ApiRequest().post('/editar', body);
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
    };*/

    const onEdit = async () => {
        try {
            const dataToSend = { ...body };
            if (password) {
                dataToSend.password = password;
            } else {
                delete dataToSend.password; // Eliminar la contraseña si está vacía
            }
            const { data } = await ApiRequest().post('/editar', dataToSend);
            handleDialog();
            setBody(initialState);
            setPassword(""); // Limpiar la contraseña después de enviar
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
    
    
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    
    const generatePDF = (isActive) => {
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const imageUrl = imagesList.Logo; // Usar la imagen importada
    
        // Añadir imagen
        const addImage = () => {
            const imgWidth = 40;
            const imgHeight = 30;
            const margin = 10;
            doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - margin, margin, imgWidth, imgHeight);
        };
    
        // Preparar datos
        const filteredUsers = usuariosList.filter(user => isActive ? user.estado === 'Activo' : user.estado === 'Inactivo');
        const tableData = filteredUsers.map(user => [
            user.id.toString(),
            user.username,
            user.user,
            user.carnet,
            user.descripcion,
            user.dpi,
            user.telefono,
            user.estado
        ]);
    
        const headers = ['ID', 'Usuario', 'Nombre', 'Carnet', 'Rol', 'DPI', 'Teléfono', 'Estado'];
    
        // Configurar y generar la tabla
        addImage();
        doc.setFontSize(12);
        doc.text(isActive ? 'Reporte de Usuarios Activos' : 'Reporte de Usuarios Inactivos', 10, 25);
        
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30, // Margen para la imagen y el título
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [22, 160, 133], // Cambiar color de encabezado si se desea
            },
            didDrawPage: (data) => {
                addImage(); // Añadir imagen en cada nueva página
            },
        });
    
        doc.save(isActive ? 'reporte_usuarios_activos.pdf' : 'reporte_usuarios_inactivos.pdf');
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
            <DialogTitle>¿Desea eliminar este usuario?</DialogTitle>
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
            <DialogTitle>{isEdit ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='username'
                            value={body.username}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Nombre de usuario'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='user'
                            value={body.user}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Nombre'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='password'
                            onChange={({ target }) => setPassword(target.value)}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Contraseña'
                            type='password'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='correo'
                            value={body.correo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Correo'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='carnet'
                            value={body.carnet}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Carnet'
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="rol">Rol del usuario</InputLabel>
                        <Select
                            name="rol"
                            value={body.rol || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roles.map((rol) => (
                                <MenuItem key={rol.id} value={rol.id}>
                                    {rol.descripcion}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='dpi'
                            value={body.dpi}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='DPI'
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
                            label='Teléfono'
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
                        <InputLabel htmlFor="estado">Estado del usuario</InputLabel>
                        <Select
                            name='estado'
                            value={body.estado}
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
                <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>Guardar</Button>
            </DialogActions>
        </Dialog>

        {/* Página de Usuarios */}
        <Page title="Chapina | Usuarios">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Lista de usuarios</Typography>
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
                            <Button
                                onClick={handleMenuClick}
                                startIcon={<DownloadOutlined />}
                                variant='contained'
                                color='secondary'
                                sx={{ ml: 2 }}
                            >
                                Descargar Reporte
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => { generatePDF(true); handleMenuClose(); }}>
                                    Usuarios Activos
                                </MenuItem>
                                <MenuItem onClick={() => { generatePDF(false); handleMenuClose(); }}>
                                    Usuarios Inactivos
                                </MenuItem>
                            </Menu>
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

export default Usuarios;
