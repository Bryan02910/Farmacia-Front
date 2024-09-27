import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Box, Drawer, Typography, Stack } from '@mui/material'
import imagesList from '../../../assets'
import NavSection from '../NavSection/NavSection'
import { MHidden } from '../@material-extend'
import sidebarConfig from './SidebarConfig'
import { APP_VALUES } from '../../../constants/app'

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280

const RootStyle = styled('div')(({ theme }) => ({
	[theme.breakpoints.up('lg')]: {
		flexShrink: 0,
		width: DRAWER_WIDTH
	}
}))

// ----------------------------------------------------------------------

const MenuApp = ({ isOpenSidebar, onCloseSidebar, isOpenSidebarDesktop }) => {
	const { pathname } = useLocation()

	const init = () => {
		if (isOpenSidebar) {
			onCloseSidebar()
		}
	}

	useEffect(init, [pathname])

	const renderContent = (
		<>
			<Stack
				sx={{ p: 2, position: 'relative', mb: 4 }}
				direction="row"
				alignItems="center"
				spacing={{ xs: 1, sm: 2 }}
			>
				{/* You can add additional elements here if needed */}
			</Stack>
			<Box
				sx={{
					px: 2.5,
					pb: 2,
					mt: 4,
					bgcolor: 'lightblue', // Cambia este valor
					borderRadius: 2
				}}
			>
				<Stack
					alignItems="center"
					spacing={2}
					sx={{
						p: 2,
						pt: 4,
						borderRadius: 2,
						bgcolor: 'background.paper',
						boxShadow: 3
					}}
				>
					<Box
						component="img"
						src={imagesList.Logo}
						sx={{ width: 80, height: 'auto', position: 'relative', mb: 2 }}
					/>

					<Box sx={{ textAlign: 'center' }}>
						<Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
							{APP_VALUES.NAME}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.secondary' }}>
							{APP_VALUES.VERSION}
						</Typography>
					</Box>
				</Stack>
			</Box>
			<NavSection navConfig={sidebarConfig} isOpenSidebarDesktop={isOpenSidebarDesktop} />
			<Box sx={{ flexGrow: 1 }} />
		</>
	)

	return (
		<RootStyle>
			<MHidden width="lgUp">
				<Drawer
					open={isOpenSidebar}
					onClose={onCloseSidebar}
					PaperProps={{
						sx: {
							width: DRAWER_WIDTH,
							bgcolor: 'lightblue',
							boxShadow: 2,
							transition: 'transform 0.3s ease'
						}
					}}
				>
					{renderContent}
				</Drawer>
			</MHidden>

			<MHidden width="lgDown">
				<Drawer
					open={isOpenSidebarDesktop}
					variant='persistent'
					PaperProps={{
						sx: {
							width: DRAWER_WIDTH,
							bgcolor: 'lightblue',
							boxShadow: 3,
							transition: 'transform 0.3s ease'
						}
					}}
				>
					{renderContent}
				</Drawer>
			</MHidden>
		</RootStyle>
	)
}

MenuApp.propTypes = {
	isOpenSidebar: PropTypes.bool,
	onCloseSidebar: PropTypes.func,
	isOpenSidebarDesktop: PropTypes.bool
}

export default MenuApp
