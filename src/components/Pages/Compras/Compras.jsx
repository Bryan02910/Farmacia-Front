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
    presentacion: "caja" // Estado para la presentación seleccionada
  }]);
  const [proveedorId, setProveedorId] = useState(''); // Estado para ID del proveedor
  const [proveedores, setProveedores] = useState([]); // Estado para lista de proveedores
  const [laboratorios, setLaboratorios] = useState([]); // Estado para lista de laboratorios
  const [totalCompra, setTotalCompra] = useState(0); // Estado para total
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

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
      fecha_vencimiento: "",
      presentacion: "caja" // Nueva propiedad para la presentación
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

  const onSubmit = async () => {
    try {
      const { data } = await ApiRequest().post('/guardar_farmaco_compra', {
        farmacos,
        proveedorId,
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
        presentacion: "caja" // Reiniciar presentación
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
                      <MenuItem value="caja">Caja</MenuItem>
                      <MenuItem value="blister">Blister</MenuItem>
                      <MenuItem value="unidad">Unidad</MenuItem>
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

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`proveedor-label-${index}`}>Proveedor</InputLabel>
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
                        value={farmaco.stock_blister}
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
              onClick={onSubmit}
            >
              Guardar Compra
            </Button>
          </Box>
        </Container>
      </Page>
    </>
  );
};

export default Compras;
