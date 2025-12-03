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
  TablePagination,
  Chip,
  TextField,
  IconButton,
} from '@mui/material';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarDadosDiscord from './components/criarDadosDiscord';
import EditarDadosDiscord from './components/editarDadosDiscord';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import VisualizarDadosDiscord from './components/visualizarDadosDiscord';

const ListaDadosDiscord = () => {
  const [dadosDiscord, setDadosDiscord] = useState([]);
  const [dadosDiscordSFiltrados, setDadosDiscordFiltrados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [dadosDiscordSelecionado, setDadosDiscordSelecionado] = useState(null);
  const [modalLogsOpen, setModalLogsOpen] = useState(false);
  const [logsSelecionados, setLogsSelecionados] = useState([]);
  const [operadorSelecionado, setOperadorSelecionado] = useState('');

  useEffect(() => {
    buscarDadosDiscord();
  }, []);

  useEffect(() => {
    filtrarDadosDiscord();
  }, [pesquisa, dadosDiscord]);

  const buscarDadosDiscord = async () => {
    try {
      const response = await api.get('/dados-discord');
      setDadosDiscord(response.data);
      setDadosDiscordFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar dados discord!', type: 'error' });
    }
  };

  const filtrarDadosDiscord = () => {
    const filtrados = dadosDiscord.filter((dadosDiscord) =>
      dadosDiscord.operador.toLowerCase().includes(pesquisa.toLowerCase()),
    );
    setDadosDiscordFiltrados(filtrados);
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNovoDadosDiscord = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarDadosDiscord = (dadosDiscord) => {
    setDadosDiscordSelecionado(dadosDiscord);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setDadosDiscordSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaDadosDiscord = () => {
    buscarDadosDiscord();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };
  const handleVerDadosDiscord = async (dadosDiscord) => {
    try {
      const response = await api.get(`/dados-discord/${dadosDiscord.id}/logs`);
      setLogsSelecionados(response.data.items || []);
      setOperadorSelecionado(dadosDiscord.operador);
      setModalLogsOpen(true);
    } catch (error) {
      notification({ message: 'Erro ao buscar logs!', type: 'error' });
    }
  };
  const handleFecharModalLogs = () => {
    setLogsSelecionados([]);
    setOperadorSelecionado('');
    setModalLogsOpen(false);
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
          label="Pesquisar por nome"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <Button onClick={handleNovoDadosDiscord} variant="contained">
          Adicionar Novo Dados Discord
        </Button>
      </Box>
      <MainCard title="Dados Discord">
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              width: '0.4em',
            },
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
                  <TableCell>Id</TableCell>
                  <TableCell>Operador</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Senha</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell> Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dadosDiscordSFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dadosDiscord) => (
                    <TableRow key={dadosDiscord.id}>
                      <TableCell>{dadosDiscord.id}</TableCell>
                      <TableCell>{dadosDiscord.operador}</TableCell>
                      <TableCell>{dadosDiscord.telefone}</TableCell>
                      <TableCell>{dadosDiscord.email}</TableCell>
                      <TableCell>{dadosDiscord.password}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            dadosDiscord.status === 'active'
                              ? 'Ativo'
                              : 'Inativo'
                          }
                          sx={{
                            backgroundColor:
                              dadosDiscord.status === 'active'
                                ? 'green'
                                : 'gray',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditarDadosDiscord(dadosDiscord)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          onClick={() => handleVerDadosDiscord(dadosDiscord)}
                        >
                          <EyeOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 100, 200, 500, 1000]}
            component="div"
            count={dadosDiscordSFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </Box>
      </MainCard>
      <CriarDadosDiscord
        open={modalCriarOpen}
        onClose={handleFecharModalCriar}
        onSuccess={atualizarListaDadosDiscord}
      />
      <EditarDadosDiscord
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaDadosDiscord}
        dadosDiscord={dadosDiscordSelecionado}
      />
      <VisualizarDadosDiscord
        open={modalLogsOpen}
        onClose={handleFecharModalLogs}
        logs={logsSelecionados}
        operador={operadorSelecionado}
      />
    </Box>
  );
};

export default ListaDadosDiscord;
