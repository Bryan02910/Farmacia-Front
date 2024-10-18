import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Page from '../../common/Page';
import ApiRequest from '../../../helpers/axiosInstances';
import { MainContext } from '../../../Context/MainContext';
import ToastAutoHide from '../../common/ToastAutoHide';

const HistorialCompras = () => {
  const { globalState } = useContext(MainContext);
  const [compras, setCompras] = useState([]);
  const [detalle, setDetalle] = useState([]); // Estado para detalles de compra
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado si el componente se desmonta

    const fetchHistorialCompras = async () => {
      try {
        const { data } = await ApiRequest().get('/historial_compras');
        if (isMounted) {
          setCompras(data);
        }
      } catch (error) {
        if (isMounted) {
          setMensaje({ ident: new Date().getTime(), message: 'Error al cargar el historial de compras', type: 'error' });
        }
      }
    };

    fetchHistorialCompras();

    return () => {
      isMounted = false; // Limpieza
    };
  }, []);

  const fetchDetalleCompra = async (Nofactura) => {
    try {
      const { data } = await ApiRequest().get(`/detalle_compras/${Nofactura}`);
      setDetalle(Array.isArray(data) ? data : []); // Asegúrate de que 'data' sea un array
      setOpen(true);
    } catch (error) {
      setMensaje({ ident: new Date().getTime(), message: 'Error al cargar los detalles de la compra', type: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
    setDetalle([]); // Limpiar detalles al cerrar el modal
  };

  const filteredCompras = compras.filter(compra =>
    compra.Nofactura.toString().includes(searchTerm) ||
    compra.fecha.toString().includes(searchTerm)
  );

  return (
    <>
    <Page title="Chapina| Historial de compras">
    <Container>
      
      <Typography variant="h4" gutterBottom>Historial de Compras</Typography>

      {mensaje.message && (
        <ToastAutoHide
          message={mensaje.message}
          type={mensaje.type}
          id={mensaje.ident}
        />
      )}

      <TextField
        label="Buscar por No. de factura o fecha"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active>
                  No. de Factura
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active>
                  Fecha
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active>
                  Proveedor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active>
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompras.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((compra) => (
              <TableRow key={compra.id}>
                <TableCell>{compra.Nofactura}</TableCell>
                <TableCell>{compra.fecha_compra}</TableCell>
                <TableCell>{compra.proveedor}</TableCell>
                <TableCell>{compra.total_compra.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => fetchDetalleCompra(compra.Nofactura)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCompras.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal para mostrar detalles de la compra */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Detalles de la Compra</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farmaco</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio de Compra</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(detalle) && detalle.length > 0 ? (
                detalle.map((item) => (
                  <TableRow key={item.detalle_id}>
                    <TableCell>{item.nombre_farmaco}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>{item.precio_compra.toFixed(2)}</TableCell>
                    <TableCell>{item.total_farmaco.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No hay detalles disponibles</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Page>
    </>
  );
};

export default HistorialCompras;
