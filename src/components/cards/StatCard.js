import PropTypes from 'prop-types';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import MainCard from 'components/sistema/MainCard';
import { RiseOutlined, FallOutlined, DollarOutlined, WalletOutlined, AreaChartOutlined } from '@ant-design/icons';

const StatCard = ({ title, count, percentage, isLoss, extra, variant }) => {
    const theme = useTheme();

    // Define gradient based on variant
    const getGradient = () => {
        switch (variant) {
            case 'income':
                return theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #065f46 0%, #10b981 100%)'
                    : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
            case 'expense':
                return theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)'
                    : 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)';
            case 'balance':
                return theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                    : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
            default:
                return 'none';
        }
    };

    const getIcon = () => {
        switch (variant) {
            case 'income': return <WalletOutlined style={{ fontSize: '2rem', opacity: 0.7 }} />;
            case 'expense': return <DollarOutlined style={{ fontSize: '2rem', opacity: 0.7 }} />;
            case 'balance': return <AreaChartOutlined style={{ fontSize: '2rem', opacity: 0.7 }} />;
            default: return null;
        }
    };

    return (
        <MainCard
            contentSX={{ p: 2.5 }}
            sx={{
                background: getGradient(),
                border: 'none',
                boxShadow: theme.shadows[2]
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.5}>
                    <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {count}
                    </Typography>
                    {extra && (
                        <Typography variant="caption" color="textSecondary">
                            {extra}
                        </Typography>
                    )}
                </Stack>
                <Box sx={{ color: 'text.secondary' }}>
                    {getIcon()}
                </Box>
            </Stack>
            {percentage !== undefined && percentage !== 0 && (
                <Box
                    sx={{
                        mt: 1.5,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: isLoss ? 'error.lighter' : 'success.lighter',
                        color: isLoss ? 'error.main' : 'success.main',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}
                >
                    {isLoss ? <FallOutlined style={{ fontSize: '0.75rem' }} /> : <RiseOutlined style={{ fontSize: '0.75rem' }} />}
                    <Typography variant="caption" color="inherit" sx={{ fontWeight: 600 }}>
                        {percentage}%
                    </Typography>
                </Box>
            )}
        </MainCard>
    );
};

StatCard.propTypes = {
    title: PropTypes.string,
    count: PropTypes.string,
    percentage: PropTypes.number,
    isLoss: PropTypes.bool,
    extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    variant: PropTypes.oneOf(['income', 'expense', 'balance'])
};

export default StatCard;
