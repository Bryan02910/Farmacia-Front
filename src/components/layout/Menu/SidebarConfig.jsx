import React from 'react'
import { PersonOutlined, HomeOutlined, SupervisorAccountOutlined, ShoppingCartOutlined, Inventory2Outlined, NotificationsOutlined } from '@mui/icons-material'

const sidebarConfig = [
  {
    title: 'Inicio',
    path: '/app',
    icon: <HomeOutlined />,
  },
  {
    title: 'Gestión de Usuarios',
    icon: <PersonOutlined />,
    children: [
      {
        title: 'Lista de Usuarios',
        path: '/app/usuarios',
        icon: <SupervisorAccountOutlined />,
      },
      {
        title: 'Roles',
        path: '/app/rol',
        icon: <SupervisorAccountOutlined />,
      },
    ],
  },
  {
    title: 'Ventas',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'Nueva Venta',
        path: '/app/ventas/nueva',
        icon: <ShoppingCartOutlined />,
      },
      {
        title: 'Historial de Ventas',
        path: '/app/ventas/historial',
        icon: <Inventory2Outlined />,
      },
    ],
  },
  {
    title: 'Inventario',
    icon: <Inventory2Outlined />,
    children: [
      {
        title: 'Lista de farmacos',
        path: '/app/farmacos',
        icon: <Inventory2Outlined />,
      },
      {
        title: 'Agregar Producto',
        path: '/app/inventario/agregar',
        icon: <Inventory2Outlined />,
      },
    ],
  },
  {
    title: 'Compras',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'Nueva Compra',
        path: '/app/compras/nueva',
        icon: <ShoppingCartOutlined />,
      },
      {
        title: 'Historial de Compras',
        path: '/app/compras/historial',
        icon: <Inventory2Outlined />,
      },
    ],
  },
  {
    title: 'Notificaciones',
    path: '/app/notificaciones',
    icon: <NotificationsOutlined />,
  },
]

export default sidebarConfig
