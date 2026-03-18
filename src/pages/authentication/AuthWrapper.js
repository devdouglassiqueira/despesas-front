import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import AuthCard from './AuthCard';
import backgroundImage from 'assets/images/logo/Background.png'; // Importa a imagem de fundo

const AuthWrapper = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      // Flexbox para centralizar o conteúdo
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* O AuthCard agora é centralizado pelo Box pai */}
    <AuthCard>{children}</AuthCard>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthWrapper;
