import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Paper, alpha, Select, MenuItem } from '@mui/material';

const AnalyticsChart = ({ data }) => {
    // Mocking monthly data as the current API might only return the current month summary
    // In a real scenario, we'd fetch a series, but for this redesign let's make it look like the image
    const series = [
        {
            name: 'Entradas',
            data: [35, 45, 32, 38, 42, 30, 48, 28] // Mock data representing the bars in the image
        },
        {
            name: 'Saídas',
            data: [25, 30, 28, 45, 35, 25, 40, 20]
        }
    ];

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            fontFamily: 'Inter, sans-serif',
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
                borderRadius: 4,
                endingShape: 'rounded'
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: ['#5c67f2', '#4ade80'],
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#64748b', fontWeight: 500 }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#64748b', fontWeight: 500 },
                formatter: (val) => `${val}K`
            }
        },
        grid: {
            borderColor: alpha('#fff', 0.05),
            strokeDashArray: 4,
            yaxis: { lines: { show: true } }
        },
        fill: { opacity: 1 },
        legend: {
            show: false
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => `$ ${val}.000`
            }
        }
    };

    return (
        <Paper sx={{ p: 4, bgcolor: '#1a1a2e', borderRadius: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>Análise</Typography>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#5c67f2' }} />
                        <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 600 }}>Entradas</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4ade80' }} />
                        <Typography variant="caption" sx={{ color: 'grey.500', fontWeight: 600 }}>Saídas</Typography>
                    </Box>
                    <Select
                        value="2020"
                        size="small"
                        sx={{
                            height: 32,
                            bgcolor: alpha('#fff', 0.05),
                            color: 'white',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            fontSize: '0.8rem',
                            fontWeight: 700
                        }}
                    >
                        <MenuItem value="2020">2020</MenuItem>
                        <MenuItem value="2021">2021</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Box sx={{ width: '100%', height: 350 }}>
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            </Box>
        </Paper>
    );
};

export default AnalyticsChart;
