import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, 
Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, Menu 
,MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, DownloadOutlined, Close} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf';
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import imagesList from '../../../assets'
import 'jspdf-autotable';
import * as XLSX from 'xlsx';




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
        stock_total_calculado: "",
        presentationType: ""
    };

    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [labs, setLaboratorios] = useState([]);
    const [provs, setProveedores] = useState([]);
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
        { field: 'nivel_reorden', headerName: 'Nivel de reorden', width: 220 },
        { field: 'proveedor', headerName: 'Proveedor', width: 220 },
        { field: 'laboratorio', headerName: 'Laboratorio', width: 220 },
        { field: 'stock_total_calculado', headerName: 'Stock actual', width: 220 },
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
			const { data } = await ApiRequest().post('/eliminar_farmaco', { id: idDelete })
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
            farmaco.precio_caja === 0 ? '-' : farmaco.precio_caja || '-', // Reemplaza 0 o vacío por '-'
            farmaco.precio_blister === 0 ? '-' : farmaco.precio_blister || '-', // Reemplaza 0 o vacío por '-'
            farmaco.precio_unidad === 0 ? '-' : farmaco.precio_unidad || '-', // Reemplaza 0 o vacío por '-'
            farmaco.stock_caja === 0 ? '-' : farmaco.stock_caja || '-', // Reemplaza 0 o vacío por '-'
            farmaco.stock_blister === 0 ? '-' : farmaco.stock_blister || '-', // Reemplaza 0 o vacío por '-'
            farmaco.stock_unidad === 0 ? '-' : farmaco.stock_unidad || '-', // Reemplaza 0 o vacío por '-'
            farmaco.fecha_vencimiento || '-', // Reemplaza vacío por '-'
            farmaco.proveedor || '-', // Reemplaza vacío por '-'
            farmaco.laboratorio || '-' // Reemplaza vacío por '-'
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
    

    const generateExcel = (reportType) => {
        let filteredData;
        let title;
    
        // Generar datos según el tipo de reporte
        if (reportType === 'stockBajo') {
            filteredData = usuariosList.filter(farmaco => farmaco.stock_total_calculado <= farmaco.nivel_reorden);
            title = 'Reporte de Fármacos con Stock Bajo';
        } else if (reportType === 'prontosAVencer') {
            const today = new Date();
            filteredData = usuariosList.filter(farmaco => {
                const fechaVencimiento = new Date(farmaco.fecha_vencimiento);
                const diffDays = Math.ceil((fechaVencimiento - today) / (1000 * 60 * 60 * 24));
                return diffDays <= 30;
            });
            title = 'Reporte de Fármacos Prontos a Vencer';
        } else if (reportType === 'todos') {
            filteredData = usuariosList; // Obtener todos los fármacos
            title = 'Reporte de Todos los Fármacos';
        }
    
        // Preparar los datos para la hoja de cálculo
        const tableData = filteredData.map(farmaco => ({
            'ID': farmaco.id.toString(),
            'Nombre': farmaco.nombre,
            'Descripción': farmaco.descripcion,
            'Precio por Caja': farmaco.precio_caja === 0 ? '-' : farmaco.precio_caja,
            'Precio por Blister': farmaco.precio_blister === 0 ? '-' : farmaco.precio_blister,
            'Precio por Unidad': farmaco.precio_unidad === 0 ? '-' : farmaco.precio_unidad,
            'Stock por Caja': farmaco.stock_caja === 0 ? '-' : farmaco.stock_caja,
            'Stock por Blister': farmaco.stock_blister === 0 ? '-' : farmaco.stock_blister,
            'Stock por Unidad': farmaco.stock_unidad === 0 ? '-' : farmaco.stock_unidad,
            'Fecha de Vencimiento': farmaco.fecha_vencimiento,
            'Proveedor': farmaco.proveedor,
            'Laboratorio': farmaco.laboratorio
        }));
    
        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(tableData);
    
        // Aplicar estilos a las cabeceras
        const headerCellStyle = {
            font: {
                bold: true,
                color: { rgb: "FFFFFF" } // Color de texto blanco
            },
            fill: {
                fgColor: { rgb: "228B22" } // Color de fondo verde
            }
        };
    
        // Agregar estilo a las cabeceras
        Object.keys(worksheet).forEach((cell) => {
            if (cell.startsWith('!')) return; // Ignorar propiedades especiales
            if (cell[1] === '1') { // La fila 1 contiene las cabeceras
                worksheet[cell].s = headerCellStyle;
            }
        });
    
        // Ajustar el ancho de las columnas
        const cols = [
            { wpx: 30 }, // Ancho para ID
            { wpx: 200 }, // Ancho para Nombre
            { wpx: 250 }, // Ancho para Descripción
            { wpx: 100 }, // Ancho para Precio por Caja
            { wpx: 100 }, // Ancho para Precio por Blister
            { wpx: 100 }, // Ancho para Precio por Unidad
            { wpx: 100 }, // Ancho para Stock por Caja
            { wpx: 100 }, // Ancho para Stock por Blister
            { wpx: 100 }, // Ancho para Stock por Unidad
            { wpx: 100 }, // Ancho para Fecha de Vencimiento
            { wpx: 100 }, // Ancho para Proveedor
            { wpx: 100 }  // Ancho para Laboratorio
        ];
    
        worksheet['!cols'] = cols; // Aplicar el ancho a la hoja
    
        // Añadir la hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, title);
    
        // Generar el archivo Excel
        const excelFileName = reportType === 'stockBajo' ? 'reporte_stock_bajo.xlsx' :
                              reportType === 'prontosAVencer' ? 'reporte_prontos_a_vencer.xlsx' :
                              'reporte_todos_los_farmacos.xlsx'; // Nombre para todos los fármacos
        XLSX.writeFile(workbook, excelFileName);
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

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
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
        <DialogTitle>{isEdit ? 'Editar Farmaco' : 'Crear Farmaco'}
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
                         <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Precio Caja"
                        name="precio_caja"
                        value={body.precio_caja}
                        onChange={onChange}
                        type="number"
                         size='small'
                      />
                    </Grid>

                    <Grid item xs={12} >
                    <TextField
                      label="Precio Venta Caja"
                      name="precio_venta_caja"
                      value={body.precio_venta_caja}
                      onChange={onChange}
                      fullWidth
                      variant="outlined"
                      type="number"
                      size='small'
                    />
                  </Grid>

                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Stock Caja"
                        name="stock_caja"
                        value={body.stock_caja}
                        onChange={onChange}
                        type="number"
                        size='small'
                        variant="outlined"
                      />
                    </Grid>
            

                  
                  <Grid item xs={12} >
                  <TextField
                    label="Blisters por Caja"
                    name="blisters_por_caja"
                    value={body.blisters_por_caja}
                    onChange={onChange}
                    fullWidth
                    variant="outlined"
                    size='small'
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} >
                  <TextField
                    label="Unidades por Blister"
                    name="unidades_por_blister"
                    value={body.unidades_por_blister}
                    onChange={onChange}
                    fullWidth
                    size='small'
                    variant="outlined"
                    type="number"
                  />
                </Grid>

               

                    </>
                )}

                {presentationType === 'blister' && (
                    <>
                       <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Precio Blister"
                        name="precio_blister"
                        value={body.precio_blister}
                        onChange={onChange}
                        type="number"
                        size='small'
                        
                      />
                    </Grid>

                    <Grid item xs={12} >
                    <TextField
                      label="Precio Venta Blister"
                      name="precio_venta_blister"
                      value={body.precio_venta_blister}
                      onChange={onChange}
                      fullWidth
                      variant="outlined"
                      type="number"
                      size='small'
                    />
                  </Grid>

                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Stock Blister"
                        name="stock_blister"
                        value={body.stock_blister}
                        onChange={onChange}
                        type="number"
                        size='small'
                      />
                    </Grid>

                    <Grid item xs={12} >
                    <TextField
                      label="Unidades por Blister"
                      name="unidades_por_blister"
                      value={body.unidades_por_blister}
                      onChange={onChange}
                      fullWidth
                      variant="outlined"
                      type="number"
                      size='small'
                    />
                  </Grid>
                    </>
                )}

                {presentationType === 'unidad' && (
                    <>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Precio Unidad"
                        name="precio_unidad"
                        value={body.precio_unidad}
                        onChange={onChange}
                        type="number"
                        size='small'
                      />
                    </Grid>

                    <Grid item xs={12} >
                    <TextField
                      label="Precio Venta Unidad"
                      name="precio_venta_unidad"
                      value={body.precio_venta_unidad}
                      onChange={onChange}
                      fullWidth
                      variant="outlined"
                      type="number"
                      size='small'
                    />
                  </Grid>

                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        label="Stock Unidad"
                        name="stock_unidad"
                        value={body.stock_unidad}
                        onChange={onChange}
                        type="number"
                        size='small'
                      />
                    </Grid>
                    </>
                )}

                <Grid item xs={12} >
                  <TextField
                    label="Fecha de Vencimiento"
                    name="fecha_vencimiento"
                    value={formatDate(body.fecha_vencimiento)}
                    onChange={onChange}
                    fullWidth
                    size='small'
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                 <Grid item xs={12}>
                    <TextField
                        margin='normal'
                        name='nivel_reorden'
                        value={body.nivel_reorden}
                        onChange={onChange}
                        variant='outlined'
                        size='small'
                        fullWidth
                        label='Nivel de reorden'
                    />
                </Grid>
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
                                Agregar Catalogo
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
                                Fármacos con Stock Bajo (PDF)
                            </MenuItem>
                            <MenuItem onClick={() => { generatePDF('prontosAVencer'); handleMenuClose(); }}>
                                Fármacos Prontos a Vencer (PDF)
                            </MenuItem>
                            <MenuItem onClick={() => { generateExcel('stockBajo'); handleMenuClose(); }}>
                                Fármacos con Stock Bajo (Excel)
                            </MenuItem>
                            <MenuItem onClick={() => { generateExcel('prontosAVencer'); handleMenuClose(); }}>
                                Fármacos Prontos a Vencer (Excel)
                            </MenuItem>
                            <MenuItem onClick={() => { generateExcel('todos'); handleMenuClose(); }}>
                                Todos los Fármacos (Excel)
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
