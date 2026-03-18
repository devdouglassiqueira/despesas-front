import PropTypes from 'prop-types';
import {
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CategoryBadge from 'components/data-display/CategoryBadge';

// Helper for date
const formatDay = (dateString, currentYear) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('pt-BR', { month: 'short' });
    const year = d.getFullYear();
    const weekday = d.toLocaleString('pt-BR', { weekday: 'short' }); // Add weekday

    return `${day} ${month}${year !== currentYear ? ' ' + year : ''} (${weekday})`;
};

// Helper for currency
const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    // 1. Sort transactions by date (descending)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 2. Group by date
    const groups = sortedTransactions.reduce((acc, curr) => {
        const dateKey = curr.date ? new Date(curr.date).toDateString() : 'Sem Data'; // Use simple date key
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(curr);
        return acc;
    }, {});

    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a)); // Descending order of groups

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell>Conta</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedDates.map((dateKey) => (
                        <>
                            {/* Header Row for Date Group */}
                            <TableRow key={`header-${dateKey}`} sx={{ bgcolor: 'secondary.lighter' }}>
                                <TableCell colSpan={5} sx={{ py: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {formatDay(groups[dateKey][0].date, new Date().getFullYear())}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            {/* Transactions for that date */}
                            {groups[dateKey].map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell>
                                        <Stack spacing={0}>
                                            <Typography variant="subtitle1">{row.description}</Typography>
                                            {row.notes && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {row.notes}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <CategoryBadge
                                            name={row.category?.name || 'Sem Categoria'}
                                            color={row.category?.color || '#9e9e9e'}
                                            icon={row.category?.icon}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{row.account?.name || '-'}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            variant="subtitle1"
                                            color={row.type === 'expense' ? 'error.main' : 'success.main'}
                                        >
                                            {row.type === 'expense' ? '- ' : '+ '}
                                            {formatCurrency(Number(row.amount))}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                            {onEdit && (
                                                <IconButton size="small" onClick={() => onEdit(row)}>
                                                    <EditOutlined />
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                                                    <DeleteOutlined />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ))}
                    {transactions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="body2" sx={{ py: 3 }}>
                                    Nenhuma transação encontrada.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

TransactionTable.propTypes = {
    transactions: PropTypes.array,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default TransactionTable;
