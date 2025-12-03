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

const ListaDespesas = () => {
  const [resumo, setResumo] = useState(null); // totalGeral + porTipo
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
    }).format(valor || 0);

  const buscarDespesas = async () => {
    try {
      const response = await api.get('/despesas/filtros');
      const { totalGeral, porTipo } = response.data;
      setResumo({ totalGeral, porTipo });
    } catch (error) {
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

  return (
    <Box sx={{ padding: '20px' }}>
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

      {/* CARD SUPERIOR: total geral + total por tipo */}
      {resumo && (
        <MainCard sx={{ mb: 3 }}>
          <Box sx={{ fontWeight: 'bold', mb: 1 }}>
            Valor total: {formatCurrency(resumo.totalGeral)}
          </Box>

          {(resumo.porTipo || []).map((grupo) => (
            <Box key={grupo.tipo}>
              Valor Total {grupo.tipo}: {formatCurrency(grupo.total)}
            </Box>
          ))}
        </MainCard>
      )}

      {/* CARDS POR TIPO (xxxx, xxv, etc) */}
      {resumo && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {(resumo.porTipo || []).map((grupo) => {
            // filtra itens pela descrição digitada
            const itensFiltrados = (grupo.itens || []).filter((despesa) =>
              despesa.descricao?.toLowerCase().includes(pesquisa.toLowerCase()),
            );

            // se não tiver nenhum item depois do filtro, nem mostra o card
            if (!itensFiltrados.length) return null;

            return (
              <MainCard
                key={grupo.tipo}
                title={grupo.tipo}
                sx={{ flex: '1 1 350px' }}
              >
                {/* lista de itens com os valores */}
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
                          <TableCell>Descrição</TableCell>
                          <TableCell>Valor</TableCell>
                          <TableCell>Forma de Pagamento</TableCell>
                          <TableCell>Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itensFiltrados.map((despesa) => (
                          <TableRow key={despesa.id}>
                            <TableCell>{despesa.descricao}</TableCell>
                            <TableCell>{despesa.valor}</TableCell>
                            <TableCell>{despesa.formaPagamento}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleEditarDespesa(despesa)}
                              >
                                <EditOutlined />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* totais por forma de pagamento + total do tipo */}
                <Box sx={{ mt: 2 }}>
                  {(grupo.porFormaPagamento || []).map((forma) => (
                    <Box key={forma.formaPagamento}>
                      {forma.formaPagamento}: {formatCurrency(forma.total)}
                    </Box>
                  ))}
                  <Box sx={{ mt: 1, fontWeight: 'bold' }}>
                    Total: {formatCurrency(grupo.total)}
                  </Box>
                </Box>
              </MainCard>
            );
          })}
        </Box>
      )}

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

export default ListaDespesas;
