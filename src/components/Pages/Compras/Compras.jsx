import React, { useState, useEffect, useContext } from 'react';
import {
  TextField, Container, Typography, Grid, Box, Button, Stack, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, DeleteOutline } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import { MainContext } from '../../../Context/MainContext';

const Compras = () => {
  const { globalState } = useContext(MainContext);
  const [userRole, setUserRole] = useState();
  const [farmacos, setFarmacos] = useState([{
    id:"",
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
    fecha_vencimiento: ""
  }]);
  const [proveedorId, setProveedorId] = useState(''); // Estado para ID del proveedor
  const [proveedores, setProveedores] = useState([]); // Estado para lista de proveedores
  const [laboratorios, setLaboratorios] = useState([]); // Estado para lista de laboratorios
  const [totalCompra, setTotalCompra] = useState(0); // Estado para total
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

  // Cargar la lista de proveedores al montar el componente
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

    fetchProveedores();
    fetchLaboratorios();
  }, []);

  const addFarmaco = () => {
    setFarmacos([...farmacos, {
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
      fecha_vencimiento: ""
    }]);
  };

  const removeFarmaco = (index) => {
    const updatedFarmacos = [...farmacos];
    updatedFarmacos.splice(index, 1);
    setFarmacos(updatedFarmacos);
    calculateTotalCompra(updatedFarmacos); // Recalcular total
  };

  const onChangeFarmaco = (index, { target }) => {
    const { name, value } = target;
    const updatedFarmacos = [...farmacos];
    updatedFarmacos[index][name] = value;
    setFarmacos(updatedFarmacos);
    calculateTotalCompra(updatedFarmacos); // Calcular total al cambiar fármacos
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


  const onSubmit = async () => {
    try {
      const { data } = await ApiRequest().post('/guardar_farmaco_compra', {
        farmacos,
        proveedorId,
        total_compra: totalCompra
      });
      setMensaje({
        ident: new Date().getTime(),
        message: data.message,
        type: 'success'
      });
      setFarmacos([{
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
        fecha_vencimiento: "",
      }]); // Reiniciar formulario
      setProveedorId(''); // Reiniciar proveedor
      setTotalCompra(0); // Reiniciar total
    } catch (error) {
      setMensaje({
        ident: new Date().getTime(),
        message: error.response.data.message,
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (globalState.auth && globalState.auth.rol) {
      setUserRole(globalState.auth.rol);
    }
  }, [globalState]);

  return (
    <>
      <Page title="Chapina | Nueva Compra">
        <ToastAutoHide message={mensaje} />
        <Container maxWidth='lg'>
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4">Agregar fármacos para compra</Typography>
          </Box>

          {/* Selección de proveedor */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="proveedor-label">Proveedor</InputLabel>
                <Select
                  labelId="proveedor-label"
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
          </Grid>

          {/* Fármacos */}
          {farmacos.map((farmaco, index) => (
            <Box key={index} sx={{ mt: 4, border: '1px solid #ccc', padding: 2 }}>
              <Typography variant="h6">Fármaco {index + 1}</Typography>
              <Grid container spacing={2}>

              {/*id*/}
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
                {/* Nombre */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre del fármaco"
                    name="nombre"
                    value={farmaco.nombre}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Descripción */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={farmaco.descripcion}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                {/* Precio por Caja */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Precio por Caja"
                    name="precio_caja"
                    value={farmaco.precio_caja}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Precio por Blister */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Precio por Blister"
                    name="precio_blister"
                    value={farmaco.precio_blister}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Precio por Unidad */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Precio por Unidad"
                    name="precio_unidad"
                    value={farmaco.precio_unidad}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Precio Venta Caja */}
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

                {/* Precio Venta Blister */}
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

                {/* Precio Venta Unidad */}
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

                {/* Blisters por Caja */}
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

                {/* Unidades por Blister */}
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

                {/* Stock Caja */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock en Cajas"
                    name="stock_caja"
                    value={farmaco.stock_caja}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Stock Blister */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock en Blisters"
                    name="stock_blister"
                    value={farmaco.stock_blister}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Stock Unidad */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock en Unidades"
                    name="stock_unidad"
                    value={farmaco.stock_unidad}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>

                {/* Nivel de Reorden */}
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

                {/* Código de Barras */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Código de Barras"
                    name="codigo_barras"
                    value={farmaco.codigo_barras}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`proveedor-label-${index}`}>Laboratorio</InputLabel>
                    <Select
                      labelId={`proveedor-label-${index}`}
                      name="proveedor_id"
                      value={farmaco.proveedor_id}
                      onChange={(e) => onChangeFarmaco(index, e)}
                      label="Laboratorio"
                    >
                      {proveedores.map((prov) => (
                        <MenuItem key={prov.id} value={prov.id}>
                          {prov.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    value={farmaco.fecha_vencimiento}
                    onChange={(e) => onChangeFarmaco(index, e)}
                    fullWidth
                    variant="outlined"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Botón para eliminar fármaco */}
                <Grid item xs={12} sm={4} display="flex" alignItems="center">
                  <IconButton onClick={() => removeFarmaco(index)}>
                    <DeleteOutline />
                  </IconButton>
                </Grid>

              </Grid>
            </Box>
          ))}

          {/* Total de la compra */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total de la compra"
                value={totalCompra.toFixed(2)} // Formatear a 2 decimales
                fullWidth
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          {/* Botón para añadir más fármacos */}
          <Button
            onClick={addFarmaco}
            startIcon={<AddOutlined />}
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            Añadir otro fármaco
          </Button>

          {/* Botón para guardar */}
          <Stack direction='row' justifyContent='flex-end' sx={{ mt: 2 }}>
            <Button variant='contained' color='primary' onClick={onSubmit}>
              Guardar
            </Button>
          </Stack>
        </Container>
      </Page>
    </>
  );
};

export default Compras;
