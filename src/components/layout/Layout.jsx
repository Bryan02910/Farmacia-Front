import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Header from './Header'
import MenuApp from './Menu'

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 64
const DRAWER_WIDTH = 280

const RootStyle = styled('div')({
	display: 'flex',
	minHeight: '100vh', // Para asegurar que ocupe el 100% de la altura de la ventana
	overflow: 'hidden',
	backgroundColor: '#f9f9f9' // Fondo sutil para una mejor apariencia
})

const MainStyle = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		flexGrow: 1,
		overflow: 'auto', // Cambio a 'auto' para permitir el scroll si es necesario
		minHeight: '100%',
		paddingTop: APP_BAR_MOBILE + 24,
		paddingBottom: theme.spacing(10),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		[theme.breakpoints.up('lg')]: {
			paddingTop: APP_BAR_DESKTOP + 24,
		},
		transition: theme.transitions.create(['margin', 'padding'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.standard
		}),
		marginLeft: open ? 0 : `-${DRAWER_WIDTH}px`, // Si el menú está cerrado, se ajusta el margen
	})
)

// ----------------------------------------------------------------------

const Layout = ({ children }) => {
	const [openMobile, setOpenMobile] = useState(false)
	const [openDesktop, setOpenDesktop] = useState(true)

	return (
		<RootStyle>
			<Header
				onOpenSidebar={() => setOpenMobile(true)}
				isOpenSidebarDesktop={openDesktop}
				onSidebarDesktop={() => setOpenDesktop((prev) => !prev)}
			/>
			
			<MenuApp
				isOpenSidebar={openMobile}
				onCloseSidebar={() => setOpenMobile(false)}
				isOpenSidebarDesktop={openDesktop}
			/>
			
			<MainStyle open={openDesktop}>
				{children}
			</MainStyle>
		</RootStyle>
	)
}

export default Layout
