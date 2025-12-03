import { DiscordOutlined } from '@ant-design/icons';

const despesas = {
  id: 'group-despesas',
  title: 'Despesas',
  type: 'group',
  children: [
    {
      id: 'despesas',
      title: 'Despesas',
      type: 'item',
      url: '/despesas',
      icon: DiscordOutlined,
      breadcrumbs: false,
    },
  ],
};

export default despesas;
