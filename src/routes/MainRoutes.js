import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import Dashboard from 'pages/Dashboard';
import Usuarios from 'pages/Usuarios';
import AdminRolesPermissions from 'pages/Roles/index';
import Logs from 'pages/Logs';
import DadosDiscord from 'pages/Dados-discord';
import Despesas from 'pages/Despesas';

const MainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'admin/usuarios', element: <Usuarios /> },
      { path: 'admin/permissoes', element: <AdminRolesPermissions /> },
      { path: 'admin/logs', element: <Logs /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
      {
        path: '/dados-discord',
        element: <DadosDiscord />,
      },
      {
        path: '/despesas',
        element: <Despesas />,
      },
    ],
  },
];

export default MainRoutes;
