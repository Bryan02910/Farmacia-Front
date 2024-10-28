import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Container, Typography, Grid, Box, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, DeleteOutline, SearchOutlined } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import { MainContext } from '../../../Context/MainContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import imagesList from '../../../assets'

const Ventas = () => {
  const { globalState } = useContext(MainContext);
  const [farmacos, setFarmacos] = useState([{ 
    id: "", 
    nombre: "", 
    presentacion: "", 
    precio_venta_caja: '',
    precio_venta_blister: '',
    precio_venta_unidad: '',
    cantidad: "",
    precio_mayor: "" }]);

    const [clientes, setClientes] = useState([{ 
      id: "", 
      nombre: "", 
      correo: "", 
      dpi: '',
      nit: '',
      telefono: '',
      direccion: ""
     }]);
  const [totalVenta, setTotalVenta] = useState(0);
  const [Nofactura, setNofactura] = useState('');
  const [Cliente, setCliente] = useState('');
  const [Nit, setNit] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 

  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchFarmacos(); // Cargar los fármacos al abrir el modal
  };

  const handleOpenModal1 = () => {
    setIsModalOpen1(true);
    fetchClientes(); // Cargar los fármacos al abrir el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModal1 = () => {
    setIsModalOpen1(false)
  };

  const fetchClientes = async () => {
    try {
      const { data } = await ApiRequest().get('/clientes');
      setSearchResults(data); // Cargar los resultados en el modal
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  // Función para cargar los fármacos desde la API
  const fetchFarmacos = async () => {
    try {
      const { data } = await ApiRequest().get('/farmacos_venta');
      setSearchResults(data); // Cargar los resultados en el modal
    } catch (error) {
      console.error('Error al obtener los fármacos:', error);
    }
  };

  // Función para seleccionar un fármaco y cargarlo en el formulario
  const handleSelectFarmaco = (farmaco) => {
    setFarmacos((prevFarmacos) => {
      const firstEmptyIndex = prevFarmacos.findIndex(f => f.id === ""); // Buscar el primer fármaco vacío
      
      if (firstEmptyIndex !== -1) {
        // Reemplazar el primer fármaco vacío
        const updatedFarmacos = [...prevFarmacos];
        updatedFarmacos[firstEmptyIndex] = {
          id: farmaco.id,
          nombre: farmaco.nombre,
          presentacion: farmaco.presentacion,
          precio_venta_caja: farmaco.precio_venta_caja,
          precio_venta_blister: farmaco.precio_venta_blister,
          precio_venta_unidad: farmaco.precio_venta_unidad,
          cantidad: ''
        };
        return updatedFarmacos;
      } else {
        // Si no hay fármaco vacío, agregar uno nuevo
        return [
          ...prevFarmacos,
          {
            id: farmaco.id,
            nombre: farmaco.nombre,
            presentacion: farmaco.presentacion,
            precio_venta_caja: farmaco.precio_venta_caja,
            precio_venta_blister: farmaco.precio_venta_blister,
            precio_venta_unidad: farmaco.precio_venta_unidad,
            cantidad: ''
          }
        ];
      }
    });
    handleCloseModal(); // Cerrar el modal
  };

  const handleUpdateCliente = (cliente) => {
    setCliente(cliente.nombre || ""); // Asegúrate de establecer un valor por defecto
    setNit(cliente.nit || ""); // Asegúrate de establecer un valor por defecto
    handleCloseModal1();
  };
  

  const onChangeFarmaco = async (index, { target }) => {
    const { name, value } = target;
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[index][name] = value || '';
    // Si se cambia el campo ID, hacer la solicitud para obtener los datos del fármaco
    if (name === "id" && value) {
      try {
        // Realizar solicitud para obtener los datos del fármaco por ID
        const { data } = await ApiRequest().get(`/farmaco/${value}`);
  
        // Verificar si se encontraron datos para el ID proporcionado
        if (data) {
          // Actualizar los datos del fármaco en base a la respuesta
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            ...data, // Asignar todos los datos del fármaco
          };
        } else {
          // ID no encontrado, limpiar los campos del fármaco
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            id: value,
            nombre: '',
            precio_venta_caja: '',
            precio_venta_blister: '',
            precio_venta_unidad: '',
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
  
        // Limpiar los campos del fármaco si el ID no es válido
        if (error.response?.status === 404) {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            id: value,
            nombre: '',
            precio_venta_caja: '',
            precio_venta_blister: '',
            precio_venta_unidad: '',
            presentacion: 'caja', // Ajustar según sea necesario
          };
          setFarmacos(updatedFarmacos);
        }
      }
    } else {
      // Si no es el ID, actualizar el valor normalmente
      updatedFarmacos[index][name] = value;
      setFarmacos(updatedFarmacos);
    }
  
    // Recalcular total de la compra
    calculateTotalCompra(updatedFarmacos);
    
  };
  
  
  const onChangePresentacion = (index, value) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[index].presentacion = value;
    setFarmacos(updatedFarmacos);
  };

  
  const generateDocumentNumber = () => {
    const timestamp = Date.now(); // Obtener un timestamp
    return `REC-${timestamp}`; // Formato: DOC-<timestamp>
  };
  

  const addFarmaco = () => {
    setFarmacos([...farmacos, { id: "", 
      nombre: "", 
      presentacion: "", 
      precio_venta_caja: '',
      precio_venta_blister: '',
      precio_venta_unidad: '',
      cantidad: "" }]);
  };

  const removeFarmaco = (index) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos.splice(index, 1);
    setFarmacos(updatedFarmacos);
    calculateTotalCompra(updatedFarmacos);
  };

  const calculateTotalCompra = (farmacos) => {
    const total = farmacos.reduce((acc, farmaco) => {
      // Determina el precio según la presentación
      let precioVenta = 0;
      
      switch (farmaco.presentacion) {
        case "caja":
          precioVenta = parseFloat(farmaco.precio_venta_caja) || 0;
          break;
        case "blister":
          precioVenta = parseFloat(farmaco.precio_venta_blister) || 0;
          break;
        case "unidad":
          precioVenta = parseFloat(farmaco.precio_venta_unidad) || 0;
          break;
        default:
          precioVenta = 0; // Caso para manejar presentaciones no especificadas
          break;
      }
  
      const cantidad = parseInt(farmaco.cantidad, 10) || 0;
      return acc + (precioVenta * cantidad);
    }, 0);
  
    setTotalVenta(total);
  };
  

  const generatePDF = () => {
    // Cambiar el tamaño de la página a un tamaño de recibo vertical
    const doc = new jsPDF('portrait', 'mm', [150, 75]);
    const currentDateFormatted = new Date().toLocaleDateString();
    const imageUrl = imagesList.Logo;

    // Añadir logo (opcional, si tienes un logo importado)
    const addImage = () => {
      const imgWidth = 25;
      const imgHeight = 15;
      const margin = 5;
      doc.addImage(imageUrl, 'JPEG', margin, margin, imgWidth, imgHeight);
    };

    // Información de venta en forma de tabla
    const ventaInfo = [
      { label: 'Fecha:', value: currentDateFormatted },
      { label: 'No. Recibo de venta:', value: Nofactura },
      { label: 'Comprador final', value: Cliente },
      { label: 'NIT:', value: Nit }
    ];

    // Crear tabla para la información de la venta
    doc.autoTable({
      body: ventaInfo.map(info => ([info.label, info.value])),
      startY: 30, // Posición después del logo
      margin: { horizontal: 5 },
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 1 },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' },
        1: { cellWidth: 40 },
      }
    });

    // Preparar las columnas para la tabla de productos
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nombre', dataKey: 'nombre' },
      { header: 'Cant.', dataKey: 'cantidad' },
      { header: 'Precio', dataKey: 'precio_venta' },
      { header: 'Subtotal', dataKey: 'subtotal' }
    ];

    // Preparar los datos de los productos
    const data = farmacos.map(farmaco => ({
      id: farmaco.id,
      nombre: farmaco.nombre,
      cantidad: parseInt(farmaco.cantidad || 0, 10),
      precio_venta: parseFloat(farmaco.precio_venta || 0).toFixed(2),
      subtotal: (parseFloat(farmaco.precio_venta || 0) * parseInt(farmaco.cantidad || 0, 10)).toFixed(2)
    }));

    // Configurar y generar la tabla de productos
    addImage();
    doc.autoTable({
      columns: columns,
      body: data,
      startY: doc.lastAutoTable.finalY + 5, // Ajustar espacio después de la tabla de información de venta
      margin: { horizontal: 2 },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fillColor: [22, 160, 133] }
    });

    // Agregar el total de la venta al final
    doc.text(`Total Venta: Q${totalVenta.toFixed(2)}`, 5, doc.lastAutoTable.finalY + 5);

    // Descargar el archivo PDF
    doc.save('venta_recibo.pdf');
};


const onSubmit = async () => {
  // Validar que al menos haya un fármaco con cantidad mayor a 0
  if (farmacos.every(farmaco => !farmaco.cantidad || parseInt(farmaco.cantidad) <= 0)) {
    setMensaje({ ident: new Date().getTime(), message: 'Debes agregar al menos un fármaco con cantidad válida.', type: 'error' });
    return;
  }

  try {
    const { data } = await ApiRequest().post('/guardar_farmaco_venta', {
      farmacos,
      Nofactura,
      total_venta: totalVenta,
      nombre_cliente: Cliente,
      nit: Nit,
    });
    setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
    
    // Reiniciar formulario
    setFarmacos([{ id: "", nombre: "", presentacion: "", precio_venta: "", cantidad: "" }]);
    setNofactura(generateDocumentNumber()); // Generar un nuevo número de recibo
    setCliente('');
    setNit('');
    setTotalVenta(0); // Reiniciar total
  } catch (error) {
    setMensaje({ ident: new Date().getTime(), message: error.response?.data?.message || 'Error al guardar la venta.', type: 'error' });
  }
};


  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formatear la fecha como YYYY-MM-DD
    setCurrentDate(formattedDate);

     const newDocNumber = generateDocumentNumber();
    setNofactura(newDocNumber);
  }, []);

  return (
    <Page title="Chapina| Ventas">
      <Container>
        <Typography variant="h4" gutterBottom>Ventas</Typography>

        <Box sx={{ mt: 2 }}>
          {mensaje.message && (
            <ToastAutoHide message={mensaje.message} type={mensaje.type} id={mensaje.ident} />
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">Fecha de compra: {currentDate}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="No. de documento" value={Nofactura} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
            <Button variant="outlined" startIcon={<SearchOutlined />} onClick={handleOpenModal1}>
            Buscar cliente
          </Button>
          </Grid>
            <Grid item xs={13} sm={6} md={3}>
              <TextField label="Comprador final" value={Cliente} onChange={(e) => setCliente(e.target.value)} fullWidth variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label="Nit" value={Nit} onChange={(e) => setNit(e.target.value)} fullWidth variant="outlined" />
            </Grid>
          </Grid>

          {/* Botón de búsqueda para abrir el modal */}
          <Button variant="outlined" startIcon={<SearchOutlined />} onClick={handleOpenModal}>
            Buscar Fármaco
          </Button>

          {/* Modal de búsqueda */}
          <Grid>
          <Dialog open={isModalOpen1} onClose={handleCloseModal1} fullWidth maxWidth="md">
            <DialogTitle>Buscar cliente</DialogTitle>
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
                      <TableCell>Nit</TableCell>
                
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.filter(clientes => clientes.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((clientes) => (
                      <TableRow key={clientes.id}>
                        <TableCell>{clientes.id}</TableCell>
                        <TableCell>{clientes.nombre}</TableCell>
                        <TableCell>{clientes.nit}</TableCell>
                        <TableCell>
                          <Button variant="contained" onClick={() =>  handleUpdateCliente(clientes)}>Seleccionar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal1}>Cerrar</Button>
            </DialogActions>
          </Dialog>
          </Grid>

          <Grid>
          <Dialog open={isModalOpen} onClose={handleCloseModal1} fullWidth maxWidth="md">
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
          </Grid>
          {/* Tabla de fármacos */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo Presentación</TableCell>
                  <TableCell>Precio Venta</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farmacos.map((farmaco, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        name="id"
                        value={farmaco.id}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>{farmaco.nombre}</TableCell>
                    <TableCell>
                    <FormControl fullWidth>
                    <Select
                      name="presentacion"
                      value={farmaco.presentacion} // Usa un valor por defecto si es necesario
                      onChange={(e) => {
                        onChangePresentacion(index, e.target.value); // Actualiza solo la presentación
                        onChangeFarmaco(index, e); // Llama también a la función principal para manejar la API
                      }}
                    >
                      <MenuItem value="caja">Caja</MenuItem>
                      <MenuItem value="blister">Blister</MenuItem>
                      <MenuItem value="unidad">Unidad</MenuItem>
                    </Select>
                  </FormControl>
                  </TableCell>
                  {farmaco.presentacion === "caja" && (
                  <>
                    <TableCell>
                      <TextField
                        name="precio_venta_caja"
                        value={farmaco.precio_venta_caja}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    </>
                  )}
                  {farmaco.presentacion === "unidad" && (
                  <>
                    <TableCell>
                      <TextField
                        name="precio_venta_unidad"
                        value={farmaco.precio_venta_unidad}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    </>
                  )}
                  {farmaco.presentacion === "blister" && (
                  <>
                    <TableCell>
                      <TextField
                        name="precio_venta_blister"
                        value={farmaco.precio_venta_blister}
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    </>
                  )}
                    <TableCell>
                      <TextField
                        name="cantidad"
                        type="number"
                        value={farmaco.cantidad}
                        onChange={(e) => onChangeFarmaco(index, e)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      Q{(() => {
                        let precioVenta = 0;
                        
                        // Determina el precio según la presentación
                        switch (farmaco.presentacion) {
                          case "caja":
                            precioVenta = parseFloat(farmaco.precio_venta_caja) || 0;
                            break;
                          case "blister":
                            precioVenta = parseFloat(farmaco.precio_venta_blister) || 0;
                            break;
                          case "unidad":
                            precioVenta = parseFloat(farmaco.precio_venta_unidad) || 0;
                            break;
                          default:
                            precioVenta = 0;
                            break;
                        }

                        const cantidad = parseInt(farmaco.cantidad || 0, 10);
                        return (precioVenta * cantidad).toFixed(2);
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={addFarmaco}>
                        <AddOutlined />
                      </IconButton>
                      {index > 0 && (
                        <IconButton color="error" onClick={() => removeFarmaco(index)}>
                          <DeleteOutline />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" mt={2}>Total: Q{totalVenta.toFixed(2)}</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              Guardar Venta
            </Button>
            <Button variant="contained" color="secondary" onClick={generatePDF}>
              Generar PDF
            </Button>
          </Stack>
        </Box>
      </Container>
    </Page>
  );
};

export default Ventas;
