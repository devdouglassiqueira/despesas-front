// ==============================|| OVERRIDES - INPUT LABEL ||============================== //

import { colors } from 'styles/colors';

export default function InputLabel() {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.gray[500],
        },
        outlined: {
          lineHeight: '0.8em',
          '&.MuiInputLabel-sizeSmall': {
            lineHeight: '1em',
          },
          '&.MuiInputLabel-shrink': {
            background: 'transparent',
            padding: '0 8px',
            marginLeft: -6,
            lineHeight: '1.4375em',
          },
        },
      },
    },
  };
}
