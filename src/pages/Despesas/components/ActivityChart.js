import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Paper, alpha, Select, MenuItem, Stack, Button, Grid } from '@mui/material';

const ActivityChart = ({ data }) => {
    // Use real data from summary if available, otherwise mock percentages from the image
    const categories = data?.expensesByCategory || [];
    const series = categories.length > 0
        ? categories.map(c => Math.round((c.total / (data.summary.expense || 1)) * 100))
        : [55, 20, 25]; // Mock [Daily payment, Hobby, Others]

    const labels = categories.length > 0
        ? categories.map(c => {
            const cat = c.category;
            if (typeof cat === 'object' && cat !== null) {
                return cat.name || cat.description || 'Outros';
            }
            return String(cat || 'Outros');
        })
        : ['Pagamento Diário', 'Lazer', 'Outros'];

    const colors = categories.length > 0
        ? categories.map(c => c.color || '#5c67f2')
        : ['#5c67f2', '#4ade80', '#fbbf24'];

    const options = {
        chart: {
            type: 'donut',
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10,
                donut: {
                    size: '80%',
                    labels: {
                        show: true,
                        name: { show: false },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 800,
                            color: 'white',
                            offsetY: -10,
                            formatter: () => '75%' // Dummy "overall" progress if needed, or series total
                        },
                        total: {
                            show: true,
                            label: '',
                            formatter: () => '75%'
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        colors: colors,
        legend: { show: false },
        stroke: { show: false },
        tooltip: {
            theme: 'dark',
            y: { formatter: (val) => `${val}%` }
        }
    };

    return (
        <Paper sx={{ p: 4, bgcolor: '#1a1a2e', borderRadius: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>Atividade</Typography>
                <Select
                    value="Month"
                    size="small"
                    sx={{
                        height: 28,
                        bgcolor: alpha('#fff', 0.05),
                        color: 'white',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        fontSize: '0.75rem',
                        fontWeight: 700
                    }}
                >
                    <MenuItem value="Month">Mês</MenuItem>
                    <MenuItem value="Year">Ano</MenuItem>
                </Select>
            </Box>

            <Box sx={{ height: 200, mt: -2 }}>
                <ReactApexChart options={options} series={series} type="donut" height={300} />
            </Box>

            <Stack spacing={2} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    {labels.slice(0, 2).map((label, idx) => (
                        <Grid item xs={6} key={label}>
                            <Stack spacing={0.5}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors[idx] }} />
                                    <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 600 }}>
                                        {typeof label === 'string' ? label : (label?.name || label?.description || 'Outros')}
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 800 }}>
                                    {String(series[idx])}%
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                        mt: 2,
                        color: 'white',
                        borderColor: alpha('#fff', 0.1),
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '0.85rem'
                    }}
                >
                    Ver todas as atividades →
                </Button>
            </Stack>
        </Paper>
    );
};

export default ActivityChart;
