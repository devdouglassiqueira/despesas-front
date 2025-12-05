/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
  IconButton,
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarDespesas from './components/criarDespesas';
import EditarDespesas from './components/editarDespesas';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const ListaControleDespesas = () => {
  // agora é sempre array
  const [despesas, setDespesas] = useState([]);
  const [despesasSelecionado, setDespesasSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  useEffect(() => {
    buscarDespesas();
  }, []);

  const formatCurrency = (valor) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(Number(valor) || 0);

  const formatDateTime = (valor) => {
    if (!valor) return '-';
    return new Date(valor).toLocaleString('pt-BR');
  };

  const buscarDespesas = async () => {
    try {
      const response = await api.get('/controle-despesas');

      // 🔎 tenta se adaptar ao formato que o back devolver
      let lista = [];
      const data = response.data;

      if (Array.isArray(data)) {
        lista = data;
      } else if (Array.isArray(data?.despesas)) {
        lista = data.despesas;
      } else if (Array.isArray(data?.data)) {
        lista = data.data;
      }

      setDespesas(lista);
    } catch (error) {
      // se o back devolver 404: "Nenhuma despesa encontrada"
      if (error.response?.status === 404) {
        setDespesas([]);
        return;
      }

      console.error('Erro ao buscar despesas', error);
      notification({ message: 'Erro ao buscar despesas!', type: 'error' });
    }
  };

  const handleNovaDespesa = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarDespesa = (despesa) => {
    setDespesasSelecionado(despesa);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setDespesasSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaDespesas = () => {
    buscarDespesas();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
  };

  // ====== CÁLCULOS DOS TOTAIS ======
  const despesasFiltradas = despesas.filter((despesa) =>
    despesa.descricao?.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  const totalEntradas = despesas.reduce((acc, despesa) => {
    if (despesa.tipo?.toLowerCase() === 'entrada') {
      return acc + (Number(despesa.valor) || 0);
    }
    return acc;
  }, 0);

  const totalSaidas = despesas.reduce((acc, despesa) => {
    const tipoLower = despesa.tipo?.toLowerCase();
    if (tipoLower === 'saida' || tipoLower === 'saída') {
      return acc + (Number(despesa.valor) || 0);
    }
    return acc;
  }, 0);

  // saldo atual = saldo do último lançamento
  const saldoAtual = despesas.length
    ? Number(despesas[despesas.length - 1].saldo) || 0
    : 0;

  return (
    <Box sx={{ padding: '20px' }}>
      {/* topo: busca + botão criar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
        }}
      >
        <TextField
          label="Pesquisar por Descrição"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <Button onClick={handleNovaDespesa} variant="contained">
          Adicionar Nova Despesa
        </Button>
      </Box>

      {/* CARD DE RESUMO */}
      {despesas.length > 0 && (
        <MainCard sx={{ mb: 3 }}>
          <Box sx={{ fontWeight: 'bold', mb: 1 }}>
            Saldo atual: {formatCurrency(saldoAtual)}
          </Box>
          <Box> Total de Entradas: {formatCurrency(totalEntradas)} </Box>
          <Box> Total de Saídas: {formatCurrency(totalSaidas)} </Box>
        </MainCard>
      )}

      {/* TABELA DE LANÇAMENTOS */}
      <MainCard>
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '0.4em' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
              borderRadius: '4px',
            },
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Saldo após transação</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {despesasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhuma despesa encontrada
                    </TableCell>
                  </TableRow>
                )}

                {despesasFiltradas.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell>{formatDateTime(despesa.createdAt)}</TableCell>
                    <TableCell>{despesa.descricao}</TableCell>
                    <TableCell>{despesa.tipo}</TableCell>
                    <TableCell>{formatCurrency(despesa.valor)}</TableCell>
                    <TableCell>{formatCurrency(despesa.saldo)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditarDespesa(despesa)}>
                        <EditOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainCard>

      {/* MODAIS */}
      <CriarDespesas
        open={modalCriarOpen}
        onClose={handleFecharModalCriar}
        onSuccess={atualizarListaDespesas}
      />
      <EditarDespesas
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaDespesas}
        despesas={despesasSelecionado}
      />
    </Box>
  );
};

export default ListaControleDespesas;
