import admin from './admin';
import despesas from './despesas';

const menuItems = {
  items: [admin, despesas].filter(
    (item) => Array.isArray(item.children) && item.children.length > 0,
  ),
};

export default menuItems;
