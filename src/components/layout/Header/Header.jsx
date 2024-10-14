import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import { Box, Stack, AppBar, Avatar, Toolbar, IconButton, Menu, MenuItem, List, ListItem, ListItemAvatar, ListItemText, Typography, Divider } from '@mui/material'
import { MHidden } from '../@material-extend'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'  // Nuevo icono para el menú
import { useHistory } from 'react-router'
import { MainContext, APP_STATE } from '../../../Context/MainContext'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'  // Nuevo icono para el usuario
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'  // Nuevo icono para cerrar sesión

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 64

const RootStyle = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
	  backgroundColor: '#00bcd4', // Color celeste
	  color: '#ffffff', // Texto blanco
	  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Sombras suaves
	  transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	  }),
	  [theme.breakpoints.up('lg')]: {
		width: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)`,
	  },
	  ...(open && {
		transition: theme.transitions.create(['margin', 'width'], {
		  easing: theme.transitions.easing.easeOut,
		  duration: theme.transitions.duration.enteringScreen,
		}),
	  }),
	})
  );
  

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
	minHeight: APPBAR_MOBILE,
	[theme.breakpoints.up('lg')]: {
	  minHeight: APPBAR_DESKTOP,
	  padding: theme.spacing(0, 3), // Menos padding para una barra más compacta
	},
	display: 'flex',
	justifyContent: 'space-between', // Alineación de los elementos
}));

// ----------------------------------------------------------------------

const Header = ({ onOpenSidebar, isOpenSidebarDesktop, onSidebarDesktop }) => {
	const [user, setUser] = useState({})
	const { globalState, globalDispatch } = useContext(MainContext)
	const [anchorEl, setAnchorEl] = useState(null)
	const openMenu = Boolean(anchorEl)
	const { push } = useHistory()

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const init = () => {
		if (typeof globalState.auth.id === 'undefined') {
			localStorage.clear()
		} else {
			setUser(globalState.auth)
		}
	}

	useEffect(init, [])

	return (
		<RootStyle color='primary' elevation={8} open={isOpenSidebarDesktop}>
			<ToolbarStyle>
				<MHidden width="lgUp">
					<IconButton onClick={onOpenSidebar} sx={{ mr: 1 }} color='inherit'>
						<HomeOutlinedIcon /> {/* Icono cambiado */}
					</IconButton>
				</MHidden>
				<MHidden width="lgDown">
					<IconButton onClick={onSidebarDesktop} sx={{ mr: 1 }} color='inherit'>
						<HomeOutlinedIcon /> {/* Icono cambiado */}
					</IconButton>
				</MHidden>

				<Box sx={{ flexGrow: 1 }} />
				<Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
					<Typography variant="body1" sx={{ fontWeight: 'bold' }}>
					{user.user} {/* Aquí se muestra el nombre del usuario */}
					<IconButton onClick={handleMenu} color="inherit">
						<SettingsOutlinedIcon /> {/* Icono cambiado */}
					</IconButton>
				    </Typography>
					<Menu
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={openMenu}
						onClose={handleClose}>
						<MenuItem>
						<List>
						<ListItem sx={{ padding: '10px' }}> {/* Más padding para mejor separación */}
						<ListItemAvatar>
							<Avatar src={user.picture} alt="User Avatar" />
						</ListItemAvatar>
						<ListItemText 
							primary={
								<div style={{ textAlign: 'center' }}>
								  <Typography variant="body1">{user.user}</Typography>
								  <Typography variant="subtitle2" color="textSecondary">
									<b>{user.rol}</b>
								  </Typography>
								</div>
							}
						/>
						</ListItem>
					</List>
					</MenuItem>
					<Divider />
					<MenuItem onClick={() => {
					globalDispatch({ type: APP_STATE.CLEAR_APP_STATE });
					localStorage.clear();
					push('/login');
					}} sx={{ justifyContent: 'center', padding: '10px 20px' }}>
					<PowerSettingsNewOutlinedIcon sx={{ marginRight: 1 }} /> {/* Icono cambiado */}
					<Typography variant="body2">Cerrar sesión</Typography>
						</MenuItem>
					</Menu>
				</Stack>
			</ToolbarStyle>
		</RootStyle>
	)
}

Header.propTypes = {
	onOpenSidebar: PropTypes.func
}

export default Header
