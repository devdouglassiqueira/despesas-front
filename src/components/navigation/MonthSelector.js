import PropTypes from 'prop-types';
import { Stack, Typography, IconButton, Box } from '@mui/material';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const MonthSelector = ({ month, year, onChange }) => {
    const handlePrev = () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        onChange(newMonth, newYear);
    };

    const handleNext = () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        onChange(newMonth, newYear);
    };

    const monthName = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <IconButton onClick={handlePrev} size="small">
                <LeftOutlined />
            </IconButton>
            <Box sx={{ minWidth: 150, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {capitalizedMonth}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    {year}
                </Typography>
            </Box>
            <IconButton onClick={handleNext} size="small">
                <RightOutlined />
            </IconButton>
        </Stack>
    );
};

MonthSelector.propTypes = {
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MonthSelector;
