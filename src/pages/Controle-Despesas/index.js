/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarDespesas from './components/criarDespesas';
import EditarDespesas from './components/editarDespesas';
import GerenciarContatos from './components/contatos/index';
import GerenciarCategorias from './components/categorias/index';
import ImportarExtratoModal from './components/ImportarExtratoModal';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

// Simple TabPanel helper
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ListaControleDespesas = () => {
  // agora é sempre array
  const [despesas, setDespesas] = useState([]);
  const [despesasSelecionado, setDespesasSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalImportarOpen, setModalImportarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filtros de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterContato, setFilterContato] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  // Listas únicas para os selects
  const [uniqueContatos, setUniqueContatos] = useState([]);
  const [uniqueCategorias, setUniqueCategorias] = useState([]);

  // Totais do relatório
  const [relatorioData, setRelatorioData] = useState({
    saldoAnterior: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    saldoFinal: 0,
    isReport: false,
  });

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

  const formatDateOnly = (valor) => {
    if (!valor) return '-';
    return new Date(valor).toLocaleDateString('pt-BR');
  };

  const buscarDespesas = async (isRelatorio = false) => {
    try {
      let response;

      if (isRelatorio && startDate && endDate) {
        response = await api.get(
          `/controle-despesas/relatorio?startDate=${startDate}&endDate=${endDate}`,
        );
        const data = response.data;
        const transacoes = data.transacoes || [];
        setDespesas(transacoes);
        setRelatorioData({
          saldoAnterior: data.saldoAnterior || 0,
          totalEntradas: data.totalEntradas || 0,
          totalSaidas: data.totalSaidas || 0,
          saldoFinal: data.saldoFinal || 0,
          isReport: true,
        });
        // Extract unique contatos and categorias
        setUniqueContatos([...new Set(transacoes.map(d => d.contato).filter(Boolean))]);
        setUniqueCategorias([...new Set(transacoes.map(d => d.categoria).filter(Boolean))]);
      } else {
        response = await api.get('/controle-despesas');
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
        setRelatorioData((prev) => ({ ...prev, isReport: false }));
        // Extract unique contatos and categorias
        setUniqueContatos([...new Set(lista.map(d => d.contato).filter(Boolean))]);
        setUniqueCategorias([...new Set(lista.map(d => d.categoria).filter(Boolean))]);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setDespesas([]);
        return;
      }
      console.error('Erro ao buscar despesas', error);
      notification({ message: 'Erro ao buscar despesas!', type: 'error' });
    }
  };

  const handleGerarRelatorio = () => {
    if (!startDate || !endDate) {
      notification({
        message: 'Selecione a data inicial e final para o relatório',
        type: 'warning',
      });
      return;
    }
    buscarDespesas(true);
  };

  const handleLimparFiltros = () => {
    setStartDate('');
    setEndDate('');
    setFilterContato('');
    setFilterCategoria('');
    buscarDespesas(false);
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
    // Se estiver filtro ativo, atualiza com filtro, senão busca geral
    if (startDate && endDate && relatorioData.isReport) {
      buscarDespesas(true);
    } else {
      buscarDespesas(false);
    }
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
  };

  // ====== CÁLCULOS DOS TOTAIS LOCAL (apenas fallback se não for relatório) ======
  const despesasFiltradas = despesas.filter((despesa) => {
    const matchDescricao = despesa.descricao?.toLowerCase().includes(pesquisa.toLowerCase());
    const matchContato = !filterContato || despesa.contato === filterContato;
    const matchCategoria = !filterCategoria || despesa.categoria === filterCategoria;
    return matchDescricao && matchContato && matchCategoria;
  });

  const totalEntradasLocal = despesas.reduce((acc, despesa) => {
    if (despesa.tipo?.toLowerCase() === 'entrada') {
      return acc + (Number(despesa.valor) || 0);
    }
    return acc;
  }, 0);

  const totalSaidasLocal = despesas.reduce((acc, despesa) => {
    const tipoLower = despesa.tipo?.toLowerCase();
    if (tipoLower === 'saida' || tipoLower === 'saída') {
      return acc + (Number(despesa.valor) || 0);
    }
    return acc;
  }, 0);

  const saldoAtualLocal = totalEntradasLocal - totalSaidasLocal;

  // Decide quais valores mostrar no card
  const displaySaldoAnterior = relatorioData.isReport
    ? relatorioData.saldoAnterior
    : 0; // Se não for relatório, não tem conceito de saldo anterior claro sem paginação
  const displayEntradas = relatorioData.isReport
    ? relatorioData.totalEntradas
    : totalEntradasLocal;
  const displaySaidas = relatorioData.isReport
    ? relatorioData.totalSaidas
    : totalSaidasLocal;
  const displaySaldoFinal = relatorioData.isReport
    ? relatorioData.saldoFinal
    : saldoAtualLocal;

  const handleGerarPDF = (incluirContato = true) => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Relatório: Fluxo de Caixa', 14, 20);

    doc.setFontSize(12);
    const periodo =
      startDate && endDate
        ? `${new Date(startDate + 'T00:00:00').toLocaleDateString(
          'pt-BR',
        )} - ${new Date(endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`
        : 'Período não selecionado';
    doc.text(`Período: ${periodo}`, 14, 30);

    // Tabela
    const tableColumn = [
      'Data',
      'Descrição',
      'Categoria',
      'Valor',
    ];

    if (incluirContato) {
      tableColumn.splice(2, 0, 'Contato');
    }

    const tableRows = [];

    let pdfEntradas = 0;
    let pdfSaidas = 0;

    despesasFiltradas.forEach((d) => {
      const dataFormatada = d.data
        ? formatDateOnly(d.data)
        : formatDateTime(d.createdAt);

      const val = Number(d.valor) || 0;
      const isSaida = d.tipo === 'saida' || d.tipo === 'saída';

      if (isSaida) {
        pdfSaidas += val;
      } else {
        pdfEntradas += val;
      }

      let valorFormatado = formatCurrency(d.valor);

      if (isSaida) {
        valorFormatado = `- ${valorFormatado}`;
      }

      const row = [
        dataFormatada,
        d.descricao,
        d.categoria || '',
        valorFormatado,
      ];

      if (incluirContato) {
        row.splice(2, 0, d.contato || '');
      }

      tableRows.push(row);
    });

    // Recalcula Saldo Final baseado no que está sendo impresso + Saldo Anterior (se houver)
    const pdfSaldoFinal = displaySaldoAnterior + pdfEntradas - pdfSaidas;

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      didParseCell: function (data) {
        // Obter index da coluna Valor dinamicamente
        const valorIndex = incluirContato ? 4 : 3;

        if (data.section === 'body' && data.column.index === valorIndex) {
          const rawValor = data.row.raw[valorIndex];
          // Verifica se é negativo pelo formato "- R$ ..."
          const isSaida = rawValor && String(rawValor).includes('-');

          if (isSaida) {
            data.cell.styles.textColor = [255, 0, 0]; // Vermelho
          } else {
            data.cell.styles.textColor = [0, 128, 0]; // Verde opcional para entradas
          }
        }
      },
    });

    // Resumo Final
    let finalY = doc.lastAutoTable.finalY + 10;

    // Configurações da caixa de resumo
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const boxWidth = 100;
    const boxX = (pageWidth - boxWidth) / 2;
    const boxHeight = 45;
    const padding = 5;
    const margin = 20;

    // Verificar se cabe na página
    if (finalY + boxHeight > pageHeight - margin) {
      doc.addPage();
      finalY = 20; // Margem superior da nova página
    }

    const boxY = finalY;

    // Desenhar caixa com fundo cinza claro e borda arredondada
    doc.setFillColor(245, 245, 245); // Cinza bem claro
    doc.setDrawColor(200, 200, 200); // Borda cinza
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'FD');

    // Título do Resumo
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo Financeiro', boxX + padding, boxY + 10);

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(boxX + padding, boxY + 13, boxX + boxWidth - padding, boxY + 13);

    // Corpo do Resumo
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Saldo Anterior
    doc.text('Saldo Anterior:', boxX + padding, boxY + 22);
    doc.text(
      formatCurrency(displaySaldoAnterior),
      boxX + boxWidth - padding,
      boxY + 22,
      { align: 'right' },
    );

    // Entradas
    doc.setTextColor(0, 128, 0); // Verde
    doc.text('Entradas:', boxX + padding, boxY + 28);
    doc.text(
      formatCurrency(pdfEntradas),
      boxX + boxWidth - padding,
      boxY + 28,
      { align: 'right' },
    );

    // Saídas
    doc.setTextColor(255, 0, 0); // Vermelho
    doc.text('Saídas:', boxX + padding, boxY + 34);
    doc.text(
      formatCurrency(pdfSaidas),
      boxX + boxWidth - padding,
      boxY + 34,
      { align: 'right' },
    );

    // Saldo Final
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text('Saldo Final:', boxX + padding, boxY + 41);
    doc.text(
      formatCurrency(pdfSaldoFinal),
      boxX + boxWidth - padding,
      boxY + 41,
      { align: 'right' },
    );

    doc.save(`relatorio${incluirContato ? '' : '_sem_contato'}.pdf`);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Transações" />
          <Tab label="Contatos" />
          <Tab label="Categorias" />
        </Tabs>
      </Box>

      {/* TAB 0 - TRANSAÇÕES */}
      <TabPanel value={tabValue} index={0}>
        {/* FILTROS E BUSCA */}
        <MainCard sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Pesquisar por Descrição"
                variant="outlined"
                size="small"
                value={pesquisa}
                onChange={handlePesquisaChange}
                sx={{ width: '250px' }}
              />
              <TextField
                label="Data Inicial"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <TextField
                label="Data Final"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <TextField
                select
                label="Contato/CPF"
                size="small"
                value={filterContato}
                onChange={(e) => setFilterContato(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Todos</MenuItem>
                {uniqueContatos.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Categoria"
                size="small"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">Todas</MenuItem>
                {uniqueCategorias.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGerarRelatorio}
              >
                Gerar Relatório
              </Button>
              {relatorioData.isReport && (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleGerarPDF(true)}
                  >
                    Gerar PDF
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleGerarPDF(false)}
                  >
                    PDF (S/ Contato)
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLimparFiltros}
                  >
                    Limpar Filtros
                  </Button>
                </>
              )}
            </Box>

            <Button
              onClick={() => setModalImportarOpen(true)}
              variant="outlined"
              color="primary"
            >
              Importar Extrato
            </Button>
            <Button
              onClick={handleNovaDespesa}
              variant="contained"
              color="success"
            >
              Adicionar Transação
            </Button>
          </Box>
        </MainCard>

        {/* CARD DE RESUMO */}
        {(despesas.length > 0 || relatorioData.isReport) && (
          <MainCard sx={{ mb: 3, bgcolor: 'background.paper' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {relatorioData.isReport && (
                <Box>
                  <strong>Saldo Anterior:</strong>{' '}
                  {formatCurrency(displaySaldoAnterior)}
                </Box>
              )}
              <Box sx={{ color: 'green' }}>
                <strong>Entradas:</strong> {formatCurrency(displayEntradas)}
              </Box>
              <Box sx={{ color: 'red' }}>
                <strong>Saídas:</strong> {formatCurrency(displaySaidas)}
              </Box>
              <Box sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                <strong>
                  {relatorioData.isReport ? 'Saldo Final' : 'Saldo Atual'}:
                </strong>{' '}
                {formatCurrency(displaySaldoFinal)}
              </Box>
            </Box>
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
                    <TableCell>Contato</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {despesasFiltradas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  )}

                  {despesasFiltradas.map((despesa) => (
                    <TableRow key={despesa.id}>
                      <TableCell>
                        {despesa.data
                          ? formatDateOnly(despesa.data)
                          : formatDateTime(despesa.createdAt)}
                      </TableCell>
                      <TableCell>{despesa.descricao}</TableCell>
                      <TableCell>{despesa.contato || '-'}</TableCell>
                      <TableCell>{despesa.categoria || '-'}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            despesa.tipo === 'entrada'
                              ? 'success.main'
                              : 'error.main',
                          textTransform: 'capitalize',
                        }}
                      >
                        {despesa.tipo}
                      </TableCell>
                      <TableCell>{formatCurrency(despesa.valor)}</TableCell>
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
        </MainCard>
      </TabPanel>

      {/* TAB 1 - CONTATOS */}
      <TabPanel value={tabValue} index={1}>
        <GerenciarContatos />
      </TabPanel>

      {/* TAB 2 - CATEGORIAS */}
      <TabPanel value={tabValue} index={2}>
        <GerenciarCategorias />
      </TabPanel>

      <ImportarExtratoModal
        open={modalImportarOpen}
        onClose={() => setModalImportarOpen(false)}
        onSuccess={atualizarListaDespesas}
      />

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
