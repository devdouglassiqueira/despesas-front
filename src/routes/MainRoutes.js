import { Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import DespesasLayout from 'layout/DespesasLayout';
import Usuarios from 'pages/Usuarios';
import AdminRolesPermissions from 'pages/Roles/index';
import Logs from 'pages/Logs';
import Despesas from 'pages/Despesas';
import TransacoesPage from 'pages/Despesas/Transacoes';
import ControleDespesas from 'pages/Controle-Despesas';

const MainRoutes = [
  {
    path: '/',
    element: <DespesasLayout />,
    children: [
      { path: '/', element: <Navigate to="/despesas" replace /> },
      { path: 'despesas', element: <Despesas /> },
      { path: 'transacoes', element: <TransacoesPage /> },
      { path: 'controle-despesas', element: <ControleDespesas /> },
    ]
  },
  {
    path: '/admin',
    element: <MainLayout />,
    children: [
      { path: 'usuarios', element: <Usuarios /> },
      { path: 'permissoes', element: <AdminRolesPermissions /> },
      { path: 'logs', element: <Logs /> },
    ],
  },
  { path: '*', element: <Navigate to="/despesas" replace /> },
];

export default MainRoutes;
