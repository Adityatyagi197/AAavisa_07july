import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import PageHeader from '../../components/PageHeader';
import FilterPanel from '../../components/FilterPanel';
import { useAlert } from '../../contexts/AlertContext';
import { SERVICES } from '../../constants/mockData';

// Icons
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StampIcon from '@mui/icons-material/Verified';

const renderMockPDFContent = (doc, client) => {
  if (!doc) return null;
  const category = (doc.category || '').toLowerCase();
  const docName = doc.name || doc.fileName || 'document.pdf';
  const clientName = client ? `${client.firstName} ${client.lastName}` : 'Client Name';

  if (category.includes('passport')) {
    return (
      <Box sx={{ border: '2.5px solid #64748B', p: 3, borderRadius: 2.5, bgcolor: '#FFFDF5', fontFamily: 'Courier, monospace', color: '#1E293B', minHeight: 320 }}>
        <Typography variant="subtitle2" align="center" sx={{ fontWeight: 900, borderBottom: '1px solid #1E293B', pb: 1, mb: 2, fontSize: '0.85rem' }}>
          🛂 OFFICIAL PASSPORT DOCUMENT (SIMULATED COPY)
        </Typography>
        <Box className="grid grid-cols-12 gap-2">
          <Box className="col-span-4">
            <Box sx={{ width: 110, height: 130, bgcolor: '#E2E8F0', border: '1px solid #94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#94A3B8', mb: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>[BIO PHOTO]</Typography>
            </Box>
          </Box>
          <Box className="col-span-8" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Type / Tipo: <strong>P</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Country / País: <strong>ESP</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Passport No / Pasaporte: <strong>{client?.passportNumber || 'G9023812'}</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Surname / Apellidos: <strong>{client?.lastName?.toUpperCase() || 'SMITH'}</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Given Names / Nombres: <strong>{client?.firstName?.toUpperCase() || 'JOHN'}</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Nationality / Nacionalidad: <strong>{client?.nationality?.toUpperCase() || 'BRITISH'}</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Date of Birth / Fecha Nacimiento: <strong>{client?.dateOfBirth || '14 DEC 1988'}</strong></Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Sex / Sexo: <strong>M</strong></Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 3, border: '2px dashed #059669', p: 1, textAlign: 'center', bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 'bold', fontSize: '0.7rem', transform: 'rotate(-1.5deg)' }}>
          OFFICIAL CHIP DATA ENCRYPTED & VALIDATED
        </Box>
      </Box>
    );
  }

  if (category.includes('bank') || category.includes('statement') || category.includes('fund') || category.includes('savings')) {
    return (
      <Box sx={{ border: '2.5px solid #64748B', p: 3, borderRadius: 2.5, bgcolor: '#FFFFFF', fontFamily: 'monospace', color: '#1E293B', minHeight: 320 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, borderBottom: '2.5px solid #1E293B', pb: 1, mb: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span>🏦 BANCO SANTANDER - CURRENT ACCOUNT STATEMENT</span>
          <span style={{ fontSize: '0.7rem' }}>CONFIDENTIAL</span>
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 2, fontSize: '0.7rem' }}>
          Account Holder: <strong>{clientName}</strong> | Account IBAN: <strong>ES90 0049 8912 3456 7890</strong>
        </Typography>

        <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #475569', textAlign: 'left' }}>
              <th style={{ padding: '6px 4px' }}>Date</th>
              <th style={{ padding: '6px 4px' }}>Description</th>
              <th style={{ padding: '6px 4px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '6px 4px', textAlign: 'right' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px 4px' }}>01 Jun 2026</td>
              <td style={{ padding: '6px 4px' }}>Opening Balance</td>
              <td style={{ padding: '6px 4px', textAlign: 'right' }}>-</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 'bold' }}>€15,200.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px 4px' }}>05 Jun 2026</td>
              <td style={{ padding: '6px 4px' }}>Remote Employment Income</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', color: '#10B981' }}>+€3,800.00</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 'bold' }}>€19,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px 4px' }}>12 Jun 2026</td>
              <td style={{ padding: '6px 4px' }}>ATM Withdrawal Madrid Centro</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', color: '#EF4444' }}>-€200.00</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 'bold' }}>€18,800.00</td>
            </tr>
            <tr style={{ borderBottom: '1.5px solid #475569' }}>
              <td style={{ padding: '6px 4px' }}>15 Jun 2026</td>
              <td style={{ padding: '6px 4px' }}>Carrefour Madrid Supermarket</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', color: '#EF4444' }}>-€125.40</td>
              <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 'bold' }}>€18,674.60</td>
            </tr>
          </tbody>
        </table>

        <Box sx={{ p: 1.2, bgcolor: '#ECFDF5', borderRadius: 1.5, border: '1px solid #A7F3D0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#047857', fontSize: '0.68rem' }}>✓ Financial threshold criteria met (&gt; €18,000 balance)</Typography>
          <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 800, fontSize: '0.68rem' }}>Total Balance: €18,674.60</Typography>
        </Box>
      </Box>
    );
  }

  if (category.includes('employment') || category.includes('letter') || category.includes('contract')) {
    return (
      <Box sx={{ border: '2.5px solid #64748B', p: 4, borderRadius: 2.5, bgcolor: '#FAFAF9', fontFamily: 'Georgia, serif', color: '#1E293B', minHeight: 320, fontSize: '0.78rem', lineHeight: 1.6 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace', mb: 3, borderBottom: '1px solid #1E293B', pb: 1, fontSize: '0.85rem' }}>
          📝 EMPLOYMENT VERIFICATION LETTER
        </Typography>
        <Typography sx={{ mb: 2, fontSize: '0.72rem' }}>Date: May 24, 2026</Typography>
        <Typography sx={{ mb: 2, fontSize: '0.72rem' }}><strong>TO WHOM IT MAY CONCERN,</strong></Typography>
        <Typography sx={{ mb: 2, fontSize: '0.72rem' }}>
          This letter serves to confirm that <strong>{clientName}</strong> is employed full-time with our firm in the capacity of <strong>Lead Software Consultant</strong>.
        </Typography>
        <Typography sx={{ mb: 2, fontSize: '0.72rem' }}>
          Their current salary is <strong>€3,800.00</strong> per month. We also confirm that their duties can be performed fully remotely, and we authorize <strong>{clientName}</strong> to work remotely from Spain.
        </Typography>
        <Typography sx={{ mt: 4, fontSize: '0.72rem' }}>
          Sincerely,<br />
          <strong>Victoria Vance</strong><br />
          HR Director, Tech Solutions UK Ltd
        </Typography>
      </Box>
    );
  }

  if (category.includes('health') || category.includes('policy') || category.includes('insurance')) {
    return (
      <Box sx={{ border: '2.5px solid #64748B', p: 3, borderRadius: 2.5, bgcolor: '#EFF6FF', fontFamily: 'sans-serif', color: '#1E293B', minHeight: 320 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1D4ED8', mb: 2, borderBottom: '1px solid #BFDBFE', pb: 1, fontSize: '0.85rem' }}>
          🏥 SANITAS INSURANCE POLICY CONFIRMATION
        </Typography>
        <Box className="grid grid-cols-12 gap-5" sx={{ fontSize: '0.72rem', mb: 3 }}>
          <Box className="col-span-6">
            <Typography variant="caption" color="text.secondary" display="block">Insured Person Name:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>{clientName}</Typography>
          </Box>
          <Box className="col-span-6">
            <Typography variant="caption" color="text.secondary" display="block">Policy Reference:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>SAN-90812-SPAIN</Typography>
          </Box>
          <Box className="col-span-6">
            <Typography variant="caption" color="text.secondary" display="block">Co-payments (Copagos):</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#10B981' }}>SIN COPAGOS (Zero Co-pay)</Typography>
          </Box>
          <Box className="col-span-6">
            <Typography variant="caption" color="text.secondary" display="block">Repatriation Coverage:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#10B981' }}>INCLUDED (Full Repatriation)</Typography>
          </Box>
        </Box>
        <Alert severity="success" sx={{ py: 0.5, '& .MuiAlert-message': { fontSize: '0.7rem' } }}>
          Policy complies fully with Spanish Residency health coverage criteria.
        </Alert>
      </Box>
    );
  }

  // Generic file mock
  return (
    <Box sx={{ border: '2px solid #94A3B8', p: 4, borderRadius: 2, bgcolor: '#F8FAFC', color: '#475569', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <InsertDriveFileIcon sx={{ fontSize: 64, color: '#94A3B8' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>
          {docName}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          Category: {doc.category} | Size: {doc.fileSize || '1.5 MB'}
        </Typography>
      </Box>
      <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
        <Box sx={{ height: 6, bgcolor: '#E2E8F0', borderRadius: 3 }} />
        <Box sx={{ height: 6, bgcolor: '#E2E8F0', borderRadius: 3, width: '70%' }} />
        <Box sx={{ height: 6, bgcolor: '#E2E8F0', borderRadius: 3, width: '90%' }} />
      </Box>
      <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 800, mt: 2, fontSize: '0.65rem', border: '1px solid #F59E0B', px: 1, py: 0.2, borderRadius: 1, bgcolor: '#FEF3C7' }}>
        SIMULATED SCAN DATA PREVIEW
      </Typography>
    </Box>
  );
};

export const AdminDocumentVerificationDashboard = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [tableFilters, setTableFilters] = useState({ serviceId: '', status: '', assignedConsultantId: '' });

  // Fetch Collections
  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: dbService.getDocuments,
    staleTime: 0,
    refetchInterval: 10000, // auto-refresh every 10s to pick up new client uploads
    refetchOnWindowFocus: true
  });

  const reviewDocumentMutation = useMutation({
    mutationFn: ({ documentId, status, comment }) =>
      dbService.reviewDocument(documentId, status, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showAlert('Document verification status updated successfully', 'success');
    }
  });

  // Filter clients to show all so portal credentials can be generated
  const intakeClients = clients;

  // Auto-select first client if none selected
  useEffect(() => {
    if (intakeClients.length > 0 && !selectedClientId) {
      setSelectedClientId(intakeClients[0].id);
    }
  }, [intakeClients, selectedClientId]);

  const selectedClient = clients.find(c => c && c.id === selectedClientId);
  const clientDocs = documents.filter(d => d && d.clientId === selectedClientId);

  const handlePrintPDF = () => {
    if (!selectedClient) return;
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      showAlert('Popup blocked! Please allow popups to open the PDF.', 'warning');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>INTAKE_SHEET_${selectedClient.id}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 40px;
              color: #0f172a;
              background-color: #ffffff;
            }
            .header {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
            }
            .title {
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              text-decoration: underline;
              margin-bottom: 40px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              background-color: #f1f5f9;
              padding: 5px;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 15px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .field-label {
              color: #64748b;
              font-size: 11px;
              display: block;
            }
            .field-value {
              font-weight: bold;
              font-size: 12px;
            }
            .stamp {
              border: 3px dashed #10b981;
              color: #10b981;
              border-radius: 4px;
              padding: 5px 15px;
              font-weight: bold;
              display: inline-block;
              transform: rotate(10deg);
              font-size: 12px;
              letter-spacing: 1px;
              margin-bottom: 20px;
            }
            .barcode {
              letter-spacing: 3px;
              font-weight: bold;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              @page { size: A4; margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stamp">✓ INTAKE RECEIVED</div>
            <div style="font-size: 11px; text-align: right;">FORM ID: INTAKE-${selectedClient.id}</div>
          </div>
          
          <div class="header">
            <div>
              <strong>AAA IMMIGRATION SERVICES LLC</strong><br/>
              <span style="font-size: 10px; color: #475569;">Calle Gran Vía 28, Centro, 28013 Madrid, España</span><br/>
              <span style="font-size: 10px; color: #475569;">Tel: +34 91 123 4567 | info@aaabusinessconsultancy.com</span>
            </div>
            <div style="text-align: right; font-size: 11px;">
              Date: ${new Date(selectedClient.onboardingDate || Date.now()).toLocaleDateString()}
            </div>
          </div>

          <div class="title">SPAIN RESIDENCY & IMMIGRATION PROFILING SHEET</div>

          <div class="section">
            <div class="section-title">1. GENERAL APPLICANT METADATA</div>
            <div class="grid">
              <div>
                <span class="field-label">Full Legal Name:</span>
                <span class="field-value">${selectedClient.firstName?.toUpperCase()} ${selectedClient.lastName?.toUpperCase()}</span>
              </div>
              <div>
                <span class="field-label">Client ID Reference:</span>
                <span class="field-value">${selectedClient.id}</span>
              </div>
              <div>
                <span class="field-label">Date of Birth:</span>
                <span class="field-value">${selectedClient.dateOfBirth || '14 DEC 1988'}</span>
              </div>
              <div>
                <span class="field-label">Citizenship / Nationality:</span>
                <span class="field-value">${selectedClient.nationality?.toUpperCase() || 'BRITISH'}</span>
              </div>
              <div>
                <span class="field-label">Primary Communication Email:</span>
                <span class="field-value">${selectedClient.email}</span>
              </div>
              <div>
                <span class="field-label">Phone Number:</span>
                <span class="field-value">${selectedClient.phone}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. VISA PROCESS DETAILS</div>
            <div class="grid">
              <div>
                <span class="field-label">Passport Number:</span>
                <span class="field-value">${selectedClient.passportNumber || 'G9023812'}</span>
              </div>
              <div>
                <span class="field-label">Preferred Visa Pathway:</span>
                <span class="field-value">${getServiceLabel(selectedClient.serviceId)}</span>
              </div>
              <div>
                <span class="field-label">Preferred Communication Language:</span>
                <span class="field-value">${selectedClient.preferredLanguage || 'English'}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">3. REGISTERED LIVING ADDRESS</div>
            <div style="line-height: 1.5; font-size: 12px; font-weight: bold;">
              ${selectedClient.address || 'Calle Gran Vía 28, Centro, 28013 Madrid, España'}
            </div>
          </div>

          <div style="margin-top: 50px; border-top: 1px dashed #94a3b8; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div class="barcode">||| | ||| || ||| | ||| |||| |</div>
            <div style="font-size: 9px; color: #94a3b8; font-style: italic;">
              Digitally signed via Secure IP Check-out Simulator.
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleOpenMockFile = (doc) => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      showAlert('Popup blocked! Please allow popups to open document files.', 'warning');
      return;
    }

    const category = (doc.category || '').toLowerCase();
    const docName = doc.name || doc.fileName || 'document.pdf';
    const clientName = selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Client Name';

    let docHtml = '';

    if (category.includes('passport')) {
      docHtml = `
        <div style="border: 2px solid black; padding: 30px; margin: 40px auto; max-width: 600px; background-color: #fffbe6; font-family: monospace; color: #000;">
          <h2 style="text-align: center; border-bottom: 2px solid; padding-bottom: 10px;">🛂 PASSPORT / PASAPORTE (SIMULATED COPY)</h2>
          <div style="display: flex; margin-top: 20px;">
            <div style="width: 130px; height: 160px; border: 1px solid black; background-color: #ccc; margin-right: 30px; display: flex; align-items: center; justify-content: center;">
              <strong>[PHOTO]</strong>
            </div>
            <div style="line-height: 1.8; font-size: 14px;">
              <strong>Type / Tipo:</strong> P<br/>
              <strong>Code / Código:</strong> ESP<br/>
              <strong>Passport No / Pasaporte:</strong> ${selectedClient?.passportNumber || 'G9023812'}<br/>
              <strong>Surname / Apellidos:</strong> ${selectedClient?.lastName?.toUpperCase() || 'SMITH'}<br/>
              <strong>Given Name / Nombre:</strong> ${selectedClient?.firstName?.toUpperCase() || 'JOHN'}<br/>
              <strong>Nationality / Nacionalidad:</strong> ${selectedClient?.nationality?.toUpperCase() || 'BRITISH'}<br/>
              <strong>Date of Birth:</strong> ${selectedClient?.dateOfBirth || '14 DEC 1988'}<br/>
              <strong>Sex / Sexo:</strong> M<br/>
            </div>
          </div>
          <div style="border: 2px dashed red; color: red; text-align: center; margin-top: 30px; padding: 10px; font-weight: bold; font-size: 14px;">
            ✓ OFFICIAL DOCUMENT COPY SUBMITTED SECURELY
          </div>
        </div>
      `;
    } else if (category.includes('bank') || category.includes('statement') || category.includes('fund') || category.includes('savings')) {
      docHtml = `
        <div style="border: 2px solid black; padding: 30px; margin: 40px auto; max-width: 700px; font-family: sans-serif; color: #333;">
          <h2 style="border-bottom: 3px solid #1c3d5a; padding-bottom: 10px; color: #1c3d5a;">🏦 BANCO SANTANDER - BANK STATEMENT</h2>
          <p><strong>Account Holder:</strong> ${clientName}</p>
          <p><strong>IBAN:</strong> ES90 0049 8912 3456 7890</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
            <thead>
              <tr style="background-color: #f1f5f9; border-bottom: 2px solid #ccc; text-align: left;">
                <th style="padding: 10px;">Date</th>
                <th style="padding: 10px;">Description</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
                <th style="padding: 10px; text-align: right;">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">01 Jun 2026</td>
                <td style="padding: 10px;">Opening Balance</td>
                <td style="padding: 10px; text-align: right;">-</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">€15,200.00</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">05 Jun 2026</td>
                <td style="padding: 10px;">Remote Employment Salary</td>
                <td style="padding: 10px; text-align: right; color: green;">+€3,800.00</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">€19,000.00</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">12 Jun 2026</td>
                <td style="padding: 10px;">ATM Cash Withdrawal Madrid</td>
                <td style="padding: 10px; text-align: right; color: red;">-€200.00</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">€18,800.00</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 30px; padding: 15px; background-color: #e6fffa; border: 1px solid #319795; color: #234e52; font-size: 13px; font-weight: bold;">
            ✓ Verification Passed: Monthly average meets DNV visa Spain requirements.
          </div>
        </div>
      `;
    } else {
      docHtml = `
        <div style="border: 2px solid black; padding: 40px; margin: 40px auto; max-width: 600px; font-family: serif; color: #333; line-height: 1.6;">
          <h3 style="text-align: center; border-bottom: 1px solid; padding-bottom: 10px;">DOC REF: ${docName.toUpperCase()}</h3>
          <p style="text-align: right; font-size: 12px;">Date: ${new Date(doc.uploadedDate || Date.now()).toLocaleDateString()}</p>
          <p><strong>Document Verification Intake Record</strong></p>
          <p>This is a simulated verification record of the document category <strong>"${doc.category}"</strong> uploaded by client <strong>${clientName}</strong>.</p>
          <p>Document details, metadata and file integrity certificates have been validated by the backend service. File is clean and active.</p>
          <div style="margin-top: 50px; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px;">
            <p style="font-size: 11px; color: #777;">AAA IMMIGRATION CLOUD REPOSITORY - SCAN CERTIFICATE</p>
          </div>
        </div>
      `;
    }

    const htmlContent = `
      <html>
        <head>
          <title>${docName}</title>
        </head>
        <body style="background-color: #f7fafc; padding: 20px; font-family: sans-serif;">
          <div style="max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
              <span style="font-weight: bold; color: #4a5568;">📄 Simulated Document File: ${docName}</span>
              <button onclick="window.print()" style="padding: 6px 15px; background: #e53e3e; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Print / Save PDF</button>
            </div>
            ${docHtml}
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getServiceLabel = (serviceId) => {
    return SERVICES.find(s => s.id === serviceId)?.name || serviceId?.toUpperCase() || 'Immigration';
  };

  if (isClientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Document Verification Dashboard"
        subtitle="Dedicated workspace for operations team to verify client profile details and approve or reject uploaded document credentials."
      />

      {/* ===== CLIENT SELECTION TABLE WITH SEARCH ===== */}
      <Paper sx={{ mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
          {/* Row 1: Title + Search + Generate button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>All Client Cases</Typography>
              <Typography variant="caption" color="text.secondary">{intakeClients.length} clients with intake submissions or uploaded documents</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {/* Search bar */}
              <TextField
                size="small"
                placeholder="Search by name, ID or status..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ bgcolor: 'background.paper', width: { xs: '100%', sm: 240 }, mt: { xs: 0.5, sm: 0 } }}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                    </Box>
                  )
                }}
              />
              {/* Generate button */}
              <Button
                variant="contained"
                color="secondary"
                size="small"
                disabled={!selectedClient}
                onClick={async () => {
                  try {
                    const res = await dbService.generateClientCredentials(selectedClient.id);
                    window.alert(`Portal Credentials Generated:\n\nPortal URL: /portal/login\nUsername: ${selectedClient?.id}\nPassword: ${res.password}\n\nPlease share these with the client securely.`);
                  } catch (error) {
                    console.error('Error generating credentials', error);
                    window.alert('Failed to generate credentials. Ensure backend is running.');
                  }
                }}
                sx={{ textTransform: 'none', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Generate Portal Credentials
              </Button>
            </Box>
          </Box>
          {/* Row 2: Filter dropdowns */}
          <FilterPanel
            filters={tableFilters}
            onFilterChange={(key, val) => setTableFilters(prev => ({ ...prev, [key]: val }))}
            onClearFilters={() => setTableFilters({ serviceId: '', status: '', assignedConsultantId: '' })}
            statusOptions={['Under Process', 'Waiting for Payment', 'Documents Pending', 'Completed', 'Cancelled']}
            sx={{ borderRadius: 1.5, p: 1 }}
          />
        </Box>

        {/* Client Table */}
        <Box sx={{ overflowX: 'auto', maxHeight: 280, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                {['Client ID', 'Name', 'Service', 'Status', 'Progression', 'Documents'].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      backgroundColor: 'var(--mui-palette-background-neutral, #E9EDF5)',
                      color: 'var(--mui-palette-text-secondary, #283593)',
                      borderBottom: '2px solid rgba(63,81,181,0.2)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {intakeClients
                .filter(c => {
                  // Search text filter
                  if (clientSearch) {
                    const q = clientSearch.toLowerCase();
                    const matchSearch = (
                      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
                      c.id?.toLowerCase().includes(q) ||
                      (c.status || '').toLowerCase().includes(q) ||
                      (c.serviceId || '').toLowerCase().includes(q)
                    );
                    if (!matchSearch) return false;
                  }
                  // Dropdown filters
                  if (tableFilters.serviceId && c.serviceId !== tableFilters.serviceId) return false;
                  if (tableFilters.status && (c.status || 'Under Process') !== tableFilters.status) return false;
                  if (tableFilters.assignedConsultantId && c.assignedConsultantId !== tableFilters.assignedConsultantId) return false;
                  return true;
                })
                .map((c, idx) => {
                  const isSelected = c.id === selectedClientId;
                  const clientDocs = documents.filter(d => d.clientId === c.id);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedClientId(c.id)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(63,81,181,0.08)' : idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                        borderLeft: isSelected ? '3px solid #3F51B5' : '3px solid transparent',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(63,81,181,0.04)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'; }}
                    >
                      <td style={{ padding: '9px 12px', fontWeight: 700, color: '#3F51B5', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(63,81,181,0.1)' }}>{c.id}</td>
                      <td style={{ padding: '9px 12px', fontWeight: isSelected ? 700 : 500, borderBottom: '1px solid rgba(63,81,181,0.1)', whiteSpace: 'nowrap' }}>
                        {c.firstName} {c.lastName}
                      </td>
                      <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(63,81,181,0.1)', whiteSpace: 'nowrap', color: '#475569', fontSize: '0.78rem' }}>
                        {SERVICES.find(s => s.id === c.serviceId)?.name || `Spain ${c.serviceId?.toUpperCase() || 'VISA'}`}
                      </td>
                      <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(63,81,181,0.1)' }}>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: c.status === 'Completed' ? '#DCFCE7' : c.status === 'Cancelled' ? '#FEE2E2' : '#EEF2FF',
                          color: c.status === 'Completed' ? '#15803D' : c.status === 'Cancelled' ? '#B91C1C' : '#3730A3',
                          whiteSpace: 'nowrap',
                        }}>{c.status || 'Under Process'}</span>
                      </td>
                      <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(63,81,181,0.1)' }}>
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: 12,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          whiteSpace: 'nowrap',
                        }}>{c.visaStatus || 'Document Review'}</span>
                      </td>
                      <td style={{ padding: '9px 12px', borderBottom: '1px solid rgba(63,81,181,0.1)', color: '#475569', fontSize: '0.8rem' }}>
                        {clientDocs.length} file{clientDocs.length !== 1 ? 's' : ''}
                      </td>
                    </tr>
                  );
                })}
              {intakeClients.filter(c => {
                if (clientSearch) {
                  const q = clientSearch.toLowerCase();
                  if (!(`${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q) || (c.status || '').toLowerCase().includes(q) || (c.serviceId || '').toLowerCase().includes(q))) return false;
                }
                if (tableFilters.serviceId && c.serviceId !== tableFilters.serviceId) return false;
                if (tableFilters.status && (c.status || 'Under Process') !== tableFilters.status) return false;
                if (tableFilters.assignedConsultantId && c.assignedConsultantId !== tableFilters.assignedConsultantId) return false;
                return true;
              }).length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontWeight: 500 }}>
                    No clients match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>

      {!selectedClient ? (
        <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3, bgcolor: '#FAFBFD' }}>
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            No client intake submissions available for document review.
          </Typography>
        </Paper>
      ) : (
        <Box className="grid grid-cols-12 gap-7">
          {/* LEFT COLUMN: PDF Intake Form Mockup */}
          <Box className="col-span-12" md={6.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PictureAsPdfIcon color="error" /> Client Profile Intake Sheet (Official PDF)
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handlePrintPDF}
                startIcon={<PictureAsPdfIcon />}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Open / Print PDF
              </Button>
            </Box>

            {/* Simulated Official A4 PDF Document Sheet */}
            <Paper
              elevation={0}
              sx={{
                p: 4.5,
                bgcolor: '#FFFFFF',
                color: '#0F172A',
                border: '1.5px solid #E2E8F0',
                borderRadius: 2.5,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                position: 'relative',
                minHeight: '620px',
                fontFamily: 'Courier, monospace' // Giving it a document type feel
              }}
            >
              {/* Draft Stamp */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '12%',
                  right: '10%',
                  border: '3px dashed #10B981',
                  color: '#10B981',
                  borderRadius: 1,
                  px: 2,
                  py: 0.5,
                  transform: 'rotate(15deg)',
                  opacity: 0.85,
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: 1.5,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <StampIcon sx={{ fontSize: '1rem' }} /> INTAKE RECEIVED
              </Box>

              {/* Document Header */}
              <Box sx={{ borderBottom: '2px solid #0F172A', pb: 2.5, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 0.5, fontSize: '0.85rem' }}>
                      AAA IMMIGRATION SERVICES LLC
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontSize: '0.68rem', mt: 0.5 }}>
                      Calle Gran Vía 28, Centro, 28013 Madrid, España
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#475569', display: 'block', fontSize: '0.68rem' }}>
                      Tel: +34 91 123 4567 | info@aaabusinessconsultancy.com
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>
                      FORM ID: INTAKE-{selectedClient.id}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>
                      Date: {new Date(selectedClient.onboardingDate || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Title */}
              <Typography variant="h6" align="center" sx={{ fontWeight: 900, mb: 4, letterSpacing: 1, fontSize: '1.05rem', textDecoration: 'underline' }}>
                SPAIN RESIDENCY & IMMIGRATION PROFILING SHEET
              </Typography>

              {/* Section 1: Client Metadata */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, bgcolor: '#F1F5F9', px: 1, py: 0.5, mb: 2, fontSize: '0.78rem' }}>
                  1. GENERAL APPLICANT METADATA
                </Typography>
                <Box className="grid grid-cols-12 gap-5" sx={{ pl: 1 }}>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Full Legal Name:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {selectedClient.firstName?.toUpperCase()} {selectedClient.lastName?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Client ID Reference:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>{selectedClient.id}</Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Date of Birth:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {selectedClient.dateOfBirth || '14 DEC 1988'}
                    </Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Citizenship / Nationality:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {selectedClient.nationality?.toUpperCase() || 'BRITISH'}
                    </Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Primary Communication Email:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.68rem' }}>{selectedClient.email}</Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Phone Number:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>{selectedClient.phone}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section 2: Visa Application details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, bgcolor: '#F1F5F9', px: 1, py: 0.5, mb: 2, fontSize: '0.78rem' }}>
                  2. VISA PROCESS DETAILS
                </Typography>
                <Box className="grid grid-cols-12 gap-5" sx={{ pl: 1 }}>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Passport Number:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {selectedClient.passportNumber || 'G9023812'}
                    </Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Preferred Visa Pathway:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {getServiceLabel(selectedClient.serviceId)}
                    </Typography>
                  </Box>
                  <Box className="col-span-6">
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Preferred Communication Language:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {selectedClient.preferredLanguage || 'English'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section 3: Address details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, bgcolor: '#F1F5F9', px: 1, py: 0.5, mb: 2, fontSize: '0.78rem' }}>
                  3. REGISTERED LIVING ADDRESS
                </Typography>
                <Box sx={{ pl: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.68rem' }}>Home Address:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedClient.address || 'Calle Gran Vía 28, Centro, 28013 Madrid, España'}
                  </Typography>
                </Box>
              </Box>

              {/* Footer barcode/sign */}
              <Box sx={{ mt: 6, borderTop: '1px dashed #94A3B8', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ border: '1px solid black', p: 0.5, bgcolor: '#F8FAFC' }}>
                  {/* Mock Barcode using text */}
                  <Typography variant="caption" sx={{ letterSpacing: 3, fontWeight: 900, fontSize: '0.68rem' }}>
                    ||| | ||| || ||| | ||| |||| |
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.6rem' }}>
                  Digitally signed via Secure IP Check-out Simulator.
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* RIGHT COLUMN: Document Verification Controls */}
          <Box className="col-span-12" md={5.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="secondary" /> Uploaded Document Checklist
              </Typography>
            </Box>

            {clientDocs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3, bgcolor: '#FAFBFD' }}>
                <Typography color="text.secondary" variant="body2">
                  No files submitted yet by the client.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2.5}>
                {clientDocs.map((doc) => {
                  const isApproved = doc.status === 'Approved';
                  const isRejected = doc.status === 'Rejected';
                  const isPending = !isApproved && !isRejected;

                  return (
                    <Card
                      key={doc.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isApproved ? 'success.main' : isRejected ? 'error.main' : 'divider',
                        boxShadow: 'none',
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ p: 2, bgcolor: isApproved ? '#F0FDF4' : isRejected ? '#FEF2F2' : '#F8FAFC', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InsertDriveFileIcon color="action" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {doc.name || doc.fileName}
                          </Typography>
                        </Box>
                        <Chip
                          label={doc.status || 'Pending'}
                          color={isApproved ? 'success' : isRejected ? 'error' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 'bold', height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Category:</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{doc.category}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary" display="block">Size:</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{doc.fileSize || '1.5 MB'}</Typography>
                          </Box>
                        </Box>

                        {doc.comment && (
                          <Box sx={{ mb: 2, p: 1.5, bgcolor: isApproved ? '#ECFDF5' : '#FEF2F2', borderLeft: '3px solid', borderColor: isApproved ? '#10B981' : '#EF4444', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: isApproved ? '#065F46' : '#991B1B', fontWeight: 600, display: 'block' }}>
                              Comment/Reason:
                            </Typography>
                            <Typography variant="caption" sx={{ color: isApproved ? '#047857' : '#B91C1C', fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                              {doc.comment}
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 1.8 }} />

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleOpenMockFile(doc)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            Open File
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={isApproved || reviewDocumentMutation.isLoading}
                            onClick={() => {
                              reviewDocumentMutation.mutate({
                                documentId: doc.id,
                                status: 'Approved',
                                comment: 'Document verified and approved.'
                              });
                            }}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            disabled={isRejected || reviewDocumentMutation.isLoading}
                            onClick={() => {
                              const reason = window.prompt(`Enter reason for rejecting "${doc.name || doc.fileName}":`);
                              if (reason !== null) {
                                reviewDocumentMutation.mutate({
                                  documentId: doc.id,
                                  status: 'Rejected',
                                  comment: reason || 'Document rejected.'
                                });
                              }
                            }}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Box>
      )}

      {/* Dialog Preview removed - files now open directly in new tabs */}
    </Box>
  );
};

export default AdminDocumentVerificationDashboard;
