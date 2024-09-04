import React, { useState, useEffect, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

// Estilo personalizado para las alertas con colores más distintivos
const CustomAlert = styled(MuiAlert)(({ theme }) => ({
    borderRadius: '12px', // Bordes redondeados
    padding: '16px', // Más espacio interno
    color: '#000000', // Texto blanco
    fontWeight: 'bold', // Texto en negrita
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Sombra sutil
    textTransform: 'uppercase', // Texto en mayúsculas
    letterSpacing: '0.5px', // Espaciado entre letras
    '& .MuiAlert-icon': {
        fontSize: '2rem', // Tamaño grande para el ícono
        marginRight: '8px', // Espacio a la derecha del ícono
    },
    '&.MuiAlert-filledSuccess': {
        backgroundColor: '#008000', // Verde oscuro para éxito
        border: '2px solid #006400', // Borde verde más oscuro
    },
    '&.MuiAlert-filledError': {
        backgroundColor: '#B22222', // Rojo fuego para error
        border: '2px solid #8B0000', // Borde rojo oscuro
    },
    '&.MuiAlert-filledWarning': {
        backgroundColor: '#FF8C00', // Naranja oscuro para advertencia
        border: '2px solid #FF4500', // Borde naranja más oscuro
    },
    '&.MuiAlert-filledInfo': {
        backgroundColor: '#1E90FF', // Azul brillante para información
        border: '2px solid #1C86EE', // Borde azul más oscuro
    },
}));

const ToastAutoHide = (props) => {
    const { message } = props;
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    useEffect(() => {
        if (message.ident) setOpen(true);
    }, [message]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <CustomAlert onClose={handleClose} severity={message.type}>
                {message.message}
            </CustomAlert>
        </Snackbar>
    );
};

export default ToastAutoHide;
