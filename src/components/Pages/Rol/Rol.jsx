import React, { useState, useEffect } from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline } from '@mui/icons-material'
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'

const Tipo = () => {
	const initialState = {
    descripcion	: '',
	
};

	const [usuariosList, setUsuariosList] = useState([])
	const [body, setBody] = useState(initialState)
	const [openDialog, setOpenDialog] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
	const [idDelete, setIdDelete] = useState(null)
	const [openDialogDelete, setOpenDialogDelete] = useState(false)
	const init = async () => {
		const { data } = await ApiRequest().get('/rol_select')
		setUsuariosList(data)

		
	}

	

	const columns = [
	{ field: 'id', headerName: 'ID', width: 120 },
	
	{ field: 'descripcion', headerName: 'Descripción', width: 220 },
	{
		field: '',
		headerName: 'Acciones',
		width: 200,
		renderCell: (params) => (
			<Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
				<IconButton size='small' onClick={() => {
					setIsEdit(true);
					setBody(params.row);
					handleDialog();
				}}>
					<EditOutlined />
				</IconButton>
				<IconButton size='small' onClick={() => {
					handleDialogDelete()
					setIdDelete(params.id)
				}}>
					<DeleteOutline />
				</IconButton>
			</Stack>
		)
	}
];

	const onDelete = async () => {
		try {
			const { data } = await ApiRequest().post('tipo/eliminar', { id: idDelete })
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			handleDialogDelete()
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const handleDialog = () => {
		setOpenDialog(prev => !prev)
	}

	const handleDialogDelete = () => {
		setOpenDialogDelete(prev => !prev)
	}

	const onChange = ({ target }) => {
		const { name, value } = target
		setBody({
			...body,
			[name]: value
		})
	}

	const onSubmit = async () => {
		if (!body.linea ) {
			setMensaje({
			  ident: new Date().getTime(),
			  message: 'Todos los campos marcados son obligatorios.',
			  type: 'error',
			});
			return;
		  }
		try {
			const { data } = await ApiRequest().post('tipo/guardar', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
			setIsEdit(false)
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const onEdit = async () => {
		try {
			const { data } = await ApiRequest().post('tipo/editar', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	useEffect(init, [])

	return (
		<>

				<Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
				<DialogTitle>
					¿Desea eliminar esta linea de vehículo?
				</DialogTitle>
				<DialogContent>
					<Typography variant='h5'>Esta acción es irreversible</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
					<Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
				</DialogActions>
			</Dialog>
			
			<Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
				<DialogTitle>
					{isEdit ? 'Editar Linea' : 'Crear Linea'}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='linea'
								value={body.linea}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Ingrese linea del vehículo'
							/>
							
						</Grid>
				
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialog}>cancelar</Button>
					<Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>guardar</Button>
				</DialogActions>
			</Dialog>
			<Page title="Chapina|Roles">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 5 }}>
						<Typography variant="h5">Lista de tipo de vehículos</Typography>
					</Box>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
						<Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Nuevo</Button>
						</Grid>
						<Grid item xs={12} sm={8} />
						<Grid item xs={12} sm={12}>
							<CommonTable data={usuariosList} columns={columns} />
						</Grid>
					</Grid>
				</Container>
			</Page>
		</>
	)
}

export default Tipo

