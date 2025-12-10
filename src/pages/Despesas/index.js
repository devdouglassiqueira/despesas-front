/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import MainCard from 'components/sistema/MainCard';
import CriarDespesas from './components/criarDespesas';
import EditarDespesas from './components/editarDespesas';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

// 🔹 Soma os totais por forma de pagamento considerando todos os tipos
const calcularTotaisPorFormaPagamento = (porTipo = []) => {
  const mapa = {};

  porTipo.forEach((grupo) => {
    (grupo.porFormaPagamento || []).forEach((forma) => {
      const chave = forma.formaPagamento || 'Não informado';
      const valor = Number(
        typeof forma.total === 'string'
          ? forma.total.replace(',', '.')
          : forma.total,
      );

      mapa[chave] = (mapa[chave] || 0) + (isNaN(valor) ? 0 : valor);
    });
  });

  return Object.entries(mapa).map(([formaPagamento, total]) => ({
    formaPagamento,
    total,
  }));
};

const ListaDespesas = () => {
  const [resumo, setResumo] = useState(null); // totalGeral + porTipo
  const [despesasSelecionado, setDespesasSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);

  // novos modais de totais
  const [modalResumoOpen, setModalResumoOpen] = useState(false);
  const [modalFormaPagOpen, setModalFormaPagOpen] = useState(false);

  // refs para cada bloco de tipo (para o PDF)
  const cardRefs = useRef({});

  useEffect(() => {
    buscarDespesas();
  }, []);

  const formatCurrency = (valor) => {
    const valorNumber = Number(
      typeof valor === 'string' ? valor.replace(',', '.') : valor,
    );
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(isNaN(valorNumber) ? 0 : valorNumber);
  };

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

  // totais gerais por forma de pagamento (somando todos os tipos)
  const totaisPorFormaPagamento = calcularTotaisPorFormaPagamento(
    resumo?.porTipo || [],
  );

  // ---------- PDF POR BLOCO / TIPO (sempre 1 página, sem coluna Ações) ----------
  const handleDownloadPDF = async (tipo) => {
    const element = cardRefs.current[tipo];
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // melhora qualidade da imagem
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      const margin = 10; // margem em mm
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = pdfHeight - margin * 2;

      // ratio para caber LARGURA e ALTURA na mesma página
      const ratio = Math.min(maxWidth / imgWidthPx, maxHeight / imgHeightPx);

      const imgWidth = imgWidthPx * ratio;
      const imgHeight = imgHeightPx * ratio;

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`despesas-${tipo}.pdf`);
    } catch (error) {
      console.error(error);
      notification({
        message: 'Erro ao gerar PDF deste bloco!',
        type: 'error',
      });
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* TOPO: pesquisa + botões */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Pesquisar por Descrição"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            disabled={!resumo}
            onClick={() => setModalResumoOpen(true)}
          >
            Totais Gerais
          </Button>

          <Button
            variant="outlined"
            disabled={!resumo}
            onClick={() => setModalFormaPagOpen(true)}
          >
            Totais por Forma de Pagamento
          </Button>

          <Button onClick={handleNovaDespesa} variant="contained">
            Adicionar Nova Despesa
          </Button>
        </Box>
      </Box>

      {/* MODAL 1 - TOTAIS GERAIS (total + por tipo) */}
      <Dialog
        open={modalResumoOpen}
        onClose={() => setModalResumoOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Totais Gerais</DialogTitle>
        <DialogContent dividers>
          {resumo ? (
            <Box>
              <Box sx={{ fontWeight: 'bold', mb: 2 }}>
                Valor Total: {formatCurrency(resumo.totalGeral)}
              </Box>

              {(resumo.porTipo || []).map((grupo) => (
                <Box key={grupo.tipo}>
                  Valor Total {grupo.tipo}: {formatCurrency(grupo.total)}
                </Box>
              ))}
            </Box>
          ) : (
            <Box>Nenhuma informação de resumo disponível.</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalResumoOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 2 - TOTAIS POR FORMA DE PAGAMENTO */}
      <Dialog
        open={modalFormaPagOpen}
        onClose={() => setModalFormaPagOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Totais por Forma de Pagamento</DialogTitle>
        <DialogContent dividers>
          {totaisPorFormaPagamento.length > 0 ? (
            <Box>
              {totaisPorFormaPagamento.map((item) => (
                <Box key={item.formaPagamento}>
                  {item.formaPagamento}: {formatCurrency(item.total)}
                </Box>
              ))}
            </Box>
          ) : (
            <Box>Nenhuma informação de formas de pagamento disponível.</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalFormaPagOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* CARDS POR TIPO */}
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

            if (!itensFiltrados.length) return null;

            return (
              <MainCard
                key={grupo.tipo}
                sx={{ flex: '1 1 350px', position: 'relative' }}
              >
                {/* BOTÃO PARA PDF DO BLOCO (NÃO ENTRA NO PDF) */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDownloadPDF(grupo.tipo)}
                  >
                    Baixar PDF
                  </Button>
                </Box>

                {/* VERSÃO PARA PDF - ESCONDIDA DA TELA, SEM COLUNA AÇÕES */}
                <Box
                  ref={(el) => {
                    cardRefs.current[grupo.tipo] = el;
                  }}
                  sx={{
                    position: 'absolute',
                    left: '-99999px',
                    top: 0,
                    width: '800px', // largura fixa pro print ficar estável
                    bgcolor: '#ffffff',
                    p: 2,
                  }}
                >
                  {/* CABEÇALHO DO BLOCO / PDF */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 'bold' }}>
                      {grupo.tipo}
                    </Box>

                    <Box sx={{ mt: 1, fontWeight: 'bold' }}>
                      Total: {formatCurrency(grupo.total)}
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      {(grupo.porFormaPagamento || []).map((forma) => (
                        <Box key={forma.formaPagamento}>
                          {forma.formaPagamento}: {formatCurrency(forma.total)}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* TABELA DE DESPESAS PARA PDF (SEM AÇÕES) */}
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Descrição</TableCell>
                          <TableCell>Valor</TableCell>
                          <TableCell>Forma de Pagamento</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itensFiltrados.map((despesa) => (
                          <TableRow key={despesa.id}>
                            <TableCell>{despesa.descricao}</TableCell>
                            <TableCell>
                              {formatCurrency(despesa.valor)}
                            </TableCell>
                            <TableCell>{despesa.formaPagamento}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* VERSÃO VISÍVEL NA TELA (COM AÇÕES) */}
                <Box>
                  {/* CABEÇALHO VISÍVEL */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ fontSize: 18, fontWeight: 'bold' }}>
                      {grupo.tipo}
                    </Box>

                    <Box sx={{ mt: 1, fontWeight: 'bold' }}>
                      Total: {formatCurrency(grupo.total)}
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      {(grupo.porFormaPagamento || []).map((forma) => (
                        <Box key={forma.formaPagamento}>
                          {forma.formaPagamento}: {formatCurrency(forma.total)}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* TABELA VISÍVEL (COM AÇÕES) */}
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
                              <TableCell>
                                {formatCurrency(despesa.valor)}
                              </TableCell>
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
                </Box>
              </MainCard>
            );
          })}
        </Box>
      )}

      {/* MODAIS DE CRIAÇÃO / EDIÇÃO */}
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
