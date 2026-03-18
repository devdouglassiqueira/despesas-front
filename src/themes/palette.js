// material-ui
import { createTheme } from '@mui/material/styles';

// Dark crypto dashboard inspired palette
const Palette = (_mode) => {
  // Force dark mode for this crypto dashboard theme

  return createTheme({
    palette: {
      mode: 'dark',
      common: {
        black: '#000000',
        white: '#ffffff',
      },
      primary: {
        lighter: '#4FD1C5',
        light: '#38B2AC',
        main: '#00C9A7', // Teal/cyan accent
        dark: '#00A896',
        darker: '#008B7B',
        contrastText: '#ffffff',
      },
      secondary: {
        lighter: '#F687B3',
        light: '#ED64A6',
        main: '#E91E8C', // Pink/magenta accent
        dark: '#D91A80',
        darker: '#B91669',
        contrastText: '#ffffff',
      },
      error: {
        light: '#FC8181',
        main: '#F56565',
        dark: '#E53E3E',
        contrastText: '#ffffff',
      },
      warning: {
        light: '#F6E05E',
        main: '#ECC94B',
        dark: '#D69E2E',
        contrastText: '#1a1a2e',
      },
      success: {
        light: '#68D391',
        main: '#48BB78',
        dark: '#38A169',
        contrastText: '#ffffff',
      },
      info: {
        light: '#63B3ED',
        main: '#4299E1',
        dark: '#3182CE',
        contrastText: '#ffffff',
      },
      text: {
        primary: '#E2E8F0',
        secondary: '#A0AEC0',
        disabled: '#718096',
      },
      action: {
        disabled: '#4A5568',
        active: '#00C9A7',
        hover: 'rgba(0, 201, 167, 0.08)',
        selected: 'rgba(0, 201, 167, 0.16)',
      },
      divider: '#2D3748',
      background: {
        paper: '#1A1A2E', // Card background - dark navy
        default: '#0F0F23', // Main background - darker navy
      },
      grey: {
        50: '#F7FAFC',
        100: '#EDF2F7',
        200: '#E2E8F0',
        300: '#CBD5E0',
        400: '#A0AEC0',
        500: '#718096',
        600: '#4A5568',
        700: '#2D3748',
        800: '#1A202C',
        900: '#171923',
      },
    },
  });
};

export default Palette;
