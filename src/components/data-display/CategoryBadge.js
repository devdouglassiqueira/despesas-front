import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import Icon from '@mui/material/Icon'; // If using Material Icons font, or specific component

// Helper to render icon dynamically if passed as string name
const DynamicIcon = ({ name }) => {
    if (!name) return null;
    return <Icon sx={{ fontSize: '1rem !important' }}>{name}</Icon>;
};

const CategoryBadge = ({ name, color = 'grey.500', icon }) => (
    <Box
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 16, // Pill shape
            bgcolor: `${color}22`, // 22 = ~13% opacity
            color: color,
            border: `1px solid ${color}44`
        }}
    >
        {icon && <DynamicIcon name={icon} />}
        <Typography variant="caption" fontWeight="bold">
            {name}
        </Typography>
    </Box>
);

CategoryBadge.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    icon: PropTypes.string
};

export default CategoryBadge;
