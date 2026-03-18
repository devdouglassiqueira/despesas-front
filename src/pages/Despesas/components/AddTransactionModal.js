import React, { useState } from 'react';
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
    IconButton,
    MenuItem,
    alpha
} from '@mui/material';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const AddTransactionModal = ({ open, onClose, onSuccess, categories, accounts }) => {
    const [type, setType] = useState('expense');
    const [subType, setSubType] = useState('Única'); // Única, Recorrente, Parcelamento
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('0,00');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [installments, setInstallments] = useState(2);
    const [notes, setNotes] = useState('');

    const handleSubTypeChange = (event, newSubType) => {
        if (newSubType !== null) setSubType(newSubType);
    };

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
                categoryId: Number(categoryId),
                accountId: Number(accountId),
                notes,
            };

            if (subType === 'Parcelamento') {
                payload.installmentTotal = installments;
            } else if (subType === 'Recorrente') {
                payload.isRecurring = true;
            }

            await api.post('/transactions', payload);
            notification({ message: 'Transação adicionada com sucesso!', type: 'success' });
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error adding transaction:', error);
            notification({ message: 'Erro ao adicionar transação.', type: 'error' });
        }
    };

    const resetForm = () => {
        setDescription('');
        setAmount('0,00');
        setCategoryId('');
        setAccountId('');
        setSubType('Única');
        setNotes('');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, pb: 2, bgcolor: '#1e293b', color: 'white' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Button onClick={onClose} sx={{ color: 'grey.400', textTransform: 'none' }}>Cancelar</Button>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>Adicionar Transação</Typography>
                <Button onClick={handleSubmit} variant="text" sx={{ fontWeight: 700, color: '#4ade80', textTransform: 'none' }}>Salvar</Button>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* Category Tabs/Pills */}
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

                    {/* Description Input */}
                    <TextField
                        fullWidth
                        placeholder="Nome"
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        InputProps={{ disableUnderline: true, sx: { fontSize: '1.2rem', bgcolor: alpha('#fff', 0.05), color: 'white', p: 2, borderRadius: 2 } }}
                    />

                    {/* SubType Toggle */}
                    <ToggleButtonGroup
                        value={subType}
                        exclusive
                        onChange={handleSubTypeChange}
                        fullWidth
                        size="small"
                        sx={{ bgcolor: alpha('#fff', 0.05), p: 0.5, borderRadius: 3, border: 'none', '& .MuiToggleButton-root': { border: 'none', borderRadius: 2.5, color: 'grey.400', '&.Mui-selected': { bgcolor: alpha('#fff', 0.1), color: 'white' } } }}
                    >
                        <ToggleButton value="Única" sx={{ textTransform: 'none' }}>Única</ToggleButton>
                        <ToggleButton value="Recorrente" sx={{ textTransform: 'none' }}>Recorrente</ToggleButton>
                        <ToggleButton value="Parcelamento" sx={{ textTransform: 'none' }}>Parcelamento</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Amount & Type Row */}
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

                    {/* Date/Month selection */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: alpha('#fff', 0.05), borderRadius: 4 }}>
                        <Typography variant="body2" sx={{ color: 'grey.400' }}>Data</Typography>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', color: 'white', font: 'inherit', fontWeight: 600, outline: 'none' }}
                            placeholder="dd/mm/aaaa"
                        />
                    </Box>

                    {/* Account Selection */}
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

                    {/* Installments specific field */}
                    {subType === 'Parcelamento' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: alpha('#fff', 0.05), borderRadius: 4 }}>
                            <Typography variant="body2" sx={{ color: 'grey.400' }}>Número de parcelas</Typography>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <IconButton sx={{ color: 'white' }} size="small" onClick={() => setInstallments(Math.max(2, installments - 1))}><MinusOutlined /></IconButton>
                                <Typography sx={{ fontWeight: 700, color: 'white' }}>{installments}</Typography>
                                <IconButton sx={{ color: 'white' }} size="small" onClick={() => setInstallments(installments + 1)}><PlusOutlined /></IconButton>
                            </Stack>
                        </Box>
                    )}

                    {/* Notes */}
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

export default AddTransactionModal;
