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
      {
        title: 'Permisos',
        path: '/app/permisos',
        icon: <SupervisorAccountOutlined />,
      },
    ],
  },
  {
    title: 'Gestión de Clientes',
    icon: <PersonOutlined />,
    children: [
      {
        title: 'Lista de Clientes',
        path: '/app/cliente',
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
        path: '/app/ventas',
        icon: <ShoppingCartOutlined />,
      },
      {
        title: 'Historial de Ventas',
        path: '/app/historial_ventas',
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
        title: 'Agregar laboratorio',
        path: '/app/laboratorio',
        icon: <Inventory2Outlined />,
      },
      {
        title: 'Agregar proveedor',
        path: '/app/proveedor',
        icon: <Inventory2Outlined />,
      },
      {
        title: 'Agregar tipo documento',
        path: '/app/tipodocumento',
        icon: <Inventory2Outlined />,
      }
    ],
  },
  {
    title: 'Compras',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        title: 'Nueva Compra',
        path: '/app/compras',
        icon: <ShoppingCartOutlined />,
      },
      {
        title: 'Historial de Compras',
        path: '/app/historial_compras',
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
