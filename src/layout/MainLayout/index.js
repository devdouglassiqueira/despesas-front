import { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  AppBar,
  alpha,
  Box,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import { GlobalStyles } from '@mui/system';

// project import
import { ColorModeContext } from 'context/ColorModeContext';
import { useAuth } from 'hooks/auth'; // 1. Importar o hook de autenticação

// assets
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
// import backgroundImage from 'assets/images/logo/Background.png'; // Removed background image per design request

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const { signOut } = useAuth(); // 2. Obter a função de logout
  const isLight = theme.palette.mode === 'light';

  // Força o tema escuro se estiver claro
  useEffect(() => {
    if (isLight) {
      toggleColorMode();
    }
  }, [isLight, toggleColorMode]);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(); // 3. Chamar a função de logout diretamente
    handleMenuClose();
  };

  return (
    <>
      <GlobalStyles
        styles={{
          '.MuiPaper-root': {
            backgroundImage: 'none !important',
          },
        }}
      />
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          // Cinza escuro com alta opacidade
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)', // Efeito de desfoque para melhor legibilidade
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            component={RouterLink}
            to="/dashboard"
            aria-label="go to dashboard"
            sx={{ color: 'text.primary', mr: 2 }}
          >
            <HomeOutlined />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/despesas"
              sx={{ color: 'text.primary' }}
            >
              Despesas
            </Button>
            <Button
              component={RouterLink}
              to="/controle-despesas"
              sx={{ color: 'text.primary' }}
            >
              Controle Despesas
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            aria-label="user profile"
            onClick={handleMenuClick}
            sx={{ color: 'text.primary' }}
          >
            <UserOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MENU DO USUÁRIO */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={handleMenuClose}
          component={RouterLink}
          to="/admin/usuarios"
        >
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1">Usuários</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body1">Sair</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          paddingTop: '64px',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
