import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import { ColorModeContext } from 'context/ColorModeContext';

const ThemeMode = () => {
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                color="secondary"
                variant="light"
                sx={{ color: 'text.primary', bgcolor: theme.palette.mode === 'dark' ? 'grey.100' : 'grey.200' }}
                onClick={toggleColorMode}
                aria-label="theme-switcher"
            >
                {theme.palette.mode === 'dark' ? (
                    <BulbFilled style={{ fontSize: '1.15rem' }} />
                ) : (
                    <BulbOutlined style={{ fontSize: '1.15rem' }} />
                )}
            </IconButton>
        </Box>
    );
};

export default ThemeMode;
