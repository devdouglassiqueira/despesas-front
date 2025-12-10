/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const EditarDespesas = ({ open, onClose, onSuccess, despesas }) => {
  const [formData, setFormData] = useState({
    valor: despesas?.valor || '',
    descricao: despesas?.descricao || '',
    tipo: despesas?.tipo || '',
    formaPagamento: despesas?.formaPagamento || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        valor: despesas?.valor || '',
        descricao: despesas?.descricao || '',
        tipo: despesas?.tipo || '',
        formaPagamento: despesas?.formaPagamento || '',
      });
    }
  }, [open, despesas]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/despesas/${despesas.id}`, formData);
      onSuccess();
      onClose();
      notification({
        message: 'Despesa editada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao editar despesa.';
      if (error.response && error.response.data) {
        message = error.response.data;
      }

      notification({
        message,
        type: 'error',
      });
    }
  };
  const handleValorBlur = () => {
    const raw = String(formData.valor).trim();
    if (!raw) return;

    const num = Number(raw);
    if (Number.isNaN(num)) return;

    const formatado = num.toFixed(2); // ex: 22 -> 22.00, 21.1 -> 21.10
    setFormData((prev) => ({ ...prev, valor: formatado }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-editar-despesa"
      aria-describedby="modal-editar-despesa-descricao"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <h2 id="modal-editar-despesa">Editar Despesa</h2>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            onBlur={handleValorBlur}
            fullWidth
          />
          <TextField
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Tipo de despesa"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="forma-pagamento-label">
              Forma de Pagamento
            </InputLabel>
            <Select
              labelId="forma-pagamento-label"
              name="formaPagamento"
              value={formData.formaPagamento}
              onChange={handleChange}
              label="Forma de Pagamento"
            >
              <MenuItem value="Nubank">Cartão Nubank</MenuItem>
              <MenuItem value="Picpay">Cartão Picpay</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarDespesas;
