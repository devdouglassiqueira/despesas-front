/* eslint-disable react-hooks/exhaustive-deps */ /* eslint-disable react/prop-types */ import React, {
  useState,
  useEffect,
} from 'react';
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
const AdicionarDadosDiscord = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    operador: '',
    telefone: '',
    email: '',
    password: '',
    status: 'active',
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
    }
  }, [open]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      await api.post('/dados-discord', formData);
      onSuccess();
      onClose();
      notification({
        message: 'Dados discord adicionado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao adicionar dados discord.';
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
      aria-labelledby="modal-adicionar-dados-discord"
      aria-describedby="modal-adicionar-dados-discord-descricao"
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
        <h2 id="modal-adicionar-dados-discord">Adicionar Novo Dado Discord</h2>
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
              Adicionar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
export default AdicionarDadosDiscord;
