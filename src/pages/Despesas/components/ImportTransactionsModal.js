import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Typography, Stack, MenuItem, TextField } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const ImportTransactionsModal = ({ open, onClose, onSuccess, accounts }) => {
    const [file, setFile] = useState(null);
    const [accountId, setAccountId] = useState('');

    const handleSubmit = async () => {
        if (!file) {
            notification({ message: 'Selecione um arquivo OFX', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (accountId) formData.append('accountId', accountId);

        try {
            await api.post('/transactions/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            notification({ message: 'Extrato importado com sucesso!', type: 'success' });
            onSuccess();
            onClose();
            setFile(null);
            setAccountId('');
        } catch (error) {
            console.error('Error importing:', error);
            notification({ message: 'Erro ao importar extrato', type: 'error' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, pb: 2, bgcolor: '#1e293b', color: 'white' } }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Button onClick={onClose} sx={{ color: 'grey.400', textTransform: 'none' }}>Cancelar</Button>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>Importar Extrato</Typography>
                <Button onClick={handleSubmit} variant="text" sx={{ fontWeight: 700, color: '#4ade80', textTransform: 'none' }} disabled={!file}>Salvar</Button>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'grey.400' }}>
                        Selecione um arquivo OFX do seu banco para importar as transações.
                    </Typography>

                    <input
                        type="file"
                        accept=".ofx"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ color: 'white', padding: '10px 0' }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Conta de Destino (Opcional)"
                        variant="outlined"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        InputLabelProps={{ sx: { color: 'grey.400' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'white' },
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSvgIcon-root': { color: 'grey.400' }
                        }}
                    >
                        <MenuItem value="">Nenhuma conta definida</MenuItem>
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default ImportTransactionsModal;
