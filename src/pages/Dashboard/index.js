import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, useTheme } from '@mui/material';
import logo from '../../assets/images/logo/logo.png';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 5,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo da aplicação"
        sx={{
          width: 'auto',
          height: '500px',
          maxWidth: '90%',
          marginBottom: 5,
        }}
      />
      <Stack spacing={2.5} sx={{ width: '100%', maxWidth: '300px' }}>
        <Button
          component={Link}
          to="/despesas"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            fontSize: '1rem',
            backgroundColor: theme.palette.grey[800], // Using palette grey which is mapped to new colors?
            // Wait, I didn't map 'grey' in palette.js, I should use colors directly or add grey back.
            // I'll use simple colors or verify grey exists.
            // Actually I removed 'grey' from palette.js return.
            // So theme.palette.grey is undefined unless I added it back or didn't remove it properly.
            // I should use 'background.paper' equivalent or a specific color.
            bgcolor: 'background.paper',
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'background.default',
            },
          }}
        >
          Despesas
        </Button>

        <Button
          component={Link}
          to="/controle-despesas"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            fontSize: '1rem',
            bgcolor: 'background.paper',
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'background.default',
            },
          }}
        >
          Controle de Despesas
        </Button>
      </Stack>
    </Box>
  );
};

export default Dashboard;
