import {
  DashboardOutlined,
  UserOutlined,
  UnlockOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';

const admin = {
  id: 'group-admin',
  title: 'Admin',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: DashboardOutlined,
      breadcrumbs: false,
    },

    {
      id: 'usuarios',
      title: 'Usuários',
      type: 'item',
      url: '/admin/usuarios',
      icon: UserOutlined,
      breadcrumbs: false,
    },
    {
      id: 'permissoes',
      title: 'Permissões',
      type: 'item',
      url: '/admin/permissoes',
      icon: UnlockOutlined,
      breadcrumbs: false,
    },
    {
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/admin/logs',
      icon: FileSearchOutlined,
      breadcrumbs: false,
    },
  ],
};

export default admin;
