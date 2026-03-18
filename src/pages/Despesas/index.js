import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Stack,
  Button,
  alpha,
  Paper,
} from '@mui/material';

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { useAuth } from 'hooks/auth';
import AnalyticsChart from './components/AnalyticsChart';
import ActivityChart from './components/ActivityChart';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import ImportTransactionsModal from './components/ImportTransactionsModal';

const DespesasPage = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [importFormOpen, setImportFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const { month, year } = filters;
      const [dashboardRes, transRes, catRes, accRes] = await Promise.all([
        api.get('/transactions/dashboard', { params: { month, year } }),
        api.get('/transactions', { params: { month, year } }),
        api.get('/categories'),
        api.get('/accounts'),
      ]);
      setSummary(dashboardRes.data);
      setTransactions(transRes.data);
      setCategories(catRes.data);
      setAccounts(accRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.month, filters.year]);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setEditFormOpen(true);
  };

  return (
    <Box
      sx={{
        p: { xs: 3, lg: 6 },
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {/* Header Content */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}
        >
          Bem-vindo de volta, {user?.name?.split(' ')[0] || ''} 👋
        </Typography>
      </Stack>

      {/* Dashboard Grid */}
      <Grid container spacing={6}>
        {/* Main Column */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={6}>
            {/* Summary Cards */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6}>
              <Paper
                sx={{
                  flex: 1,
                  p: 4,
                  bgcolor: '#1a1a2e',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    bgcolor: alpha('#4ade80', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4ade80',
                  }}
                >
                  <ArrowDownOutlined style={{ fontSize: '24px' }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'grey.500', mb: 0.5 }}
                  >
                    Entradas
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="baseline">
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: 'white' }}
                    >
                      ${(summary?.summary?.income || 0).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#4ade80', fontWeight: 700 }}
                    >
                      +1.29%
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
              <Paper
                sx={{
                  flex: 1,
                  p: 4,
                  bgcolor: '#1a1a2e',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    bgcolor: alpha('#f43f5e', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f43f5e',
                  }}
                >
                  <ArrowUpOutlined style={{ fontSize: '24px' }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'grey.500', mb: 0.5 }}
                  >
                    Saídas
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="baseline">
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, color: 'white' }}
                    >
                      ${(summary?.summary?.expense || 0).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#f43f5e', fontWeight: 700 }}
                    >
                      +1.29%
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Stack>

            {/* Analytics Chart */}
            <AnalyticsChart data={summary} />

            {/* Transactions List */}
            <TransactionList
              transactions={transactions}
              onEdit={handleEditClick}
              onAdd={() => setFormOpen(true)}
            />
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={6}>
            {/* My Card Section Placeholder */}
            <Paper
              sx={{
                p: 4,
                bgcolor: '#1a1a2e',
                borderRadius: 6,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 700, mb: 3 }}
              >
                Meu Cartão
              </Typography>
              <Box
                sx={{
                  height: 200,
                  borderRadius: 5,
                  background:
                    'linear-gradient(135deg, #5c67f2 0%, #3e48cc 100%)',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha('#fff', 0.8) }}
                    >
                      Saldo Atual
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ color: 'white', fontWeight: 800 }}
                    >
                      $
                      {(
                        summary?.summary?.income - summary?.summary?.expense ||
                        0
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 24,
                      bgcolor: alpha('#fff', 0.2),
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', letterSpacing: 4, pt: 1 }}
                  >
                    •••• 1289
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#fff', 0.8), fontSize: '0.85rem' }}
                  >
                    09/25
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#5c67f2',
                    borderRadius: 3,
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  Gerenciar Cartões
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: alpha('#fff', 0.1),
                    borderRadius: 3,
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  Transferir
                </Button>
              </Stack>
            </Paper>

            {/* Activity Chart Section */}
            <ActivityChart data={summary} />
          </Stack>
        </Grid>
      </Grid>

      {/* Modals from original code */}
      <AddTransactionModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchData}
        categories={categories}
        accounts={accounts}
      />

      <EditTransactionModal
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onSuccess={fetchData}
        transaction={selectedTransaction}
        categories={categories}
        accounts={accounts}
      />

      <ImportTransactionsModal
        open={importFormOpen}
        onClose={() => setImportFormOpen(false)}
        onSuccess={fetchData}
        accounts={accounts}
      />
    </Box>
  );
};

export default DespesasPage;
