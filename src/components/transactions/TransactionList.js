import PropTypes from 'prop-types';
import {
    Stack,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Box
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Helper for currency
const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

// Helper for date formatting
const formatDayHeader = (dateString) => {
    if (!dateString) return 'Sem Data';
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Hoje';
    if (d.toDateString() === yesterday.toDateString()) return 'Ontem';

    const day = d.getDate();
    const month = d.toLocaleString('pt-BR', { month: 'long' });
    return `${day} de ${month}`;
};

// Category colors fallback
const getCategoryColor = (category) => {
    if (category?.color) return category.color;
    const colors = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];
    const hash = (category?.name || 'default').charCodeAt(0) % colors.length;
    return colors[hash];
};

const TransactionList = ({ transactions, onEdit, onDelete }) => {
    // Sort transactions by date (descending)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by date
    const groups = sortedTransactions.reduce((acc, curr) => {
        const dateKey = curr.date ? new Date(curr.date).toDateString() : 'Sem Data';
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(curr);
        return acc;
    }, {});

    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    if (transactions.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Nenhuma transação encontrada.
                </Typography>
            </Box>
        );
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
            {sortedDates.map((dateKey) => (
                <Box key={dateKey}>
                    {/* Date Header */}
                    <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'capitalize' }}>
                            {formatDayHeader(groups[dateKey][0].date)}
                        </Typography>
                    </Box>

                    {/* Transactions for that date */}
                    {groups[dateKey].map((row, index) => (
                        <Box key={row.id}>
                            <ListItem
                                sx={{
                                    py: 1.5,
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                secondaryAction={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                color: row.type === 'expense' ? 'error.main' : 'success.main',
                                                mr: 1
                                            }}
                                        >
                                            {row.type === 'expense' ? '- ' : ''}
                                            {formatCurrency(Number(row.amount))}
                                        </Typography>
                                        {onEdit && (
                                            <IconButton size="small" onClick={() => onEdit(row)} sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
                                                <EditOutlined style={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton size="small" color="error" onClick={() => onDelete(row)} sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}>
                                                <DeleteOutlined style={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                    </Stack>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: getCategoryColor(row.category),
                                            width: 40,
                                            height: 40,
                                            fontSize: 14,
                                            fontWeight: 600
                                        }}
                                    >
                                        {(row.category?.name || 'S')[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {row.description}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="textSecondary">
                                            {row.account?.name || 'Conta não definida'}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < groups[dateKey].length - 1 && <Divider variant="inset" component="li" />}
                        </Box>
                    ))}
                </Box>
            ))}
        </List>
    );
};

TransactionList.propTypes = {
    transactions: PropTypes.array,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default TransactionList;
