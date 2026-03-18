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
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const filter = createFilterOptions();

const CriarDespesas = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    valor: '',
    descricao: '',
    tipo: '', // entrada | saida
    contato: '',
    categoria: '',
    data: new Date().toISOString().split('T')[0], // Hoje como padrão
  };

  const [formData, setFormData] = useState(initialFormData);

  const [contatosOptions, setContatosOptions] = useState([]);
  const [categoriasOptions, setCategoriasOptions] = useState([]);

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      fetchOptions();
    }
  }, [open]);

  const fetchOptions = async () => {
    try {
      const [resContatos, resCategorias] = await Promise.all([
        api.get('/contatos'),
        api.get('/categorias'),
      ]);
      setContatosOptions(resContatos.data || []);
      setCategoriasOptions(resCategorias.data || []);
    } catch (error) {
      console.error('Erro ao buscar opções de contato/categoria', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'valor') {
      // troca vírgula por ponto para não quebrar no back
      const normalizado = value.replace(',', '.');
      setFormData((prev) => ({ ...prev, [name]: normalizado }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
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
    // validação simples
    if (!formData.valor || !formData.tipo) {
      notification({
        message: 'Informe o valor e o tipo da transação.',
        type: 'error',
      });
      return;
    }

    try {
      await api.post('/controle-despesas', formData);
      onSuccess();
      onClose();
      notification({
        message: 'Transação adicionada com sucesso!',
        type: 'success',
      });
    } catch (error) {
      let message = 'Erro ao adicionar transação.';
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
        <h2 id="modal-adicionar-despesas">Adicionar Nova Transação</h2>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Data"
            name="data"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.data || ''}
            onChange={handleChange}
            fullWidth
          />

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

          <Autocomplete
            freeSolo
            options={contatosOptions}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.nome;
            }}
            value={formData.contato}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({ ...prev, contato: newInputValue }));
            }}
            onChange={async (event, newValue) => {
              let valorFinal = '';
              if (typeof newValue === 'string') {
                valorFinal = newValue;
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                try {
                  const res = await api.post('/contatos', {
                    nome: newValue.inputValue,
                  });
                  valorFinal = res.data.nome;
                  setContatosOptions((prev) => [...prev, res.data]);
                } catch (error) {
                  console.error('Erro ao criar contato', error);
                }
              } else {
                valorFinal = newValue?.nome || '';
              }
              setFormData((prev) => ({ ...prev, contato: valorFinal }));
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) =>
                  inputValue.toLowerCase() === option.nome?.toLowerCase(),
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  nome: `Adicionar "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            handleHomeEndKeys
            renderOption={(props, option) => (
              <li {...props}>
                {typeof option === 'string' ? option : option.nome}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Contato" fullWidth />
            )}
          />

          <Autocomplete
            freeSolo
            options={categoriasOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.nome;
            }}
            value={formData.categoria}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({ ...prev, categoria: newInputValue }));
            }}
            onChange={async (event, newValue) => {
              let valorFinal = '';
              if (typeof newValue === 'string') {
                valorFinal = newValue;
              } else if (newValue && newValue.inputValue) {
                try {
                  const res = await api.post('/categorias', {
                    nome: newValue.inputValue,
                  });
                  valorFinal = res.data.nome;
                  setCategoriasOptions((prev) => [...prev, res.data]);
                } catch (error) {
                  console.error('Erro ao criar categoria', error);
                }
              } else {
                valorFinal = newValue?.nome || '';
              }
              setFormData((prev) => ({ ...prev, categoria: valorFinal }));
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              const isExisting = options.some(
                (option) =>
                  inputValue.toLowerCase() === option.nome?.toLowerCase(),
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  nome: `Adicionar "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            handleHomeEndKeys
            renderOption={(props, option) => (
              <li {...props}>
                {typeof option === 'string' ? option : option.nome}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Categoria" fullWidth />
            )}
          />

          <FormControl fullWidth>
            <InputLabel id="tipo-label">Tipo da Transação</InputLabel>
            <Select
              labelId="tipo-label"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              label="Tipo da Transação"
              sx={{
                color:
                  formData.tipo === 'entrada'
                    ? 'success.main'
                    : formData.tipo === 'saida'
                      ? 'error.main'
                      : 'inherit',
              }}
            >
              <MenuItem value="entrada" sx={{ color: 'success.main' }}>
                Entrada
              </MenuItem>
              <MenuItem value="saida" sx={{ color: 'error.main' }}>
                Saída
              </MenuItem>
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
