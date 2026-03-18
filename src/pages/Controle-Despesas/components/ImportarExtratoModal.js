/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import { CloudUploadOutlined } from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const filter = createFilterOptions();

const ImportarExtratoModal = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Options for Autocomplete
  const [contatosOptions, setContatosOptions] = useState([]);
  const [categoriasOptions, setCategoriasOptions] = useState([]);

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreviewData([]);
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
      console.error('Erro ao buscar opções', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await api.post('/importacao/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Response expected: array of { data, descricao, valor, tipo }
      // Add id temp for list key?
      const detectedData = response.data.map((item, index) => ({
        ...item,
        tempId: index,
        contato: item.contato || '',
        categoria: item.categoria || '',
      }));
      setPreviewData(detectedData);
      notification({
        message: 'Arquivo processado! Verifique os dados abaixo.',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      notification({ message: 'Erro ao processar arquivo.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = (index, field, value) => {
    const newData = [...previewData];
    newData[index][field] = value;
    setPreviewData(newData);
  };

  // Helper create/select for Contact
  const handleContatoChange = async (index, newValue) => {
    let valorFinal = '';
    if (typeof newValue === 'string') {
      valorFinal = newValue;
    } else if (newValue && newValue.inputValue) {
      // Create on fly
      try {
        const res = await api.post('/contatos', { nome: newValue.inputValue });
        valorFinal = res.data.nome;
        setContatosOptions((prev) => [...prev, res.data]);
      } catch (error) {
        console.error('Erro criar contato', error);
      }
    } else {
      valorFinal = newValue?.nome || '';
    }
    handleUpdateItem(index, 'contato', valorFinal);
  };

  // Helper create/select for Category
  const handleCategoriaChange = async (index, newValue) => {
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
        console.error('Erro criar categoria', error);
      }
    } else {
      valorFinal = newValue?.nome || '';
    }
    handleUpdateItem(index, 'categoria', valorFinal);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Save sequentially or implement batch endpoint later. sequential is safer for now.
      for (const item of previewData) {
        const [ano, mes, dia] = item.data.split('-');
        await api.post('/controle-despesas', {
          data: new Date(ano, mes - 1, dia, 12, 0, 0), // Ensure valid date at noon to avoid timezone shift
          descricao: item.descricao,
          valor: item.valor,
          tipo: item.tipo,
          contato: item.contato,
          categoria: item.categoria,
        });
      }
      notification({
        message: 'Lançamentos importados com sucesso!',
        type: 'success',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      notification({ message: 'Erro ao salvar lançamentos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Importar Extrato (OFX/CSV)</Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadOutlined />}
          >
            Selecionar Arquivo
            <input
              type="file"
              hidden
              accept=".ofx,.csv"
              onChange={handleFileChange}
            />
          </Button>
          {file && <Typography>{file.name}</Typography>}
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            Processar
          </Button>
        </Box>

        {previewData.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell width="20%">Contato</TableCell>
                    <TableCell width="20%">Categoria</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.data}</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          name="descricao"
                          value={row.descricao}
                          onChange={(e) =>
                            handleUpdateItem(index, 'descricao', e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>{row.valor}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            row.tipo === 'entrada'
                              ? 'success.main'
                              : 'error.main',
                        }}
                      >
                        {row.tipo}
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          size="small"
                          freeSolo
                          options={contatosOptions}
                          getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            if (option.inputValue) return option.inputValue;
                            return option.nome;
                          }}
                          value={row.contato}
                          onChange={(e, val) => handleContatoChange(index, val)}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some(
                              (option) =>
                                inputValue.toLowerCase() ===
                                option.nome?.toLowerCase(),
                            );
                            if (inputValue !== '' && !isExisting) {
                              filtered.push({
                                inputValue,
                                nome: `Add "${inputValue}"`,
                              });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          renderOption={(props, option) => (
                            <li {...props}>{option.nome}</li>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          size="small"
                          freeSolo
                          options={categoriasOptions}
                          getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            if (option.inputValue) return option.inputValue;
                            return option.nome;
                          }}
                          value={row.categoria}
                          onChange={(e, val) =>
                            handleCategoriaChange(index, val)
                          }
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some(
                              (option) =>
                                inputValue.toLowerCase() ===
                                option.nome?.toLowerCase(),
                            );
                            if (inputValue !== '' && !isExisting) {
                              filtered.push({
                                inputValue,
                                nome: `Add "${inputValue}"`,
                              });
                            }
                            return filtered;
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          renderOption={(props, option) => (
                            <li {...props}>{option.nome}</li>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={onClose} color="secondary">
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAll}
                disabled={loading}
              >
                Confirmar Importação ({previewData.length})
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ImportarExtratoModal;
