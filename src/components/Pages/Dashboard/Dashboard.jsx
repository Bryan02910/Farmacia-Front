import React from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import Page from '../../common/Page'

// ----------------------------------------------------------------------


const Dashboard = () => {

	return (
		<Page title="Chapina| Dashboard">
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography sx={{ mt: 3, fontWeight: 'bold' }} variant='h5'>Bienvenido a</Typography>
					<Typography sx={{ mt: 3, fontWeight: 'bold' }} variant='h2'>Farmacia Chapina</Typography>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						<img src='' alt='...' style={{ position: 'absolute', width: '50%', height: 'auto', marginTop: 30 }} />
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}

export default Dashboard