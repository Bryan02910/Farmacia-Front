import { createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		primary: {
			main: '#4caf50', // Verde
			contrastText: '#ffffff'
		},
		secondary: {
			main: '#00bcd4', // Celeste
			contrastText: '#ffffff'
		},
		error: {
			main: '#f44336', // Rojo
			contrastText: '#ffffff'
		},
		neutral: {
			main: '#64748B',
			contrastText: '#ffffff'
		}
	},
	components: {
		MuiButton: {
			variants: [
				{
					props: { variant: 'dashed' },
					style: {
						border: `2px dashed #4caf50`, // Verde
						color: '#4caf50',
						transition: 'border-color 0.3s, color 0.3s',
						'&:hover': {
							borderColor: '#388e3c',
							color: '#388e3c'
						}
					}
				},
				{
					props: { variant: 'dashed', color: 'secondary' },
					style: {
						border: `2px dashed #00bcd4`, // Celeste
						color: '#00bcd4',
						transition: 'border-color 0.3s, color 0.3s',
						'&:hover': {
							borderColor: '#0097a7',
							color: '#0097a7'
						}
					}
				},
				{
					props: { variant: 'radius' },
					style: {
						backgroundColor: '#4caf50', // Verde
						borderRadius: 24,
						transition: 'background-color 0.3s, transform 0.2s',
						'&:hover': {
							backgroundColor: '#388e3c',
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'radius', color: 'secondary' },
					style: {
						backgroundColor: '#00bcd4', // Celeste
						color: '#ffffff',
						borderRadius: 24,
						transition: 'background-color 0.3s, transform 0.2s',
						'&:hover': {
							backgroundColor: '#0097a7',
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'radiusOutlined' },
					style: {
						backgroundColor: 'transparent',
						borderRadius: 24,
						border: `2px solid #4caf50`, // Verde
						color: `#4caf50`,
						transition: 'border-color 0.3s, color 0.3s, background-color 0.3s',
						'&:hover': {
							backgroundColor: '#e8f5e9',
							borderColor: '#388e3c',
							color: '#388e3c'
						}
					}
				},
				{
					props: { variant: 'radiusOutlined', color: 'secondary' },
					style: {
						backgroundColor: 'transparent',
						borderRadius: 24,
						border: `2px solid #00bcd4`, // Celeste
						color: `#00bcd4`,
						transition: 'border-color 0.3s, color 0.3s, background-color 0.3s',
						'&:hover': {
							backgroundColor: '#b2ebf2',
							borderColor: '#0097a7',
							color: '#0097a7'
						}
					}
				},
				{
					props: { variant: 'contained' },
					style: {
						background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)", // Verde
						color: `#ffffff`,
						borderRadius: 24,
						transition: 'background 0.3s, transform 0.2s',
						'&:hover': {
							background: "linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)",
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'contained', color: 'secondary' },
					style: {
						background: "linear-gradient(45deg, #00bcd4 30%, #4dd0e1 90%)", // Celeste
						color: `#ffffff`,
						borderRadius: 24,
						transition: 'background 0.3s, transform 0.2s',
						'&:hover': {
							background: "linear-gradient(45deg, #0097a7 30%, #26c6da 90%)",
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'text', color: 'inherit' },
					style: {
						backgroundColor: 'transparent',
						color: `#4caf50`, // Verde
						transition: 'color 0.3s',
						'&:hover': {
							color: '#388e3c'
						}
					}
				}
			]
		}
	}
})

export default theme
