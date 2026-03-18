import React, { useContext } from 'react';
import { Box, Stack, Typography, IconButton, Avatar, Switch, alpha, useTheme } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppstoreOutlined,
    BarChartOutlined,
    WalletOutlined,
    UserOutlined,
    SettingOutlined,
    SafetyCertificateOutlined,
    QuestionCircleOutlined,
    BulbOutlined,
    BankOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { ColorModeContext } from 'context/ColorModeContext';
import { useAuth } from 'hooks/auth';
import logoImg from '../../../assets/images/logo/cash_money_logo.png';

const MenuItem = ({ icon: Icon, label, to, active }) => (
    <Stack
        component={RouterLink}
        to={to}
        direction="row"
        spacing={2.5}
        alignItems="center"
        sx={{
            px: 3,
            py: 1.5,
            borderRadius: 4,
            cursor: 'pointer',
            textDecoration: 'none',
            color: active ? 'white' : 'grey.500',
            bgcolor: active ? '#5c67f2' : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
                bgcolor: active ? '#5c67f2' : alpha('#fff', 0.05),
                color: 'white'
            }
        }}
    >
        <Icon style={{ fontSize: 20 }} />
        <Typography variant="body1" sx={{ fontWeight: active ? 700 : 500, fontSize: '0.95rem' }}>
            {label}
        </Typography>
    </Stack>
);

const Sidebar = () => {
    const theme = useTheme();
    const location = useLocation();
    const { toggleColorMode } = useContext(ColorModeContext);
    const { signOut, user } = useAuth();
    const isDark = theme.palette.mode === 'dark';

    const menuItems = [
        { icon: AppstoreOutlined, label: 'Dashboard', to: '/despesas' },
        { icon: BarChartOutlined, label: 'Transações', to: '/transacoes' },
        { icon: WalletOutlined, label: 'Minha Carteira', to: '#' },
        { icon: UserOutlined, label: 'Contas', to: '#' },
        { icon: SettingOutlined, label: 'Configurações', to: '#' }
    ];

    const secondaryMenuItems = [
        { icon: SafetyCertificateOutlined, label: 'Segurança', to: '#' },
        { icon: QuestionCircleOutlined, label: 'Central de Ajuda', to: '#' }
    ];

    return (
        <Box sx={{
            width: 280,
            height: '100vh',
            bgcolor: '#0d0d1b',
            borderRight: '1px solid',
            borderColor: alpha('#fff', 0.05),
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            position: 'sticky',
            top: 0
        }}>
            {/* Logo */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 8, px: 1 }}>
                <Box
                    component="img"
                    src={logoImg}
                    alt="CashMoney Logo"
                    sx={{ width: 68, height: 68, objectFit: 'contain' }}
                />
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', letterSpacing: -1 }}>
                    CashMoney
                </Typography>
            </Stack>

            {/* Main Menu */}
            <Stack spacing={1} sx={{ mb: 6 }}>
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        to={item.to}
                        active={location.pathname === item.to}
                    />
                ))}
            </Stack>

            {/* Secondary Menu */}
            <Stack spacing={1} sx={{ mb: 'auto' }}>
                {secondaryMenuItems.map((item) => (
                    <MenuItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        to={item.to}
                        active={false}
                    />
                ))}

                {/* Dark Mode Toggle */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ px: 3, py: 1.5, color: 'grey.500' }}
                >
                    <Stack direction="row" spacing={2.5} alignItems="center">
                        <BulbOutlined style={{ fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                            Modo Escuro
                        </Typography>
                    </Stack>
                    <Switch
                        checked={isDark}
                        onChange={toggleColorMode}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#5c67f2' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#5c67f2' }
                        }}
                    />
                </Stack>

                {/* Link for Controle Despesas - AS REQUESTED BY USER */}
                <Stack
                    component={RouterLink}
                    to="/controle-despesas"
                    direction="row"
                    spacing={2.5}
                    alignItems="center"
                    sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 4,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'grey.500',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: alpha('#fff', 0.05),
                            color: 'white'
                        }
                    }}
                >
                    <BankOutlined style={{ fontSize: 20 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                        Controle Despesas
                    </Typography>
                </Stack>
            </Stack>

            {/* User Profile */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 'auto', pt: 4, px: 1 }}>
                <Avatar
                    src={user?.avatar}
                    sx={{ width: 44, height: 44, border: '2px solid', borderColor: '#5c67f2' }}
                >
                    {user?.name?.charAt(0) || 'A'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" noWrap sx={{ fontWeight: 700, color: 'white', lineHeight: 1.1 }}>
                        {user?.name || 'Ali Riaz'}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: 'grey.600', display: 'block' }}>
                        {typeof user?.role === 'object' ? user?.role?.name : (user?.role || 'Web Developer')}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={signOut} sx={{ color: 'grey.500', '&:hover': { color: '#f87171' } }}>
                    <LogoutOutlined />
                </IconButton>
            </Stack>
        </Box>
    );
};

export default Sidebar;
