import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

// Icons
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ShieldAlertIcon from '@mui/icons-material/Shield';

export const AiSummaryModal = ({ open, onClose, clientData, isLead = false }) => {
  if (!clientData) return null;

  // Mocked AI Calculations based on client profile
  const progressPercent = isLead ? 25 : (clientData.visaStatus === 'Approved' ? 100 : (clientData.visaStatus === 'Submitted - Pending Decision' ? 80 : 45));
  const leadTemp = isLead ? (clientData.status === 'Waiting for Payment' ? 'Hot' : 'Warm') : 'Hot';
  const priority = isLead ? 'Medium' : (clientData.visaStatus === 'Document Review' ? 'High' : 'Medium');
  
  // Custom success rate formula based on nationality & income
  let successProbability = 82;
  if (clientData.nationality === 'Russian' || clientData.nationality === 'Chinese') successProbability = 74;
  if (clientData.serviceId === 'dnv') successProbability = 88;
  if (clientData.serviceId === 'nlv') successProbability = 78;

  const getPriorityColor = (p) => {
    if (p === 'High') return 'error';
    if (p === 'Medium') return 'warning';
    return 'success';
  };

  const getTempColor = (t) => {
    if (t === 'Hot') return '#EF4444';
    if (t === 'Warm') return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.neutral', py: 2 }}>
        <SmartToyIcon color="secondary" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>AI Client Profile Analyzer</Typography>
          <Typography variant="caption" color="text.secondary">Automated Case Digest & Prediction Report</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Grid container spacing={3}>
          {/* Top Overview Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justify: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Overall Progress</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, my: 1, color: 'secondary.main' }}>{progressPercent}%</Typography>
              <LinearProgress variant="determinate" value={progressPercent} color="secondary" sx={{ height: 8, borderRadius: 4, mb: 1 }} />
              <Typography variant="caption" color="text.secondary">Step: {clientData.visaStatus || clientData.status || 'Intake'}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justify: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Lead Temperature & Priority</Typography>
              <Box sx={{ my: 1.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Chip 
                  icon={<LocalFireDepartmentIcon sx={{ '&&': { color: '#fff' } }} />} 
                  label={`${leadTemp} Temp`} 
                  sx={{ bgcolor: getTempColor(leadTemp), color: '#fff', fontWeight: 700 }} 
                />
                <Chip 
                  label={`${priority} Priority`} 
                  color={getPriorityColor(priority)} 
                  sx={{ fontWeight: 700 }} 
                />
              </Box>
              <Typography variant="caption" color="text.secondary">Calculated from recent CRM activities.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justify: 'center', border: '1px dashed', borderColor: 'error.main', bgcolor: '#FEF2F2', boxShadow: 'none' }}>
              <Typography variant="caption" color="error" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justify: 'center', gap: 0.5 }}>
                <ShieldAlertIcon sx={{ fontSize: '1rem' }} /> Success Probability
              </Typography>
              <Typography variant="h3" color="error.main" sx={{ fontWeight: 900, my: 0.5 }}>{successProbability}%</Typography>
              <Typography variant="caption" color="error" sx={{ fontWeight: 700, opacity: 0.8 }}>
                * INTERNAL USE ONLY - HIDDEN FROM CLIENT
              </Typography>
            </Paper>
          </Grid>

          {/* AI In-depth Sections */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>🎯 Client Objective & Interest</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Client is focused on securing Spanish residency via the <strong>{clientData.serviceId?.toUpperCase() || 'visa'} Pathway</strong>. Target timeline is immediate relocation. Wants full assistance including sworn translations for family setup.
              </Typography>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>⚠️ Missing Requirements & Potential Risks</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                  <WarningIcon sx={{ fontSize: '1rem' }} /> Criminal Background check with Apostille is missing.
                </Typography>
                <Typography variant="body2" color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                  <WarningIcon sx={{ fontSize: '1rem' }} /> Bank statements must translate passive income descriptions to Spanish.
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
                  <CheckCircleIcon sx={{ fontSize: '1rem' }} /> Passport copies verified.
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>⚖️ Eligibility Assessment Digest</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Current documentation suggests high eligibility under passive income/remote worker thresholds. Risks are minimal, pending validation of the clean criminal background registry.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>💬 Communication Summary</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                Consultations completed successfully. Key queries were regarding remote tax implications in Madrid and timeline for dependent entry visa submission. Answers were dispatched via WhatsApp templates.
              </Typography>
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>📅 Last Activity & Status</Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Date:</strong> 2026-06-18 at 14:15 PM<br/>
                <strong>Last Action:</strong> Client uploaded TIE fingerprint scheduling request details.<br/>
                <strong>Staff Action:</strong> Operator marked TIE file review status as queued.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>🚀 Next Recommended Action</Typography>
              <Typography variant="body2" sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: 2, borderLeft: '3px solid', borderColor: 'secondary.main', fontWeight: 600 }}>
                Request additional criminal background documentation and dispatch Spain payment links.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AiSummaryModal;
