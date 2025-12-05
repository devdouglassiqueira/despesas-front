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
    valor: '',
    descricao: '',
    tipo: '',
  });

  useEffect(() => {
    if (open && despesas) {
      setFormData({
        valor: despesas.valor || '',
        descricao: despesas.descricao || '',
        tipo: despesas.tipo || '',
      });
    }
  }, [open, despesas]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValorBlur = () => {
    const raw = String(formData.valor).trim();
    if (!raw) return;

    const num = Number(raw.replace(',', '.'));
    if (Number.isNaN(num)) return;

    const formatado = num.toFixed(2); // 22 -> 22.00, 21.1 -> 21.10
    setFormData((prev) => ({ ...prev, valor: formatado }));
  };

  const handleSubmit = async () => {
    if (!despesas?.id) return;

    try {
      await api.put(`/controle-despesas/${despesas.id}`, formData);

      onSuccess();
      onClose();
      notification({
        message: 'Transação editada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao editar transação.';
      if (error.response && error.response.data) {
        message = error.response.data;
      }

      notification({
        message,
        type: 'error',
      });
    }
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
        <h2 id="modal-editar-despesa">Editar Transação</h2>
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

          <FormControl fullWidth>
            <InputLabel id="tipo-label">Tipo da Transação</InputLabel>
            <Select
              labelId="tipo-label"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              label="Tipo da Transação"
            >
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="saida">Saída</MenuItem>
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
