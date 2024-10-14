import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
}

const CommonTable = ({ data, columns }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredRows, setFilteredRows] = useState(data);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        setFilteredRows(data); // Resetear los datos filtrados cuando cambien
    }, [data]);

    // Lógica de búsqueda en la tabla
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);

        const filteredData = data.filter((row) =>
            columns.some((column) => {
                const cellValue = row[column.field];
                return cellValue && String(cellValue).toLowerCase().includes(value);
            })
        );
        setFilteredRows(filteredData);
    };

    // Lógica de filtrado personalizada
    const handleFilter = () => {
        if (selectedColumn && filterValue) {
            const filteredData = data.filter((row) => {
                const cellValue = row[selectedColumn];
                return cellValue && String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
            });
            setFilteredRows(filteredData);
        }
        setIsFilterDialogOpen(false); // Cerrar el diálogo después de aplicar el filtro
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#444' }}>
                Datos:
            </Typography>
            {/* Campo de búsqueda y botón de filtro */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    label="Buscar"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearch}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FilterListIcon />}
                    sx={{ height: 'fit-content', alignSelf: 'center' }}
                    onClick={() => setIsFilterDialogOpen(true)} // Abrir diálogo de filtro
                >
                    Filtrar
                </Button>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    autoHeight
                    rows={filteredRows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    pagination
                    components={{
                        LoadingOverlay: CustomLoadingOverlay
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#e0e0e0',
                            color: '#333',
                            fontWeight: 'bold',
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                            padding: '8px',
                            fontSize: '0.875rem',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: '#f1f1f1',
                        },
                        '& .MuiPaginationItem-root': {
                            fontWeight: 'bold',
                            color: '#1976d2',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#ffffff',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f0f8ff',
                        },
                        '& .MuiDataGrid-selectedRowCount': {
                            color: '#1976d2',
                        },
                    }}
                    columnBuffer={2}
                    autoWidth
                />
            </Box>

            {/* Cuadro de diálogo para el filtro */}
            <Dialog open={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}>
                <DialogTitle>Filtrar Datos</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Columna"
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                        fullWidth
                        margin="dense"
                    >
                        {columns.map((col) => (
                            <MenuItem key={col.field} value={col.field}>
                                {col.headerName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Valor de filtro"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFilterDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleFilter} variant="contained" color="primary">
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommonTable;
