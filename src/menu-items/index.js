import admin from './admin';
import dados from './dados';
import despesas from './despesas';

const menuItems = {
  items: [admin, dados, despesas].filter(
    (item) => Array.isArray(item.children) && item.children.length > 0,
  ),
};

export default menuItems;
