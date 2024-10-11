import React, { lazy } from 'react'
import { APP_VALUES } from '../constants/app'
import { HomeRedirect } from './RouteUtils'
const RouteController = lazy(() => import('./RouteController'))
const NotFound = lazy(() => import('../components/Pages/NotFound'))
const Login = lazy(() => import('../components/Pages/Login'))
const Home = lazy(() => import('../components/Pages/Home'))
const Dashboard = lazy(() => import('../components/Pages/Dashboard'))
const Usuarios = lazy(() => import('../components/Pages/Usuarios'))
const Rol = lazy(() => import('../components/Pages/Rol'))
const Farmacos = lazy(() => import('../components/Pages/Farmacos') )
const Laboratorio = lazy(() => import('../components/Pages/Laboratorio') )
const Proveedor = lazy(() => import('../components/Pages/Proveedor'))
const Compras = lazy(() => import('../components/Pages/Compras'))
const Ventas = lazy(() => import('../components/Pages/Ventas'))
const TipoDocumento = lazy(() => import('../components/Pages/TipoDocumento'))

const routes = [
	{
		path: "/",
		exact: true,
		component: HomeRedirect
	},
	{
		path: "/login",
		exact: true,
		render: props => <Login {...props} />
	},
	{
		path: `/${APP_VALUES.ROOT_ROUTE}`,
		render: props => <RouteController component={Home} {...props} />,
		routes: [
			{
				path: `/${APP_VALUES.ROOT_ROUTE}`,
				exact: true,
				render: props => <RouteController component={Dashboard} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/usuarios`,
				exact: true,
				render: props => <RouteController component={Usuarios} {...props} requiredPermissions={['ver_usuarios']} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/rol`,
				exact: true,
				render: props => <RouteController component={Rol} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/farmacos`,
				exact: true,
				render: props => <RouteController component={Farmacos} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/laboratorio`,
				exact: true,
				render: props => <RouteController component={Laboratorio} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/proveedor`,
				exact: true,
				render: props => <RouteController component={Proveedor} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/compras`,
				exact: true,
				render: props => <RouteController component={Compras} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/ventas`,
				exact: true,
				render: props => <RouteController component={Ventas} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/tipodocumento`,
				exact: true,
				render: props => <RouteController component={TipoDocumento} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/*`,
				exact: true,
				render: props => <NotFound {...props} />
			},
		]
	},
	{
		path: '*',
		render: props => <NotFound {...props} />
	}
]

export default routes