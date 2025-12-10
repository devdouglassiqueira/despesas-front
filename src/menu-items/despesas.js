import { DollarOutlined, BankOutlined } from '@ant-design/icons';

const Despesas = {
  id: 'group-despesas',
  title: 'Despesas',
  type: 'group',
  children: [
    {
      id: 'despesas',
      title: 'Despesas',
      type: 'item',
      url: '/despesas',
      icon: DollarOutlined,
      breadcrumbs: false,
    },
    {
      id: 'controle-despesas',
      title: 'Controle Despesas',
      type: 'item',
      url: '/controle-despesas',
      icon: BankOutlined,
      breadcrumbs: false,
    },
  ],
};

export default Despesas;
