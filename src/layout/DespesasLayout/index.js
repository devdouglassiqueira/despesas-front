import React from 'react';
import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from 'pages/Despesas/components/Sidebar';

const DespesasLayout = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0d0d1b' }}>
            <Sidebar />
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                overflow: 'auto',
                bgcolor: theme.palette.mode === 'dark' ? '#0d0d1b' : '#f4f6f8'
            }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default DespesasLayout;
