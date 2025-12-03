/* eslint-disable react-hooks/exhaustive-deps */
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

const CriarDespesas = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    valor: '',
    descricao: '',
    formaPagamento: '',
    tipo: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // trata o campo valor separadamente
    if (name === 'valor') {
      // troca vírgula por ponto para não quebrar no back
      const normalizado = value.replace(',', '.');
      setFormData({ ...formData, [name]: normalizado });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // garante sempre 2 casas decimais ao sair do campo
  const handleValorBlur = () => {
    const raw = String(formData.valor).trim();
    if (!raw) return;

    const num = Number(raw);
    if (Number.isNaN(num)) return;

    const formatado = num.toFixed(2); // ex: 22 -> 22.00, 21.1 -> 21.10
    setFormData((prev) => ({ ...prev, valor: formatado }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/despesas', formData);
      onSuccess();
      onClose();
      notification({
        message: 'Despesas adicionado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao adicionar despesas.';
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
      aria-labelledby="modal-adicionar-despesas"
      aria-describedby="modal-adicionar-despesas-descricao"
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
        <h2 id="modal-adicionar-despesas">Adicionar Nova Despesa</h2>
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
            label="Nome da Pessoa"
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
              Adicionar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CriarDespesas;
