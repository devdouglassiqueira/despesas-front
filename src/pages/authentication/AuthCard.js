import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'components/sistema/MainCard';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const AuthCard = ({ children, ...other }) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.85) !important', // Fundo preto com leve transparência
      backdropFilter: 'blur(10px)', // Mantém o desfoque para legibilidade
      // Garante que o texto dentro do card seja branco
      '.MuiTypography-root, .MuiInputLabel-root, .MuiInputBase-input': {
        color: '#f5f5f5 !important',
      },
      // Altera o botão primário para cinza com texto branco
      '.MuiButton-containedPrimary': {
        backgroundColor: '#424242 !important', // Um cinza escuro (grey[800])
        color: '#ffffff !important',
        '&:hover': {
          backgroundColor: '#212121 !important', // Um cinza mais escuro no hover
        },
      },
      // Altera a cor do ícone de "olho" da senha para cinza/branco
      // O seletor duplo garante que tanto o botão quanto o ícone SVG interno recebam a cor.
      '.MuiInputAdornment .MuiIconButton-root, .MuiInputAdornment .MuiIconButton-root svg':
        {
          color: '#f5f5f5 !important', // Branco suave, igual ao resto do texto
        },
      // Adiciona um fundo sutil aos campos de texto para destacá-los
      '.MuiOutlinedInput-root': {
        backgroundColor: 'rgba(118, 118, 118, 0.76) !important', // Branco com 5% de opacidade
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(7, 7, 7, 0.15) !important', // Borda mais clara no hover
        },
      },
      // Sobrescreve o fundo azul do preenchimento automático do navegador
      'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
        {
          '-webkit-box-shadow':
            '0 0 0 30px rgba(118, 118, 118, 0.76) inset !important',
          '-webkit-text-fill-color': '#f5f5f5 !important',
        },
    }}
    content={false}
    {...other}
    border={false}
    boxShadow
  >
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
  </MainCard>
);

AuthCard.propTypes = {
  children: PropTypes.node,
};

export default AuthCard;
