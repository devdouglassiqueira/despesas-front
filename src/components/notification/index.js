import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  position: {
    x: 'right',
    y: 'top',
  },
  // Define cores customizadas para os tipos de notificação
  types: [
    {
      type: 'success',
      background: '#28a745', // Green
      icon: {
        className: 'notyf__icon--success',
        tagName: 'i',
        color: '#ffffff',
      },
    },
    {
      type: 'error',
      background: '#dc3545', // Red
      icon: {
        className: 'notyf__icon--error',
        tagName: 'i',
        color: '#ffffff',
      },
    },
  ],
});

export const notification = ({ message, type }) => {
  switch (type) {
    case 'success':
      notyf.success(message);
      break;
    case 'error':
      notyf.error(message);
      break;
    case 'warning':
      notyf.open({
        type: 'warning',
        message: message,
        background: 'orange',
        icon: false,
      });
      break;
    default:
      console.warn('Tipo de notificação inválido!');
  }
};
