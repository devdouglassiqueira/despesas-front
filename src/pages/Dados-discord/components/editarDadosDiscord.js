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

const EditarDadosDiscord = ({ open, onClose, onSuccess, dadosDiscord }) => {
  const [formData, setFormData] = useState({
    operador: dadosDiscord?.operador || '',
    telefone: dadosDiscord?.telefone || '',
    email: dadosDiscord?.email || '',
    password: dadosDiscord?.password || '',
    status: dadosDiscord?.status || 'active',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        operador: dadosDiscord?.operador || '',
        telefone: dadosDiscord?.telefone || '',
        email: dadosDiscord?.email || '',
        password: dadosDiscord?.password || '',
        status: dadosDiscord?.status || 'active',
      });
    }
  }, [open, dadosDiscord]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/dados-discord/${dadosDiscord.id}`, formData);
      onSuccess();
      onClose();
      notification({
        message: 'Dados Discord editado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao editar dados discord.';
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
      aria-labelledby="modal-editar-dados-discord"
      aria-describedby="modal-editar-dados-discord-descricao"
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
        <h2 id="modal-editar-dados-discord">Editar Dados Discord</h2>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Operador"
            name="operador"
            value={formData.operador}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Senha"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Ativo</MenuItem>
              <MenuItem value="inactive">Inativo</MenuItem>
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

export default EditarDadosDiscord;
