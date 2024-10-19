import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Container, Typography, Grid, Box, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper
} from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import { MainContext } from '../../../Context/MainContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import imagesList from '../../../assets'

const Ventas = () => {
  const { globalState } = useContext(MainContext);
  const [farmacos, setFarmacos] = useState([{ id: "", nombre: "", tipo_presentacion: "", precio_venta: "", cantidad: "" }]);
  const [totalVenta, setTotalVenta] = useState(0);
  const [Nofactura, setNofactura] = useState('');
  const [Cliente, setCliente] = useState('');
  const [Nit, setNit] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

  const onChangeFarmaco = async (index, { target }) => {
    const { name, value } = target;
    const updatedFarmacos = [...farmacos];
  
    // Cuando cambias el ID del fármaco
    if (name === "id") {
      updatedFarmacos[index][name] = value;
      
      // Asigna el tipo de presentación predeterminado si no está establecido
      const tipoPresentacion = updatedFarmacos[index].tipo_presentacion || "unidad"; // Usa "unidad" o el valor que prefieras
  
      try {
        // Llamada a la API usando el ID y el tipo de presentación
        const { data } = await ApiRequest().get(`/farmaco_venta/${value}`, { params: { tipo_presentacion: tipoPresentacion } });
        if (data) {
          updatedFarmacos[index] = { 
            ...updatedFarmacos[index], 
            nombre: data.nombre, 
            precio_venta: data.precio_venta, // Asegúrate de que esto esté correctamente asignado
            tipo_presentacion: data.presentacion // Esto debería ser el valor de presentación correcto
          };
        } else {
          updatedFarmacos[index] = { ...updatedFarmacos[index], nombre: "", precio_venta: 0, tipo_presentacion: "" };
        }
        setFarmacos(updatedFarmacos);
      } catch (error) {
        setMensaje({ ident: new Date().getTime(), message: 'Error al obtener los datos del fármaco', type: 'error' });
        updatedFarmacos[index] = { ...updatedFarmacos[index], nombre: "", precio_venta: 0, tipo_presentacion: "" };
        setFarmacos(updatedFarmacos);
      }
    }
  
    // Cuando cambias el tipo de presentación
    else if (name === "tipo_presentacion") {
      updatedFarmacos[index][name] = value; // Actualiza el valor de tipo_presentacion
      try {
        const { data } = await ApiRequest().get(`/farmaco_venta/${updatedFarmacos[index].id}`, { params: { tipo_presentacion: value } });
        if (data) {
          updatedFarmacos[index] = { 
            ...updatedFarmacos[index], 
            nombre: data.nombre, 
            precio_venta: data.precio_venta, // Actualiza el precio de venta
            tipo_presentacion: value // Asegúrate de que este valor sea correcto
          };
        } else {
          updatedFarmacos[index] = { ...updatedFarmacos[index], nombre: "", precio_venta: 0, tipo_presentacion: "" };
        }
        setFarmacos(updatedFarmacos);
      } catch (error) {
        setMensaje({ ident: new Date().getTime(), message: 'Error al obtener los datos del fármaco', type: 'error' });
      }
    }
  
    // Para otros campos
    else {
      updatedFarmacos[index][name] = value;
    }
  
    calculateTotalCompra(updatedFarmacos);
  };
  
  
  const onChangePresentacion = (index, value) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[index].tipo_presentacion = value; // Cambia el valor en el campo tipo_presentacion
    setFarmacos(updatedFarmacos);
  };
  
  const generateDocumentNumber = () => {
    const timestamp = Date.now(); // Obtener un timestamp
    return `REC-${timestamp}`; // Formato: DOC-<timestamp>
  };
  

  const addFarmaco = () => {
    setFarmacos([...farmacos, { id: "", nombre: "", tipo_presentacion: "", precio_venta: "", cantidad: "" }]);
  };

  const removeFarmaco = (index) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos.splice(index, 1);
    setFarmacos(updatedFarmacos);
    calculateTotalCompra(updatedFarmacos);
  };

  const calculateTotalCompra = (farmacos) => {
    const total = farmacos.reduce((acc, farmaco) => {
      const precioVenta = parseFloat(farmaco.precio_venta) || 0;
      const cantidad = parseInt(farmaco.cantidad, 10) || 0;
      return acc + (precioVenta * cantidad);
    }, 0);
    setTotalVenta(total);
  };

  const generatePDF = () => {
    // Cambiar el tamaño de la página a algo más parecido a un recibo
    const doc = new jsPDF('portrait', 'mm', [210, 150]); // 210mm de alto y 150mm de ancho (tamaño similar a recibo)
    const currentDateFormatted = new Date().toLocaleDateString();
    const imageUrl = imagesList.Logo;
  
    // Añadir logo (opcional, si tienes un logo importado)
    const addImage = () => {
      const imgWidth = 30; // Un tamaño más pequeño para recibo
      const imgHeight = 20;
      const margin = 10;
      doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - margin, margin, imgWidth, imgHeight); // Opcional
    };
  
    // Preparar las columnas para la tabla
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nombre', dataKey: 'nombre' },
      { header: 'Cant.', dataKey: 'cantidad' },
      { header: 'Precio', dataKey: 'precio_venta' },
      { header: 'Subtotal', dataKey: 'subtotal' }
    ];
  
    // Preparar los datos
    const data = farmacos.map(farmaco => ({
      id: farmaco.id,
      nombre: farmaco.nombre,
      cantidad: parseInt(farmaco.cantidad || 0, 10),
      precio_venta: parseFloat(farmaco.precio_venta || 0).toFixed(2),
      subtotal: (parseFloat(farmaco.precio_venta || 0) * parseInt(farmaco.cantidad || 0, 10)).toFixed(2)
    }));
  
    // Configurar y generar el PDF
    addImage();
    doc.setFontSize(10);
    doc.text('Reporte de Venta', 10, 25);
    doc.text(`Fecha: ${currentDateFormatted}`, 10, 30);
    doc.text(`Factura: ${Nofactura}`, 10, 35);
    doc.text(`Cliente: ${Cliente}`, 10, 40);
    doc.text(`NIT: ${Nit}`, 10, 45);
  
    doc.autoTable({
      columns: columns,
      body: data,
      startY: 50, // Ajustar el espacio superior para la imagen y el título
      margin: { horizontal: 5 }, // Márgenes pequeños para aprovechar el espacio
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2, // Espaciado reducido
      },
      headStyles: {
        fillColor: [22, 160, 133], // Color del encabezado
      },
      didDrawPage: (data) => {
        addImage(); // Añadir imagen en cada nueva página
      },
    });
  
    // Agregar el total de la venta al final
    doc.text(`Total Venta: Q${totalVenta.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
  
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
            <ToastAutoHide
              message={mensaje.message}
              type={mensaje.type}
              id={mensaje.ident}
            />
          )}

          {/* Sección de Información del cliente y venta */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6">
                Fecha de compra: {currentDate}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="No. de documento"
                value={Nofactura}
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true, // Hacer el campo de número de documento de solo lectura
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Nombre del cliente"
                value={Cliente}
                onChange={(e) => setCliente(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Nit"
                value={Nit}
                onChange={(e) => setNit(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
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
                      name="tipo_presentacion"
                      value={farmaco.tipo_presentacion} // Usa un valor por defecto si es necesario
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
                    <TableCell>
                      <TextField
                        name="precio_venta"
                        value={farmaco.precio_venta}
                        fullWidth
                        disabled
                      />
                    </TableCell>
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
                      Q{(parseFloat(farmaco.precio_venta) * parseInt(farmaco.cantidad || 0, 10)).toFixed(2)}
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
