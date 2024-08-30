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
        { field: 'username', headerName: 'Nombre de usuario', width: 220 },
        { field: 'user', headerName: 'Nombre', width: 220 },
        { field: 'password', headerName: 'Password', width: 220 },
        { field: 'correo', headerName: 'Correo', width: 220 },
        { field: 'carnet', headerName: 'Carnet', width: 220 },
        { field: 'rol', headerName: 'Rol', width: 220 },
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

    /*const generatePDF = (isActive) => {
        const doc = new jsPDF('landscape', 'mm', 'a4');
        
        // URL de la imagen que deseas añadir en la esquina superior derecha
        const imageUrl = '{imagesList.Logo}'; // Reemplaza con la URL de tu imagen
    
        // Añadir la imagen en la esquina superior derecha
        const imgWidth = 40; // Ancho de la imagen en mm
        const imgHeight = 30; // Alto de la imagen en mm
        doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - 10, 10, imgWidth, imgHeight);
        
        const filteredUsers = usuariosList.filter(user => {
            return isActive ? user.estado === 'Activo' : user.estado === 'Inactivo';
        });
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 10;
        const startY = 30; // Ajustar para no sobreponer con la imagen
        const rowHeight = 10;
        const colWidths = [20, 40, 60, 40, 40, 30, 30, 60];
        
        let yOffset = startY;
        doc.setFontSize(12);
        doc.text(isActive ? 'Reporte de Usuarios Activos' : 'Reporte de Usuarios Inactivos', margin, yOffset);
        yOffset += 15;
        
        doc.setFontSize(12);
        const headers = ['ID', 'Nombre de usuario', 'Nombre', 'Carnet', 'Rol', 'DPI', 'Teléfono', 'Estado'];
        const headerXCoords = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2], margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5], margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + colWidths[6]];
    
        // Dibujar encabezados y bordes
        headers.forEach((header, index) => {
            doc.text(header, headerXCoords[index], yOffset);
            if (index < headers.length - 1) {
                doc.line(headerXCoords[index] + 1, yOffset + 2, headerXCoords[index + 1] - 1, yOffset + 2); // Línea horizontal de separación
            }
        });
        yOffset += rowHeight;
    
        filteredUsers.forEach((user, index) => {
            if (index > 0 && yOffset > doc.internal.pageSize.getHeight() - margin - rowHeight) {
                doc.addPage();
                yOffset = startY;
                doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - 10, 10, imgWidth, imgHeight);
                doc.text(isActive ? 'Reporte de Usuarios Activos' : 'Reporte de Usuarios Inactivos', margin, yOffset);
                yOffset += 15;
                
                headers.forEach((header, idx) => {
                    doc.text(header, headerXCoords[idx], yOffset);
                    if (idx < headers.length - 1) {
                        doc.line(headerXCoords[idx] + 1, yOffset + 2, headerXCoords[idx + 1] - 1, yOffset + 2); // Línea horizontal de separación
                    }
                });
                yOffset += rowHeight;
            }
            
            doc.text(user.id.toString(), headerXCoords[0], yOffset);
            doc.text(user.username, headerXCoords[1], yOffset);
            doc.text(user.user, headerXCoords[2], yOffset);
            doc.text(user.carnet, headerXCoords[3], yOffset);
            doc.text(user.rol, headerXCoords[4], yOffset);
            doc.text(user.dpi, headerXCoords[5], yOffset);
            doc.text(user.telefono, headerXCoords[6], yOffset);
            doc.text(user.estado, headerXCoords[7], yOffset);
            
            // Dibujar bordes de las celdas
            doc.rect(headerXCoords[0] - 1, yOffset - rowHeight + 1, colWidths.reduce((a, b) => a + b, 0) + 1, rowHeight + 1); // Borde de la fila
    
            yOffset += rowHeight;
        });
        
        // Borde de la tabla
        doc.rect(margin - 1, startY - rowHeight, colWidths.reduce((a, b) => a + b, 0) + 1 + 2 * margin, yOffset - startY + 2); // Borde externo
        
        doc.save(isActive ? 'reporte_usuarios_activos.pdf' : 'reporte_usuarios_inactivos.pdf');
    };*/
    
    /*const generatePDF = (isActive) => {
        const doc = new jsPDF('landscape', 'mm', 'a4');
        const imageUrl = imagesList.Logo; // Usar la imagen importada
    
        // Configuración
        const imgWidth = 40;
        const imgHeight = 30;
        const margin = 10;
        const startY = 30;
        const rowHeight = 10;
        const colWidths = [20, 40, 60, 40, 40, 30, 30, 60];
        const headers = ['ID', 'Nombre de usuario', 'Nombre', 'Carnet', 'Rol', 'DPI', 'Teléfono', 'Estado'];
    
        // Añadir imagen
        const addImage = () => {
            doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - margin, margin, imgWidth, imgHeight);
        };
    
        // Añadir encabezado
        const addHeader = (yOffset) => {
            doc.setFontSize(12);
            doc.text(isActive ? 'Reporte de Usuarios Activos' : 'Reporte de Usuarios Inactivos', margin, yOffset);
            yOffset += 15;
    
            const headerXCoords = headers.reduce((acc, _, idx) => {
                const prevWidth = idx === 0 ? 0 : colWidths.slice(0, idx).reduce((a, b) => a + b, 0);
                acc.push(margin + prevWidth);
                return acc;
            }, []);
    
            headers.forEach((header, index) => {
                doc.text(header, headerXCoords[index], yOffset);
                if (index < headers.length - 1) {
                    doc.line(headerXCoords[index] + 1, yOffset + 2, headerXCoords[index + 1] - 1, yOffset + 2);
                }
            });
            return yOffset + rowHeight;
        };
    
        // Añadir fila de datos
        const addRow = (user, yOffset, headerXCoords) => {
            doc.text(user.id.toString(), headerXCoords[0], yOffset);
            doc.text(user.username, headerXCoords[1], yOffset);
            doc.text(user.user, headerXCoords[2], yOffset);
            doc.text(user.carnet, headerXCoords[3], yOffset);
            doc.text(user.rol, headerXCoords[4], yOffset);
            doc.text(user.dpi, headerXCoords[5], yOffset);
            doc.text(user.telefono, headerXCoords[6], yOffset);
            doc.text(user.estado, headerXCoords[7], yOffset);
    
            doc.rect(headerXCoords[0] - 1, yOffset - rowHeight + 1, colWidths.reduce((a, b) => a + b, 0) + 1, rowHeight + 1);
        };
    
        // Preparar datos
        const filteredUsers = usuariosList.filter(user => isActive ? user.estado === 'Activo' : user.estado === 'Inactivo');
        let yOffset = startY;
    
        // Generar PDF
        addImage();
        yOffset = addHeader(yOffset);
    
        filteredUsers.forEach((user) => {
            if (yOffset > doc.internal.pageSize.getHeight() - margin - rowHeight) {
                doc.addPage();
                addImage();
                yOffset = addHeader(startY);
            }
            
            const headerXCoords = headers.reduce((acc, _, idx) => {
                const prevWidth = idx === 0 ? 0 : colWidths.slice(0, idx).reduce((a, b) => a + b, 0);
                acc.push(margin + prevWidth);
                return acc;
            }, []);
            
            addRow(user, yOffset, headerXCoords);
            yOffset += rowHeight;
        });
    
        doc.save(isActive ? 'reporte_usuarios_activos.pdf' : 'reporte_usuarios_inactivos.pdf');
    };*/
    
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
            user.rol,
            user.dpi,
            user.telefono,
            user.estado
        ]);
    
        const headers = ['ID', 'Nombre de usuario', 'Nombre', 'Carnet', 'Rol', 'DPI', 'Teléfono', 'Estado'];
    
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
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>
                    ¿Desea eliminar este usuario?
                </DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción es irreversible</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>
                    {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='username'
                                value={body.username}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre de usuario'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='user'
                                value={body.user}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre'
                            />
                        </Grid>
                        
                    <Grid item xs={12} sm={12}>
                        <TextField
                            margin='normal'
                            name='password'
                            onChange={({ target }) => setPassword(target.value)}
                            variant='outlined'
                            size='small'
                            color='primary'
                            fullWidth
                            label='Contraseña'
                            
                        />
                    </Grid>
                
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='correo'
                                value={body.correo}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Correo'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='carnet'
                                value={body.carnet}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Carnet'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <InputLabel htmlFor="rol">Rol del usuario</InputLabel>
                    <Select
                        name="rol"
                        value={body.rol || ''} // Asegúrate de que body.rol tenga un valor o esté vacío
                        onChange={onChange}
                        variant="outlined"
                        size="small"
                        color="primary"
                        fullWidth
                    >
                        {roles.map((rol) => (
                            <MenuItem key={rol.id} value={rol.id}>
                                {rol.descripcion} {/* Ajusta esto según tu respuesta de API */}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='dpi'
                                value={body.dpi}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='DPI'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='telefono'
                                value={body.telefono}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Teléfono'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='direccion'
                                value={body.direccion}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Dirección'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
						<InputLabel htmlFor="estado">Estado del usuario</InputLabel>
  						<Select
    						name='estado'
							value={body.estado}
							onChange={onChange}
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							placeholderlabel='Estado'
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
            
            <Page title="Chapina| Usuarios">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Lista de usuarios</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            {userRole === 'ADMIN' && (
                                <>
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
                                    style={{ marginLeft: '10px' }}
                                >
                                    Descargar Reporte
                                </Button>
                                                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => {
                                        generatePDF(true); // Llama a la función para usuarios activos
                                        handleMenuClose();
                                    }}>
                                        Usuarios Activos
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        generatePDF(false); // Llama a la función para usuarios inactivos
                                        handleMenuClose();
                                    }}>
                                        Usuarios Inactivos
                                    </MenuItem>
                                </Menu>

                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={8} />
                        <Grid item xs={12} sm={12}>
                            <CommonTable
                                data={usuariosList}
                                columns={columns.map(column => {
                                    if (column.field === '') {
                                        return {
                                            ...column,
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
