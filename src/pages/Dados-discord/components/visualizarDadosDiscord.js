/* eslint-disable react/prop-types */
import React from 'react';
import {
  Box,
  Modal,
  Typography,
  List,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const VisualizarLogs = ({ open, onClose, logs }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-logs-dados-discord"
      aria-describedby="modal-logs-dados-discord-descricao"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '12px',
        }}
      >
        <Typography variant="h6" mb={1}>
          Histórico de alterações
        </Typography>

        {logs.length === 0 ? (
          <Typography>Nenhuma alteração encontrada.</Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {logs.map((log, index) => {
              const before = log.context?.before || {};
              const after = log.context?.after || {};
              const beforeFormatted = {
                operador: before.operador,
                telefone: before.telefone,
                email: before.email,
                password: before.password,
                status: before.status,
              };
              const afterFormatted = {
                operador: after.operador,
                telefone: after.telefone,
                email: after.email,
                password: after.password,
                status: after.status,
              };

              const thStyle = {
                textAlign: 'left',
                padding: '8px 10px',
                borderBottom: '1px solid rgba(0,0,0,0.12)',
                fontWeight: 600,
                verticalAlign: 'top',
              };
              const tdFieldStyle = {
                padding: '8px 10px',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap',
                verticalAlign: 'top',
                fontWeight: 500,
              };
              const tdValStyle = {
                padding: '8px 10px',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                verticalAlign: 'top',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                fontSize: 13,
              };
              const fmt = (v) =>
                v === undefined || v === null
                  ? '-'
                  : typeof v === 'object'
                    ? JSON.stringify(v, null, 2)
                    : String(v);

              return (
                <Box key={index} sx={{ mb: 1 }}>
                  <Accordion disableGutters>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`log-content-${index}`}
                      id={`log-header-${index}`}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 10,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            component="span"
                            color="#6b7280"
                          >
                            #{log.id}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            component="span"
                            sx={{ fontWeight: 700 }}
                          >
                            Tipo de alteração: {log.action || '-'}
                          </Typography>
                          <Typography
                            variant="caption"
                            component="span"
                            color="text.primary"
                          >
                            Data:{' '}
                            {new Date(
                              new Date(log.createdAt).getTime() -
                                3 * 60 * 60 * 1000,
                            ).toLocaleString()}
                            • {log.userName || '-'}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div style={{ overflowX: 'auto' }}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            tableLayout: 'fixed',
                          }}
                        >
                          <colgroup>
                            <col style={{ width: '22%' }} />
                            <col style={{ width: '39%' }} />
                            <col style={{ width: '39%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th style={thStyle}>Campo</th>
                              <th style={thStyle}>Antes</th>
                              <th style={thStyle}>Depois</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              'operador',
                              'telefone',
                              'email',
                              'password',
                              'status',
                            ].map((field, i) => (
                              <tr
                                key={field}
                                style={{
                                  background:
                                    i % 2 ? 'rgba(0,0,0,0.02)' : undefined,
                                }}
                              >
                                <td style={tdFieldStyle}>{field}:</td>
                                <td style={tdValStyle}>
                                  {fmt(beforeFormatted?.[field])}
                                </td>
                                <td style={tdValStyle}>
                                  {fmt(afterFormatted?.[field])}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              );
            })}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default VisualizarLogs;
