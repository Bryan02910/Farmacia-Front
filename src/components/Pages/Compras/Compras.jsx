import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Container, Typography, Grid, Box, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, DeleteOutline, SearchOutlined} from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import { MainContext } from '../../../Context/MainContext';
import { GridFeatureModeConstant } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import imagesList from '../../../assets'

const Compras = () => {
  const { globalState } = useContext(MainContext);
  const [userRole, setUserRole] = useState();
  const [farmacos, setFarmacos] = useState([{
    id: "",
    nombre: "",
    presentacion: "caja", // Estado para la presentación seleccionada
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
    fecha_vencimiento: "",
  }]);

  const [proveedorId, setProveedorId] = useState(''); // Estado para ID del proveedor
  const [documentoId, setDocumentoId] = useState(''); 
  const [Nofactura, setNofactura] = useState(''); 
  const [proveedores, setProveedores] = useState([]); // Estado para lista de proveedores
  const [documento, setDocumento] = useState([]); // Estado para lista de proveedores
  const [laboratorios, setLaboratorios] = useState([]); // Estado para lista de laboratorios
  const [totalCompra, setTotalCompra] = useState(0); // Estado para total
  const [currentDate, setCurrentDate] = useState(''); // Fecha actual 
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
  const [currentFarmacoIndex, setCurrentFarmacoIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = (index) => {
    setIsModalOpen(true);
    setCurrentFarmacoIndex(index); // Guardar el índice del fármaco actual
    fetchFarmacos(); // Cargar los fármacos al abrir el modal
  };
  
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFarmacoIndex(null); // Restablecer el índice actual
  };
  
  // Función para cargar los fármacos desde la API
  const fetchFarmacos = async () => {
    try {
      const { data } = await ApiRequest().get('/farmacos');
      setSearchResults(data); // Cargar los resultados en el modal
    } catch (error) {
      console.error('Error al obtener los fármacos:', error);
    }
  };
  
  // Función para seleccionar un fármaco y actualizar el estado
  const handleSelectFarmaco = (farmaco) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[currentFarmacoIndex] = {  // Usar el índice actual
      id: farmaco.id,
      nombre: farmaco.nombre,
      presentacion: farmaco.presentacion || "caja", // Presentación seleccionada por defecto
      descripcion: farmaco.descripcion,
      precio_caja: farmaco.precio_caja,
      precio_blister: farmaco.precio_blister,
      precio_unidad: farmaco.precio_unidad,
      precio_venta_caja: farmaco.precio_venta_caja,
      precio_venta_blister: farmaco.precio_venta_blister,
      precio_venta_unidad: farmaco.precio_venta_unidad,
      blisters_por_caja: farmaco.blisters_por_caja,
      unidades_por_blister: farmaco.unidades_por_blister,
      stock_caja: farmaco.stock_caja,
      stock_blister: farmaco.stock_blister,
      stock_unidad: farmaco.stock_unidad,
      nivel_reorden: farmaco.nivel_reorden,
      codigo_barras: farmaco.codigo_barras,
      proveedor_id: farmaco.proveedor_id,
      laboratorio_id: farmaco.laboratorio_id,
      fecha_vencimiento: farmaco.fecha_vencimiento,
    };
    setFarmacos(updatedFarmacos);
    handleCloseModal(); // Cerrar el modal
  };
  

  // Cargar la lista de proveedores y laboratorios al montar el componente
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const { data } = await ApiRequest().get('/prov_select');
        setProveedores(data);
      } catch (error) {
        setMensaje({
          ident: new Date().getTime(),
          message: 'Error al cargar los proveedores',
          type: 'error'
        });
      }
    };

    const fetchLaboratorios = async () => {
      try {
        const { data } = await ApiRequest().get('/lab_select');
        setLaboratorios(data);
      } catch (error) {
        setMensaje({
          ident: new Date().getTime(),
          message: 'Error al cargar los laboratorios',
          type: 'error'
        });
      }
    };

    const fetchDocumento = async () => {
      try {
        const { data } = await ApiRequest().get('/tipo_documento');
        setDocumento(data);
      } catch (error) {
        setMensaje({
          ident: new Date().getTime(),
          message: 'Error al cargar los documentos',
          type: 'error'
        });
      }
    };

    fetchProveedores();
    fetchLaboratorios();
    fetchDocumento();
  }, []);

  const addFarmaco = () => {
    setFarmacos([...farmacos, {
      id: "",
      presentacion: "",
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
      fecha_vencimiento: "",
    }]);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + month + '-' + day;
};

  const removeFarmaco = (index) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos.splice(index, 1);
    setFarmacos(updatedFarmacos);
    calculateTotalCompra(updatedFarmacos); // Recalcular total
  };

  const fetchFarmacoById = async (id) => {
    try {
      const { data } = await ApiRequest().get(`/farmaco/${id}`);
      return data;
    } catch (error) {
      console.error('Error al obtener el fármaco por ID:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const imageUrl = imagesList.Logo; // Usar la imagen importada
    const currentDateFormatted = formatDate(new Date());

    // Añadir imagen
    const addImage = () => {
        const imgWidth = 40;
        const imgHeight = 30;
        const margin = 10;
        doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - margin, margin, imgWidth, imgHeight);
    };

    // Preparar los datos
    const columns = [
        { header: 'Codigo', dataKey: 'id' },
        { header: 'Nombre', dataKey: 'nombre' },
        { header: 'Descripción', dataKey: 'descripcion' },
        { header: 'Precio Caja', dataKey: 'precio_caja' },
        { header: 'Stock Caja', dataKey: 'stock_caja' },
        { header: 'Precio Blister', dataKey: 'precio_blister' },
        { header: 'Stock Blister', dataKey: 'stock_blister' },
        { header: 'Precio Unidad', dataKey: 'precio_unidad' },
        { header: 'Stock Unidad', dataKey: 'stock_unidad' },
        { header: 'Total', dataKey: 'total' },
    ];

    const data = farmacos.map(farmaco => ({
        id: farmaco.id.toString(),
        nombre: farmaco.nombre,
        descripcion: farmaco.descripcion,
        precio_caja: farmaco.precio_caja > 0 ? farmaco.precio_caja : '-',
        stock_caja: farmaco.stock_caja > 0 ? farmaco.stock_caja : '-',
        precio_blister: farmaco.precio_blister > 0 ? farmaco.precio_blister : '-',
        stock_blister: farmaco.stock_blister > 0 ? farmaco.stock_blister : '-',
        precio_unidad: farmaco.precio_unidad > 0 ? farmaco.precio_unidad : '-',
        stock_unidad: farmaco.stock_unidad > 0 ? farmaco.stock_unidad : '-',
        total: (
            (parseFloat(farmaco.precio_caja || 0) * parseFloat(farmaco.stock_caja || 0)) +
            (parseFloat(farmaco.precio_blister || 0) * parseFloat(farmaco.stock_blister || 0)) +
            (parseFloat(farmaco.precio_unidad || 0) * parseFloat(farmaco.stock_unidad || 0))
        ).toFixed(2) // Asegurarse de que el total tenga dos decimales
    }));

    // Configurar y generar el PDF
    addImage();
    doc.setFontSize(12);
    doc.text('Reporte de Compra', 10, 25);
    doc.text(`Fecha de Compra: ${currentDateFormatted}`, 10, 30);
    doc.text(`No. de factura: ${Nofactura}`, 10, 35);

    doc.autoTable({
        columns: columns,
        body: data,
        startY: 35, // Ajustar según el espacio para la imagen y el título
        margin: { horizontal: 10 },
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [22, 160, 133], // Color de encabezado
        },
        didDrawPage: (data) => {
            addImage(); // Añadir imagen en cada nueva página
        },
    });

    // Agregar el total de la compra al final
    doc.text(`Total Compra: ${totalCompra}`, 10, doc.lastAutoTable.finalY + 10);

    // Descargar el archivo PDF
    doc.save('reporte_compra.pdf');
};


const onChangeFarmaco = async (index, { target }) => {
  const { name, value } = target;
  const updatedFarmacos = [...farmacos];

  // Actualizar el campo inmediatamente al escribir
  updatedFarmacos[index][name] = value;
  setFarmacos(updatedFarmacos); // Esto actualizará el campo 'busqueda' mientras escribes.

  // Si se cambia el campo ID o nombre, hacer la solicitud para obtener los datos del fármaco
  if ((name === "id" || name === "busqueda") && value) {
      try {
          // Realizar solicitud para obtener los datos del fármaco por ID o nombre
          const { data } = await ApiRequest().get(`/farmaco/${value}`);

          // Verificar si se encontraron datos para el ID o nombre proporcionado
          if (data) {
              // Actualizar los datos del fármaco en base a la respuesta
              updatedFarmacos[index] = {
                  ...updatedFarmacos[index],
                  ...data, // Asignar todos los datos del fármaco
              };
          } else {
              // ID o nombre no encontrado, limpiar los campos del fármaco
              updatedFarmacos[index] = {
                  ...updatedFarmacos[index],
                  id: value,
                  nombre: '',
                  descripcion: '',
                  precio_caja: '',
                  precio_blister: '',
                  precio_unidad: '',
                  precio_venta_caja: '',
                  precio_venta_blister: '',
                  precio_venta_unidad: '',
                  blisters_por_caja: '',
                  unidades_por_blister: '',
                  stock_caja: '',
                  stock_blister: '',
                  stock_unidad: '',
                  nivel_reorden: '',
                  codigo_barras: '',
                  proveedor_id: '',
                  laboratorio_id: '',
                  fecha_vencimiento: '',
                  presentacion: 'caja', // Ajustar según sea necesario
              };
          }

          // Actualizar estado con los datos obtenidos o limpiados
          setFarmacos(updatedFarmacos);
      } catch (error) {
          // Manejo del error, por ejemplo, mostrar un mensaje de error
          setMensaje({
              ident: new Date().getTime(),
              message: 'Error al obtener los datos del fármaco',
              type: 'error',
          });

          // Limpiar los campos del fármaco si el ID o nombre no es válido
          if (error.response?.status === 404) {
              updatedFarmacos[index] = {
                  ...updatedFarmacos[index],
                  id: name === "id" ? value : '', // Si el campo cambiado es ID, conservar el ID
                  nombre: name === "nombre" ? value : '', // Si el campo cambiado es nombre, conservar el nombre
                  descripcion: '',
                  precio_caja: '',
                  precio_blister: '',
                  precio_unidad: '',
                  precio_venta_caja: '',
                  precio_venta_blister: '',
                  precio_venta_unidad: '',
                  blisters_por_caja: '',
                  unidades_por_blister: '',
                  stock_caja: '',
                  stock_blister: '',
                  stock_unidad: '',
                  nivel_reorden: '',
                  codigo_barras: '',
                  proveedor_id: '',
                  laboratorio_id: '',
                  fecha_vencimiento: '',
                  presentacion: 'caja', // Ajustar según sea necesario
              };
              setFarmacos(updatedFarmacos);
          }
      }
  }

  // Recalcular total de la compra
  calculateTotalCompra(updatedFarmacos);
};



  const onChangePresentacion = (index, value) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[index].presentacion = value;
    setFarmacos(updatedFarmacos);
  };

  const calculateTotalCompra = (updatedFarmacos) => {
    const total = updatedFarmacos.reduce((acc, farmaco) => {
      const stockCaja = parseFloat(farmaco.stock_caja) || 0;
      const stockBlister = parseFloat(farmaco.stock_blister) || 0;
      const stockUnidad = parseFloat(farmaco.stock_unidad) || 0;

      const precioCaja = parseFloat(farmaco.precio_caja) || 0;
      const precioBlister = parseFloat(farmaco.precio_blister) || 0;
      const precioUnidad = parseFloat(farmaco.precio_unidad) || 0;

      const totalCaja = stockCaja * precioCaja;
      const totalBlister = stockBlister * precioBlister;
      const totalUnidad = stockUnidad * precioUnidad;

      return acc + totalCaja + totalBlister + totalUnidad;
    }, 0);

    setTotalCompra(total);
  };

  const calcularStockBlister = (updatedFarmacos) => {
    const updatedFarmacosWithBlister = updatedFarmacos.map((farmaco) => {
      const stockCaja = parseFloat(farmaco.stock_caja) || 0;
      const blisterPorCaja = parseFloat(farmaco.blisters_por_caja) || 0;
      
      // Calcula el total de blisters y actualiza el stock_blister
      const totalBlister = stockCaja * blisterPorCaja;
      
      return {
        ...farmaco,
        stock_blister: totalBlister
      };
    });
  
    setFarmacos(updatedFarmacosWithBlister);
  };

  const calcularStockUnidad = (updatedFarmacos) => {
    const updatedFarmacosWithUnidad = updatedFarmacos.map((farmaco) => {
      const stockBlister = parseFloat(farmaco.stock_blister) || 0;
      const unidadesPorBlister = parseFloat(farmaco.unidades_por_blister) || 0;
      
      // Calcula el total de blisters y actualiza el stock_blister
      const totalUnidad = stockBlister * unidadesPorBlister;
      
      return {
        ...farmaco,
        stock_unidad: totalUnidad
      };
    });
  
    setFarmacos(updatedFarmacosWithUnidad);
  };
  
  const onSubmit = async () => {
    try {
      const { data } = await ApiRequest().post('/guardar_farmaco_compra', {
        farmacos,
        proveedorId,
        Nofactura,
        documentoId,
        total_compra: totalCompra,
      });
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
      setFarmacos([{
        id: "",
        nombre: "",
        presentacion: "",
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
        fecha_vencimiento: "",
      }]); // Reiniciar formulario
      setProveedorId(''); // Reiniciar proveedor
      setNofactura('');
      setDocumentoId('');
      setTotalCompra(0); // Reiniciar total
    } catch (error) {
      setMensaje({
        ident: new Date().getTime(),
        message: error.response.data.message,
        type: 'error'
      });
    }
  };

  const handleSaveAndGeneratePDF = () => {
    onSubmit(); // Ejecutar la función de guardado
    generatePDF(); // Ejecutar la función para generar el PDF
};

  useEffect(() => {
    if (globalState.auth && globalState.auth.rol) {
      setUserRole(globalState.auth.rol);
    }
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formatear la fecha como YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, [globalState]);

  return (
    <>
      <Page title="Chapina | Nueva Compra">
        <ToastAutoHide message={mensaje} />
        <Container maxWidth='lg'>
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4">Registrar compra</Typography>
          </Box>
          
          {/* Selección de proveedor */}
          <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
                <Typography variant="h6">
                  Fecha de compra: {currentDate}
                </Typography>
              </Grid>
              
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="proveedor-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-label"
                  name="proveedor_id"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  label="Proveedor"
                >
                  {proveedores.map((prov) => (
                    <MenuItem key={prov.id} value={prov.id}>
                      {prov.nombre} {/* Mostrar el nombre del proveedor */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="Documento-label">Tipo de documento</InputLabel>
                <Select
                  labelId="Documento-label"
                  value={documentoId}
                  onChange={(e) => setDocumentoId(e.target.value)}
                  label="Documento"
                >
                  {documento.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.nombre_documento} {/* Mostrar el nombre del proveedor */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                  <TextField
                    label="No. de documento"
                    value={Nofactura}
                    onChange={(e) => setNofactura(e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

          </Grid>
          {/* Fármacos */}
          {farmacos.map((farmaco, index) => (
            <Box key={index} sx={{ mt: 4, border: '1px solid #ccc', padding: 2 }}>
              <Typography variant="h6">Fármaco comprado {index + 1}</Typography>
              <Grid container spacing={2}>
              <Grid item xs={12}>
              <Button variant="outlined" startIcon={<SearchOutlined />} onClick={() => handleOpenModal(index)}>
              Buscar Fármaco
            </Button>
            </Grid>
                {/* Selección de Presentación */}
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`presentacion-label-${index}`}>Presentación</InputLabel>
                    <Select
                      labelId={`presentacion-label-${index}`}
                      value={farmaco.presentacion}
                      onChange={(e) => onChangePresentacion(index, e.target.value)}
                      label="Presentación"
                    >
                      <MenuItem value="caja">caja</MenuItem>
                      <MenuItem value="blister">blister</MenuItem>
                      <MenuItem value="unidad">unidad</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Campos comunes */}

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Codigo"
                    name="id"
                    value={farmaco.id}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={farmaco.nombre}
                    onChange={(e) => onChangeFarmaco(index, e)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    name="descripcion"
                    value={farmaco.descripcion}
                    onChange={(e) => onChangeFarmaco(index, e)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Código de Barras"
                    name="codigo_barras"
                    value={farmaco.codigo_barras}
                    onChange={(e) => onChangeFarmaco(index, e)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Nivel de Reorden"
                    name="nivel_reorden"
                    value={farmaco.nivel_reorden}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                

                 {/* Selección de Laboratorio */}
                 <Grid item xs={12} sm={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`laboratorio-label-${index}`}>Laboratorio</InputLabel>
                    <Select
                      labelId={`laboratorio-label-${index}`}
                      name="laboratorio_id"
                      value={farmaco.laboratorio_id}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      label="Laboratorio"
                    >
                      {laboratorios.map((lab) => (
                        <MenuItem key={lab.id} value={lab.id}>
                          {lab.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

               {/* Fecha de Vencimiento */}
               <Grid item xs={12} sm={4}>
                  <TextField
                    label="Fecha de Vencimiento"
                    name="fecha_vencimiento"
                    value={formatDate(farmaco.fecha_vencimiento)}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

              
                {/* Campos específicos para Caja */}
                {farmaco.presentacion === "caja" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Precio Caja"
                        name="precio_caja"
                        value={farmaco.precio_caja}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                    <TextField
                      label="Precio Venta Caja"
                      name="precio_venta_caja"
                      value={farmaco.precio_venta_caja}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      fullWidth
                      variant="outlined"
                      type="number"
                    />
                  </Grid>


                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Stock Caja"
                        name="stock_caja"
                        value={farmaco.stock_caja}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        type="number"
                      />
                    </Grid>
            

                  
                  <Grid item xs={12} sm={4}>
                  <TextField
                    label="Blisters por Caja"
                    name="blisters_por_caja"
                    value={farmaco.blisters_por_caja}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Unidades por Blister"
                    name="unidades_por_blister"
                    value={farmaco.unidades_por_blister}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

  


                  </>

                )}
  

                {/* Campos específicos para Blister */}
                {farmaco.presentacion === "blister" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Precio Blister"
                        name="precio_blister"
                        value={farmaco.precio_blister}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                    <TextField
                      label="Precio Venta Blister"
                      name="precio_venta_blister"
                      value={farmaco.precio_venta_blister}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      fullWidth
                      variant="outlined"
                      type="number"
                    />
                  </Grid>


                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Stock Blister"
                      name="stock_blister"
                      value={farmaco.stock_blister} // Permitir que se escriba y se muestre
                      onChange={(e) => onChangeFarmaco(index, e)}
                      type="number"
                    />
                  </Grid>


                    <Grid item xs={12} sm={4}>
                    <TextField
                      label="Unidades por Blister"
                      name="unidades_por_blister"
                      value={farmaco.unidades_por_blister}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      fullWidth
                      variant="outlined"
                      type="number"
                    />
                  </Grid>

                 

                  </>
                )}

                {/* Campos específicos para Unidad */}
                {farmaco.presentacion === "unidad" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Precio Unidad"
                        name="precio_unidad"
                        value={farmaco.precio_unidad}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        type="number"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                    <TextField
                      label="Precio Venta Unidad"
                      name="precio_venta_unidad"
                      value={farmaco.precio_venta_unidad}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      fullWidth
                      variant="outlined"
                      type="number"
                    />
                  </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Stock Unidad"
                        name="stock_unidad"
                        value={farmaco.stock_unidad}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        type="number"
                      />
                    </Grid>
                  </>
                )}

                {/* Botón para eliminar un fármaco */}
                <Grid item xs={12}>
                  <IconButton color="error" onClick={() => removeFarmaco(index)}>
                    <DeleteOutline />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}

          {/* Botón para agregar un nuevo fármaco */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
              onClick={addFarmaco}
            >
              Agregar Fármaco
            </Button>
          </Stack>

          {/* Total de la compra */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Total Compra: Q{totalCompra.toFixed(2)}</Typography>
          </Box>

          {/* Botón para guardar */}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAndGeneratePDF}
            >
              Guardar Compra
            </Button>
          </Box>
          <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
            <DialogTitle>Buscar Fármaco</DialogTitle>
            <DialogContent>
              <TextField
                label="Buscar por nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="dense"
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Stock Caja</TableCell>
                      <TableCell>Stock Blister</TableCell>
                      <TableCell>Stock Unidad</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.filter(farmaco => farmaco.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((farmaco) => (
                      <TableRow key={farmaco.id}>
                        <TableCell>{farmaco.id}</TableCell>
                        <TableCell>{farmaco.nombre}</TableCell>
                        <TableCell>{farmaco.stock_caja}</TableCell>
                        <TableCell>{farmaco.stock_blister}</TableCell>
                        <TableCell>{farmaco.stock_unidad}</TableCell>
                        <TableCell>
                          <Button variant="contained" onClick={() => handleSelectFarmaco(farmaco)}>Seleccionar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Page>
    </>
  );
};

export default Compras;
