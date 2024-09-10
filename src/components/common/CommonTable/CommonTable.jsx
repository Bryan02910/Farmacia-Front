import React from 'react';
import { Card, LinearProgress, Typography, Box } from '@mui/material';
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
    return (
        <Card sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: 5,
            backgroundColor: '#f9f9f9', /* Fondo más claro para la tarjeta */
            border: '1px solid #ddd', /* Borde sutil para dar definición */
        }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#444' }}>
                Datos:
            </Typography>
            <Box sx={{ height: 500, width: '100%' }}> {/* Aumenta la altura del contenedor */}
                <DataGrid
                    autoHeight
                    rows={data}
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
                            backgroundColor: '#e0e0e0', /* Color de fondo para el encabezado */
                            color: '#333',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #ccc', /* Línea inferior más gruesa */
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #e0e0e0',
                            padding: '8px', /* Espaciado interno para celdas */
                            fontSize: '0.875rem', /* Tamaño de fuente ajustado */
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #ccc',
                            backgroundColor: '#f1f1f1', /* Fondo para la parte inferior */
                        },
                        '& .MuiPaginationItem-root': {
                            fontWeight: 'bold',
                            color: '#1976d2', /* Color azul para los elementos de paginación */
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#ffffff',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f0f8ff', /* Color de fondo al pasar el mouse */
                        },
                        '& .MuiDataGrid-selectedRowCount': {
                            color: '#1976d2', /* Color para la cuenta de filas seleccionadas */
                        },
                    }}
                />
            </Box>
        </Card>
    );
}

export default CommonTable;
