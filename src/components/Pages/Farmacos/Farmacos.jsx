import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, 
Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu 
,MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf';
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import imagesList from '../../../assets'
import 'jspdf-autotable';




const Farmaco = () => {

    const { globalState } = useContext(MainContext);
    const [userRole, setUserRole] = useState();

    const initialState = {
        id: "", 
        nombre: "", 
        descripcion: "",
        precio_caja: "", 
        precio_blister: "", 
        precio_unidad: "", 
        precio_venta_caja: "", 
        precio_venta_blister: "", 
        precio_venta_unidad: "", 
        blisters_por_caja: "", 
        unidades_por_blister: "", 
        stock_caja: "", 
        stock_blister: "", 
        stock_unidad: "", 
        nivel_reorden: "", 
        codigo_barras: "", 
        proveedor_id: "", 
        laboratorio_id: "",
        proveedor: "", 
        laboratorio: "",  
        fecha_vencimiento: "", 
        fecha_creacion: "", 
        ultima_actualizacion: "",
        stock_total_calculado: ""
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [labs, setLaboratorios] = useState([]);
    const [provs, setProveedores] = useState([]);
    const [password, setPassword] = useState("");
    const [presentationType, setPresentationType] = useState('caja');


    const init = async () => {
        const { data } = await ApiRequest().get('/farmacos');
        setUsuariosList(data);
    };

    const columns = [
        { field: 'id', headerName: 'Codigo', width: 120 },
        { field: 'codigo_barras', headerName: 'Codigo de barras', width: 220 },
        { field: 'nombre', headerName: 'Nombre', width: 220 },
        { field: 'descripcion', headerName: 'Descripción', width: 220 },
        { field: 'precio_caja', headerName: 'Precio por caja', width: 220 },
        { field: 'precio_blister', headerName: 'Precio por blister', width: 220 },
        { field: 'precio_unidad', headerName: 'Precio por unidad', width: 220 },
        { field: 'precio_venta_caja', headerName: 'Precio venta caja', width: 220 },
        { field: 'precio_venta_blister', headerName: 'Precio venta blister', width: 220 },
        { field: 'precio_venta_unidad', headerName: 'Precio venta unidad', width: 220 },
        { field: 'blisters_por_caja', headerName: 'Blisters por caja', width: 220 },
        { field: 'unidades_por_blister', headerName: 'Unidades por blister', width: 220 },
        { field: 'stock_caja', headerName: 'Stock por caja', width: 220 },
        { field: 'stock_blister', headerName: 'Stock por blister', width: 220 },
        { field: 'stock_unidad', headerName: 'Stock por unidad', width: 220 },
        {
			field: 'fecha_vencimiento',
			headerName: 'Fecha de vencimiento',
			width: 220,
			valueFormatter: (params) => {
			  const fechaCompleta = params.value; // Suponemos que params.value contiene la fecha y la hora
			  const fecha = new Date(fechaCompleta);
			  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
			  return fecha.toLocaleDateString('es-ES', options); // Ajusta 'es-ES' al idioma deseado
			},
		  },
        { field: 'proveedor', headerName: 'Proveedor', width: 220 },
        { field: 'laboratorio', headerName: 'Laboratorio', width: 220 },
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
            const { data } = await ApiRequest().post('/guardar_farmaco', body);
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
            
            const { data } = await ApiRequest().post('/editar_farmaco', body);
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
    
    
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    
    const generatePDF = (reportType) => {
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
        let filteredData;
        let title;
        if (reportType === 'stockBajo') {
            filteredData = usuariosList.filter(farmaco => farmaco.stock_total_calculado <= farmaco.nivel_reorden);
            title = 'Reporte de Fármacos con Stock Bajo';
        } else if (reportType === 'prontosAVencer') {
            const today = new Date();
            filteredData = usuariosList.filter(farmaco => {
                const fechaVencimiento = new Date(farmaco.fecha_vencimiento);
                const diffDays = Math.ceil((fechaVencimiento - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 30; // Cambiar el número de días según sea necesario
            });
            title = 'Reporte de Fármacos Prontos a Vencer';
        }
    
        const tableData = filteredData.map(farmaco => [
            farmaco.id.toString(),
            farmaco.nombre,
            farmaco.descripcion,
            farmaco.precio_caja,
            farmaco.precio_blister,
            farmaco.precio_unidad,
            farmaco.stock_caja,
            farmaco.stock_blister,
            farmaco.stock_unidad,
            farmaco.fecha_vencimiento,
            farmaco.proveedor,
            farmaco.laboratorio
        ]);
    
        const headers = [
            'ID', 
            'Nombre', 
            'Descripción', 
            'Precio por Caja', 
            'Precio por Blister', 
            'Precio por Unidad', 
            'Stock por Caja', 
            'Stock por Blister', 
            'Stock por Unidad', 
            'Fecha de Vencimiento', 
            'Proveedor', 
            'Laboratorio'
        ];
    
        // Configurar y generar la tabla
        addImage();
        doc.setFontSize(12);
        doc.text(title, 10, 25);
    
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
    
        doc.save(reportType === 'stockBajo' ? 'reporte_stock_bajo.pdf' : 'reporte_prontos_a_vencer.pdf');
    };
    
    
    
    const handlePresentationChange = (event) => {
        setPresentationType(event.target.value);
    };
    

    const fetchLab = async () => {
        try {
        const response = await ApiRequest().get('/lab_select'); 
        setLaboratorios(response.data);
        } catch (error) {
        console.error('Error fetching laboratorios data:', error);
        }
    };

    const fetchProv = async () => {
        try {
        const response = await ApiRequest().get('/prov_select'); 
        setProveedores(response.data);
        } catch (error) {
        console.error('Error fetching proveedores data:', error);
        }
    };

    useEffect(() => {
        fetchLab(); // Fetch marca options when the component mounts.
        fetchProv();
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
        <DialogTitle>{isEdit ? 'Editar Farmaco' : 'Crear Farmaco'}</DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        margin='normal'
                        name='id'
                        value={body.id}
                        onChange={onChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        label='Codigo'
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin='normal'
                        name='codigo_barras'
                        value={body.codigo_barras}
                        onChange={onChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        label='Codigo de barras'
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        margin='normal'
                        name='nombre'
                        value={body.nombre}
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
                        name='descripcion'
                        value={body.descripcion}
                        onChange={onChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        label='Descripción'
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputLabel htmlFor="presentationType">Tipo de presentación</InputLabel>
                    <Select
                        name="presentationType"
                        value={presentationType}
                        onChange={handlePresentationChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                    >
                        <MenuItem value="caja">Caja</MenuItem>
                        <MenuItem value="blister">Blíster</MenuItem>
                        <MenuItem value="unidad">Unidad</MenuItem>
                    </Select>
                </Grid>

                {/* Mostrar campos según la selección */}
                {presentationType === 'caja' && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_caja'
                                value={body.precio_caja}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio compra caja'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_venta_caja'
                                value={body.precio_venta_caja}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio venta caja'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='stock_caja'
                                value={body.stock_caja}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Stock de cajas'
                            />
                        </Grid>
                    </>
                )}

                {presentationType === 'blister' && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_blister'
                                value={body.precio_blister}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio compra blister'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_venta_blister'
                                value={body.precio_venta_blister}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio venta blister'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='stock_blister'
                                value={body.stock_blister}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Stock blister'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='blister_por_caja'
                                value={body.blister_por_caja}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Blisters por caja'
                            />
                        </Grid>
                    </>
                )}

                {presentationType === 'unidad' && (
                    <>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_unidad'
                                value={body.precio_unidad}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio compra unidad'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio_venta_unidad'
                                value={body.precio_venta_unidad}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio venta unidad'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='stock_unidad'
                                value={body.stock_unidad}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Stock unidades'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='unidades_por_blister'
                                value={body.unidades_por_blister}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Unidades por blister'
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <InputLabel htmlFor="proveedor_id">Proveedor</InputLabel>
                    <Select
                        name="proveedor_id"
                        value={body.proveedor_id || ''}
                        onChange={onChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                    >
                        {provs.map((prov) => (
                            <MenuItem key={prov.id} value={prov.id}>
                                {prov.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel htmlFor="laboratorio_id">Laboratorio</InputLabel>
                    <Select
                        name="laboratorio_id"
                        value={body.laboratorio_id || ''}
                        onChange={onChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                    >
                        {labs.map((lab) => (
                            <MenuItem key={lab.id} value={lab.id}>
                                {lab.nombre}
                            </MenuItem>
                        ))}
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
        <Page title="Chapina | Farmacos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Lista de Farmacos</Typography>
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
                            <MenuItem onClick={() => { generatePDF('stockBajo'); handleMenuClose(); }}>
                                Fármacos con Stock Bajo
                            </MenuItem>
                            <MenuItem onClick={() => { generatePDF('prontosAVencer'); handleMenuClose(); }}>
                                Fármacos Prontos a Vencer
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

export default Farmaco;
