import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    Stack,
    Typography,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    MenuItem,
    alpha
} from '@mui/material';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const EditTransactionModal = ({ open, onClose, onSuccess, transaction, categories, accounts }) => {
    const [type, setType] = useState('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('0,00');
    const [date, setDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open && transaction) {
            setType(transaction.type || 'expense');
            setDescription(transaction.description || '');

            // Format amount backwards
            let val = Number(transaction.amount).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            setAmount(val);

            setDate(transaction.date.split('T')[0]);
            setCategoryId(transaction.category?.id || '');
            setAccountId(transaction.account?.id || '');
            setNotes(transaction.notes || '');
        }
    }, [open, transaction]);

    const handleAmountChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        val = (Number(val) / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        setAmount(val);
    };

    const handleSubmit = async () => {
        try {
            const numericAmount = Number(amount.replace(/\./g, '').replace(',', '.'));

            const payload = {
                description,
                amount: numericAmount,
                type,
                date: `${date}T12:00:00Z`,
                categoryId: Number(categoryId) || undefined,
                accountId: Number(accountId) || undefined,
                notes,
            };

            await api.patch(`/transactions/${transaction.id}`, payload);
            notification({ message: 'Transação editada com sucesso!', type: 'success' });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error editing transaction:', error);
            notification({ message: 'Erro ao editar transação.', type: 'error' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, pb: 2, bgcolor: '#1e293b', color: 'white' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Button onClick={onClose} sx={{ color: 'grey.400', textTransform: 'none' }}>Cancelar</Button>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>Editar Transação</Typography>
                <Button onClick={handleSubmit} variant="text" sx={{ fontWeight: 700, color: '#4ade80', textTransform: 'none' }}>Salvar</Button>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box sx={{
                        overflowX: 'auto', display: 'flex', gap: 1, pb: 1,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: alpha('#fff', 0.2), borderRadius: 3 }
                    }}>
                        {categories.map((cat) => (
                            <Box
                                key={cat.id}
                                onClick={() => setCategoryId(cat.id)}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    bgcolor: categoryId === cat.id ? alpha(cat.color, 0.2) : alpha('#fff', 0.05),
                                    border: '1px solid',
                                    borderColor: categoryId === cat.id ? cat.color : 'transparent',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cat.color }} />
                                <Typography variant="body2" sx={{ fontWeight: categoryId === cat.id ? 600 : 400, color: categoryId === cat.id ? 'white' : 'grey.400' }}>
                                    {cat.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <TextField
                        fullWidth
                        placeholder="Nome"
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', bgcolor: alpha('#fff', 0.05), color: 'white', p: 2, borderRadius: 2 } }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: alpha('#fff', 0.05), borderRadius: 4 }}>
                        <ToggleButtonGroup
                            value={type}
                            exclusive
                            onChange={(e, v) => v && setType(v)}
                            size="small"
                            sx={{ border: 'none', '& .MuiToggleButton-root': { border: 'none', px: 1.5, py: 0.5, borderRadius: 2 } }}
                        >
                            <ToggleButton value="expense" sx={{ bgcolor: type === 'expense' ? '#f87171' : 'transparent', color: type === 'expense' ? 'white' : '#f87171', '&.Mui-selected:hover': { bgcolor: '#ef4444' } }}>
                                <MinusOutlined style={{ marginRight: 4 }} /> Despesa
                            </ToggleButton>
                            <ToggleButton value="income" sx={{ bgcolor: type === 'income' ? '#4ade80' : 'transparent', color: type === 'income' ? 'white' : '#4ade80', '&.Mui-selected:hover': { bgcolor: '#22c55e' } }}>
                                <PlusOutlined style={{ marginRight: 4 }} /> Receita
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Box sx={{ flex: 1, textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ color: 'grey.400' }}>R$</Typography>
                            <TextField
                                variant="standard"
                                value={amount}
                                onChange={handleAmountChange}
                                InputProps={{ disableUnderline: true, sx: { fontSize: '1.5rem', fontWeight: 700, color: 'white', textAlign: 'right' }, style: { textAlign: 'right' } }}
                                sx={{ ml: 1, width: '100px', '& input': { color: 'white', textAlign: 'right' } }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: alpha('#fff', 0.05), borderRadius: 4 }}>
                        <Typography variant="body2" sx={{ color: 'grey.400' }}>Data</Typography>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', color: 'white', font: 'inherit', fontWeight: 600, outline: 'none' }}
                        />
                    </Box>

                    <TextField
                        select
                        fullWidth
                        label="Conta / Forma de Pagamento"
                        variant="outlined"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        InputLabelProps={{ sx: { color: 'grey.400' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: alpha('#fff', 0.05), color: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSvgIcon-root': { color: 'grey.400' }
                        }}
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        placeholder="Comentários"
                        multiline
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        InputProps={{ sx: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: alpha('#fff', 0.05), color: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        }}
                    />
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default EditTransactionModal;
