import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { api } from 'services/api';

import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';

const TransacoesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [filters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchData = async () => {
    try {
      const { month, year } = filters;
      const [transRes, catRes, accRes] = await Promise.all([
        api.get('/transactions', { params: { month, year } }),
        api.get('/categories'),
        api.get('/accounts'),
      ]);
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
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>
          Gerenciar Transações
        </Typography>
      </Stack>

      {/* List */}
      <TransactionList
        transactions={transactions}
        onEdit={handleEditClick}
        showFilters={true}
        onAdd={() => setFormOpen(true)}
      />

      {/* Modals */}
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
    </Box>
  );
};

export default TransacoesPage;
