import { DiscordOutlined } from '@ant-design/icons';

const dados = {
  id: 'group-dados',
  title: 'Dados',
  type: 'group',
  children: [
    {
      id: 'dados-discord',
      title: 'Dados Discord',
      type: 'item',
      url: '/dados-discord',
      icon: DiscordOutlined,
      breadcrumbs: false,
    },
  ],
};

export default dados;
