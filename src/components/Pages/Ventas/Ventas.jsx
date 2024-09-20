import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Container, Typography, Grid, Box, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import { MainContext } from '../../../Context/MainContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Ventas = () => {
  const { globalState } = useContext(MainContext);
  const [farmacos, setFarmacos] = useState([{
    id: "",
    nombre: "",
    tipo_presentacion: "caja",
    precio_venta: "",
    cantidad: ""
  }]);
  const [totalVenta, setTotalVenta] = useState(0);
  const [Nofactura, setNofactura] = useState(''); 
  const [currentDate, setCurrentDate] = useState(''); // Fecha actual 
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

  const onChangeFarmaco = async (index, { target }) => {
    const { name, value } = target;
    const updatedFarmacos = [...farmacos];
    
    // Check for the ID field update
    if (name === "id") {
      updatedFarmacos[index][name] = value;
      try {
        const { data } = await ApiRequest().get(`/farmaco_venta/${value}`, {
          params: { tipo_presentacion: updatedFarmacos[index].tipo_presentacion }
        });

        if (data) {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            ...data,
          };
        } else {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            nombre: "",
            precio_venta: ""
          };
        }
        setFarmacos(updatedFarmacos);
        calculateTotalCompra(updatedFarmacos);
      } catch (error) {
        setMensaje({
          ident: new Date().getTime(),
          message: 'Error al obtener los datos del fármaco',
          type: 'error',
        });

        if (error.response?.status === 404) {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            nombre: "",
            precio_venta: ""
          };
          setFarmacos(updatedFarmacos);
        }
      }
    } else if (name === "tipo_presentacion") {
      updatedFarmacos[index][name] = value;
      try {
        const { data } = await ApiRequest().get(`/farmaco_venta/${updatedFarmacos[index].id}`, {
          params: { tipo_presentacion: value }
        });

        if (data) {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            nombre: data.nombre,
            precio_venta: data.precio_venta
          };
        } else {
          updatedFarmacos[index] = {
            ...updatedFarmacos[index],
            nombre: "",
            precio_venta: ""
          };
        }
        setFarmacos(updatedFarmacos);
        calculateTotalCompra(updatedFarmacos);
      } catch (error) {
        setMensaje({
          ident: new Date().getTime(),
          message: 'Error al obtener los datos del fármaco',
          type: 'error',
        });
      }
    } else {
      updatedFarmacos[index][name] = value;
      setFarmacos(updatedFarmacos);
      calculateTotalCompra(updatedFarmacos);
    }
  };

  const addFarmaco = () => {
    setFarmacos([...farmacos, {
      id: "",
      nombre: "",
      tipo_presentacion: "caja",
      precio_venta: "",
      cantidad: ""
    }]);
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
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 10, 10);
    
    const tableData = farmacos.map(f => [f.id, f.nombre, f.tipo_presentacion, f.precio_venta, f.cantidad, (parseFloat(f.precio_venta) * parseInt(f.cantidad, 10))]);
    
    doc.autoTable({
      head: [['ID', 'Nombre', 'Tipo Presentación', 'Precio Venta', 'Cantidad', 'Subtotal']],
      body: tableData,
      startY: 20,
    });

    doc.text(`Total Venta: $${totalVenta.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
    doc.save('ventas.pdf');
  };

  const onSubmit = async () => {
    try {
      const { data } = await ApiRequest().post('/guardar_farmaco_venta', {
        farmacos,
        Nofactura,
        total_venta: totalVenta,
      });
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
      setFarmacos([{
        id: "",
        nombre: "",
        tipo_presentacion: "caja",
        precio_venta: "",
        cantidad: ""
      }]); // Reiniciar formulario
      setNofactura('');
      setTotalVenta(0); // Reiniciar total
    } catch (error) {
      setMensaje({
        ident: new Date().getTime(),
        message: error.response.data.message,
        type: 'error'
      });
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formatear la fecha como YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, []);

  return (
    <Page title="Ventas">
      <Container>
        <Typography variant="h4">Ventas</Typography>
        <Box sx={{ mt: 2 }}>
          {mensaje.message && (
            <ToastAutoHide
              message={mensaje.message}
              type={mensaje.type}
              id={mensaje.ident}
            />
          )}

<Grid container spacing={2}>

<Grid item xs={12} sm={6}>
      <Typography variant="h6">
        Fecha de compra: {currentDate}
      </Typography>
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
          <Grid container spacing={2}>
            {farmacos.map((farmaco, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ p: 2, border: '1px solid', borderRadius: 1 }}>
                  <TextField
                    name="id"
                    label="ID del Fármaco"
                    value={farmaco.id}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    margin="normal"
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Tipo de Presentación</InputLabel>
                    <Select
                      name="tipo_presentacion"
                      value={farmaco.tipo_presentacion}
                      onChange={(e) => onChangeFarmaco(index, e)}
                    >
                      <MenuItem value="caja">Caja</MenuItem>
                      <MenuItem value="blister">Blister</MenuItem>
                      <MenuItem value="unidad">Unidad</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    name="nombre"
                    label="Nombre"
                    value={farmaco.nombre}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    name="precio_venta"
                    label="Precio de Venta"
                    type="number"
                    value={farmaco.precio_venta}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    name="cantidad"
                    label="Cantidad"
                    type="number"
                    value={farmaco.cantidad}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    margin="normal"
                  />

                  <Stack direction="row" spacing={1} mt={2}>
                    <IconButton color="primary" onClick={addFarmaco}>
                      <AddOutlined />
                    </IconButton>
                    {index > 0 && (
                      <IconButton color="error" onClick={() => removeFarmaco(index)}>
                        <DeleteOutline />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" mt={2}>Total: ${totalVenta.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            sx={{ mt: 2 }}
          >
            Guardar Venta
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={generatePDF}
            sx={{ mt: 2, ml: 2 }}
          >
            Generar PDF
          </Button>
        </Box>
      </Container>
    </Page>
  );
};

export default Ventas;
