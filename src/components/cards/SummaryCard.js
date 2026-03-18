import PropTypes from 'prop-types';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import MainCard from 'components/sistema/MainCard';

const SummaryCard = ({ title, value, color, icon }) => {
    const theme = useTheme();

    return (
        <MainCard
            contentSX={{ p: 2.5 }}
            sx={{
                border: 'none',
                boxShadow: theme.shadows[1]
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                    <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'lowercase' }}>
                        {title}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: color || 'text.primary'
                        }}
                    >
                        {value}
                    </Typography>
                </Stack>
                {icon && (
                    <Box sx={{ color: 'text.disabled', fontSize: 24 }}>
                        {icon}
                    </Box>
                )}
            </Stack>
        </MainCard>
    );
};

SummaryCard.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.node
};

export default SummaryCard;
