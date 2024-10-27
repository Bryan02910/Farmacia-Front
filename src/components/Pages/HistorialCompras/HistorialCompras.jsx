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
  ButtonGroup,
} from '@mui/material';
import Page from '../../common/Page';
import ApiRequest from '../../../helpers/axiosInstances';
import { MainContext } from '../../../Context/MainContext';
import ToastAutoHide from '../../common/ToastAutoHide';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import imagesList from '../../../assets'

const HistorialCompras = () => {
  const { globalState } = useContext(MainContext);
  const [compras, setCompras] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchHistorialCompras = async () => {
      try {
        const { data } = await ApiRequest().get('/historial_compras');
        if (isMounted) setCompras(data);
      } catch (error) {
        if (isMounted) setMensaje({ ident: new Date().getTime(), message: 'Error al cargar el historial de compras', type: 'error' });
      }
    };
    fetchHistorialCompras();
    return () => { isMounted = false };
  }, []);

  const fetchDetalleCompra = async (Nofactura) => {
    try {
      const { data } = await ApiRequest().get(`/detalle_compras/${Nofactura}`);
      setDetalle(Array.isArray(data) ? data : []);
      setOpen(true);
    } catch (error) {
      setMensaje({ ident: new Date().getTime(), message: 'Error al cargar los detalles de la compra', type: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    setOpen(false);
    setDetalle([]);
  };

  const applyFilter = (compras) => {
    const now = new Date();
    if (filter === 'month') {
      return compras.filter(compra => {
        const fechaCompra = new Date(compra.fecha_compra);
        return fechaCompra.getMonth() === now.getMonth() && fechaCompra.getFullYear() === now.getFullYear();
      });
    }
    if (filter === 'week') {
      const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return compras.filter(compra => {
        const fechaCompra = new Date(compra.fecha_compra);
        return fechaCompra >= currentWeekStart;
      });
    }
    if (filter === 'year') {
      return compras.filter(compra => {
        const fechaCompra = new Date(compra.fecha_compra);
        return fechaCompra.getFullYear() === now.getFullYear();
      });
    }
    return compras;
  };

  const filteredCompras = applyFilter(
    compras.filter(compra =>
      compra.Nofactura.toString().includes(searchTerm) ||
      compra.fecha_compra.toString().includes(searchTerm) ||
      compra.proveedor.toString().includes(searchTerm)
    )
  );

  const generatePDFReport = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const imageUrl = imagesList.Logo; // Usar la imagen importada

    // Añadir imagen
    const addImage = () => {
        const imgWidth = 40;
        const imgHeight = 30;
        const margin = 10;
        doc.addImage(imageUrl, 'JPEG', doc.internal.pageSize.getWidth() - imgWidth - margin, margin, imgWidth, imgHeight);
    };

    const title = `Reporte de Compras - ${filter ? `Filtro: ${filter}` : 'Todas las Compras'}`;
    
    // Añadir título
    doc.setFontSize(14);
    doc.text(title, 20, 15);

    const rows = filteredCompras.map(compra => [
        compra.Nofactura,
        compra.fecha_compra,
        compra.proveedor,
        compra.total_compra.toFixed(2),
    ]);

    const columns = ['No. de recibo', 'Fecha', 'Proveedor', 'Total'];

    // Configurar y generar la tabla
    addImage(); // Añadir imagen
    doc.autoTable({
        head: [columns],
        body: rows,
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

    doc.save(`Reporte_Compras_${filter || 'todas'}.pdf`);
};

  
  const generateExcelReport = () => {
    const worksheetData = filteredCompras.map(compra => ({
        'No. de recibo': compra.Nofactura,
        'Fecha': compra.fecha_compra,
        'Proveedor': compra.proveedor,
        'Total': compra.total_compra.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Estilo de encabezado
    const headerCell = worksheet['A1'].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '16A085' } },
    };

    // Aplicar estilos a las demás celdas (opcional)
    for (let cell in worksheet) {
        if (cell[0] === '!') continue; // Evitar las propiedades no deseadas
        worksheet[cell].s = {
            font: { color: { rgb: '000000' } },
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
            },
        };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras');
    XLSX.writeFile(workbook, `Reporte_Compras_${filter || 'todas'}.xlsx`);
};

  return (
    <Page title="Chapina| Historial de compras">
      <Container>
        <Typography variant="h4" gutterBottom>Historial de Compras</Typography>
        {mensaje.message && (
          <ToastAutoHide message={mensaje.message} type={mensaje.type} id={mensaje.ident} />
        )}
        <TextField
          label="Buscar por No. de factura o fecha"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button onClick={() => setFilter('week')}>Esta Semana</Button>
          <Button onClick={() => setFilter('month')}>Este Mes</Button>
          <Button onClick={() => setFilter('year')}>Este Año</Button>
          <Button onClick={() => setFilter('')}>Todas</Button>
        </ButtonGroup>

        <ButtonGroup variant="contained" sx={{ mb: 2 }}>
          <Button onClick={generatePDFReport}>Generar PDF</Button>
          <Button onClick={generateExcelReport}>Generar Excel</Button>
        </ButtonGroup>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No. de documento</TableCell>
                <TableCell>Tipo de documento</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompras.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((compra) => (
                <TableRow key={compra.id}>
                  <TableCell>{compra.Nofactura}</TableCell>
                  <TableCell>{compra.tipo_documento}</TableCell>
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
  );
};

export default HistorialCompras;
