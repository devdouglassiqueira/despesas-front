import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { api } from 'services/api';

const TransactionForm = ({ open, onClose, onSuccess, transaction }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        categoryId: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        notes: ''
    });

    useEffect(() => {
        if (open) {
            fetchDependencies();
            if (transaction) {
                setFormData({
                    ...transaction,
                    amount: transaction.amount,
                    date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    categoryId: transaction.category?.id || '',
                    accountId: transaction.account?.id || ''
                });
            } else {
                // Reset form
                setFormData({
                    description: '',
                    amount: '',
                    type: 'expense', // default
                    categoryId: '',
                    accountId: '',
                    date: new Date().toISOString().split('T')[0],
                    paymentMethod: '',
                    notes: ''
                });
            }
        }
    }, [open, transaction]);

    const fetchDependencies = async () => {
        try {
            const [catRes, accRes] = await Promise.all([
                api.get('/categories'),
                api.get('/accounts')
            ]);
            setCategories(catRes.data);
            setAccounts(accRes.data);
        } catch (error) {
            console.error('Error fetching dependencies', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e, newType) => {
        if (newType) {
            setFormData(prev => ({ ...prev, type: newType }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                categoryId: Number(formData.categoryId),
                accountId: Number(formData.accountId)
            };

            if (transaction?.id) {
                await api.patch(`/transactions/${transaction.id}`, payload);
            } else {
                await api.post('/transactions', payload);
            }

            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving transaction', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            value={formData.type}
                            exclusive
                            onChange={handleTypeChange}
                            fullWidth
                            color="primary"
                        >
                            <ToggleButton value="income" color="success">Receita</ToggleButton>
                            <ToggleButton value="expense" color="error">Despesa</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            name="description"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Valor"
                            name="amount"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Data"
                            name="date"
                            type="date"
                            fullWidth
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Categoria"
                            name="categoryId"
                            fullWidth
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Conta"
                            name="accountId"
                            fullWidth
                            value={formData.accountId}
                            onChange={handleChange}
                        >
                            {accounts.map(acc => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Notas"
                            name="notes"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.notes || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
                <LoadingButton loading={loading} onClick={handleSubmit} variant="contained">
                    Salvar
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

TransactionForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    transaction: PropTypes.object
};

export default TransactionForm;
