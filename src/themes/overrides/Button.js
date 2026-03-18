import { colors } from 'styles/colors';

// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button() {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: colors.gray[400],
    },
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
        contained: {
          ...disabledStyle,
        },
        outlined: {
          ...disabledStyle,
        },
      },
    },
  };
}
