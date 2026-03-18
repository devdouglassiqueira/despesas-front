/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Modal,
} from '@mui/material';
import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const GerenciarContatos = () => {
  const [contatos, setContatos] = useState([]);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    fetchContatos();
  }, []);

  const fetchContatos = async () => {
    try {
      const { data } = await api.get('/contatos');
      setContatos(data || []);
    } catch (error) {
      console.error(error);
      notification({ message: 'Erro ao buscar contatos', type: 'error' });
    }
  };

  const handleCreate = async () => {
    if (!nome) return;
    try {
      await api.post('/contatos', { nome });
      notification({ message: 'Contato criado!', type: 'success' });
      setOpen(false);
      setNome('');
      fetchContatos();
    } catch (error) {
      notification({ message: 'Erro ao criar contato', type: 'error' });
    }
  };

  // Optional: Add Delete logic if endpoint exists
  // const handleDelete = async (id) => { ... }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Novo Contato
        </Button>
      </Box>

      <MainCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contatos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Nenhum contato encontrado
                  </TableCell>
                </TableRow>
              )}
              {contatos.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.id}</TableCell>
                  <TableCell>{contact.nome}</TableCell>
                  {/* <TableCell>
                    <IconButton><DeleteOutlined /></IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <h2>Novo Contato</h2>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate}>
              Salvar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default GerenciarContatos;
