import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box, TextField } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';

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

    useEffect(() => {
        // Cuando los datos cambien, se reinicia el estado de las filas filtradas.
        setFilteredRows(data);
    }, [data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);

        const filteredData = data.filter((row) =>
            columns.some((column) => {
                const cellValue = row[column.field]; 
                // Asegurarse de que no sea undefined o null
                return cellValue && String(cellValue).toLowerCase().includes(value);
            })
        );
        setFilteredRows(filteredData);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#444' }}>
                Datos:
            </Typography>
            {/* Campo de búsqueda */}
            <TextField
                label="Buscar"
                variant="outlined"
                value={searchText}
                onChange={handleSearch}
                sx={{ mb: 2, width: '100%' }}
            />
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
                            borderBottom: '2px solid #ccc',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #e0e0e0',
                            padding: '8px',
                            fontSize: '0.875rem',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #ccc',
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
        </Box>
    );
}

export default CommonTable;
