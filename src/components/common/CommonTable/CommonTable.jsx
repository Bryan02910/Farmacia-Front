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
        <Card sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Datos:
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    autoHeight
                    rows={data}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    pagination
                    components={{
                        LoadingOverlay: CustomLoadingOverlay
                    }}
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #e0e0e0',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #e0e0e0',
                        },
                        '& .MuiPaginationItem-root': {
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#ffffff',
                        },
                    }}
                />
            </Box>
        </Card>
    );
}

export default CommonTable;
