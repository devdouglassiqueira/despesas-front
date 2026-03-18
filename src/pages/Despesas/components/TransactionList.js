import React from 'react';
import {
  Typography,
  Paper,
  Stack,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  InputBase,
  IconButton,
  Button,
} from '@mui/material';
import { SearchOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';

const TransactionList = ({ transactions, onEdit, showFilters = false, onAdd }) => {
  return (
    <Paper sx={{ p: 4, bgcolor: '#1a1a2e', borderRadius: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
          Transações
        </Typography>
        {showFilters && (
          <Stack direction="row" spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: '2px 10px',
                display: 'flex',
                alignItems: 'center',
                width: 200,
                bgcolor: alpha('#fff', 0.03),
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#fff', 0.05),
              }}
            >
              <IconButton size="small" sx={{ p: '4px', color: 'grey.500' }}>
                <SearchOutlined />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1, color: 'white', fontSize: '0.75rem' }}
                placeholder="Buscar transações..."
              />
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: '2px 10px',
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha('#fff', 0.03),
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#fff', 0.05),
                cursor: 'pointer',
              }}
            >
              <CalendarOutlined style={{ color: '#64748b', marginRight: 8 }} />
              <Typography
                variant="caption"
                sx={{ color: 'grey.500', fontWeight: 600 }}
              >
                10 Mai - 20 Mai
              </Typography>
            </Paper>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAdd?.()}
              startIcon={<PlusOutlined />}
              sx={{
                bgcolor: '#5c67f2',
                color: 'white',
                borderRadius: 3,
                p: '10px 20px',
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { bgcolor: '#4a53cc' },
              }}
            >
              Nova Transação
            </Button>
          </Stack>
        )}
      </Stack>

      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  borderBottom: `1px solid ${alpha('#fff', 0.05)}`,
                  color: 'grey.500',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  py: 2,
                },
              }}
            >
              <TableCell>Nome</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.slice(0, 15).map((t) => (
              <TableRow
                key={t.id}
                onClick={() => onEdit(t)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: alpha('#fff', 0.01) },
                  '& td': {
                    borderBottom: `1px solid ${alpha('#fff', 0.03)}`,
                    py: 2.5,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: alpha(t.category?.color || '#5c67f2', 0.1),
                        color: t.category?.color || '#5c67f2',
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                      }}
                    >
                      {typeof t.description === 'string'
                        ? t.description.charAt(0)
                        : 'T'}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: 'white', fontWeight: 600 }}
                    >
                      {typeof t.description === 'string'
                        ? t.description
                        : t.description?.name ||
                        t.description?.description ||
                        'Sem descrição'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    {new Date(t.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: 'white', fontWeight: 700 }}
                  >
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(t.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.type === 'income' ? 'Entrada' : 'Concluído'}
                    size="small"
                    sx={{
                      bgcolor: alpha(
                        t.type === 'income' ? '#4ade80' : '#4ade80',
                        0.1,
                      ),
                      color: t.type === 'income' ? '#4ade80' : '#4ade80',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 24,
                      borderRadius: 1.5,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'grey.500' }}>
                    Nenhuma transação encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionList;
