import { createTheme } from '@mui/material/styles'

const theme = createTheme({
	palette: {
		primary: {
			main: '#1769aa',
			contrastText: '#ffffff'
		},
		secondary: {
			main: "#ab003c",
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
						border: `2px dashed #1769aa`,
						color: '#1769aa',
						transition: 'border-color 0.3s, color 0.3s',
						'&:hover': {
							borderColor: '#0a4f73',
							color: '#0a4f73'
						}
					}
				},
				{
					props: { variant: 'dashed', color: 'secondary' },
					style: {
						border: `2px dashed #ab003c`,
						color: '#ab003c',
						transition: 'border-color 0.3s, color 0.3s',
						'&:hover': {
							borderColor: '#750b2e',
							color: '#750b2e'
						}
					}
				},
				{
					props: { variant: 'radius' },
					style: {
						backgroundColor: '#1769aa',
						borderRadius: 24,
						transition: 'background-color 0.3s, transform 0.2s',
						'&:hover': {
							backgroundColor: '#135e96',
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'radius', color: 'secondary' },
					style: {
						backgroundColor: '#ab003c',
						color: '#ffffff',
						borderRadius: 24,
						transition: 'background-color 0.3s, transform 0.2s',
						'&:hover': {
							backgroundColor: '#920b2e',
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'radiusOutlined' },
					style: {
						backgroundColor: 'transparent',
						borderRadius: 24,
						border: `2px solid #1769aa`,
						color: `#1769aa`,
						transition: 'border-color 0.3s, color 0.3s, background-color 0.3s',
						'&:hover': {
							backgroundColor: '#e3f2fd',
							borderColor: '#0a4f73',
							color: '#0a4f73'
						}
					}
				},
				{
					props: { variant: 'radiusOutlined', color: 'secondary' },
					style: {
						backgroundColor: 'transparent',
						borderRadius: 24,
						border: `2px solid #ab003c`,
						color: `#ab003c`,
						transition: 'border-color 0.3s, color 0.3s, background-color 0.3s',
						'&:hover': {
							backgroundColor: '#fce4ec',
							borderColor: '#750b2e',
							color: '#750b2e'
						}
					}
				},
				{
					props: { variant: 'contained' },
					style: {
						background: "linear-gradient(45deg, #1769aa 30%, #35baf6 90%)",
						color: `#ffffff`,
						borderRadius: 24,
						transition: 'background 0.3s, transform 0.2s',
						'&:hover': {
							background: "linear-gradient(45deg, #135e96 30%, #1e88e5 90%)",
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'contained', color: 'secondary' },
					style: {
						background: "linear-gradient(45deg, #ab003c 30%, #f73378 90%)",
						color: `#ffffff`,
						borderRadius: 24,
						transition: 'background 0.3s, transform 0.2s',
						'&:hover': {
							background: "linear-gradient(45deg, #920b2e 30%, #ec407a 90%)",
							transform: 'scale(1.05)'
						}
					}
				},
				{
					props: { variant: 'text', color: 'inherit' },
					style: {
						backgroundColor: 'transparent',
						color: `#1769aa`,
						transition: 'color 0.3s',
						'&:hover': {
							color: '#0a4f73'
						}
					}
				}
			]
		}
	}
})

export default theme
