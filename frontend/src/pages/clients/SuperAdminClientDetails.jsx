import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Components & Services
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import AppCard from '../../components/AppCard';
import Timeline from '../../components/Timeline';
import AppModal from '../../components/AppModal';
import FileUploader from '../../components/FileUploader';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';
import { SERVICES, PACKAGES } from '../../constants/mockData';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AiSummaryModal from '../../components/AiSummaryModal';

export const SuperAdminClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { isAdmin, isSuperAdmin, isOperations, currentUser } = useAuth();

  const { data: customizationSettings } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings
  });

  const roleConfig = (customizationSettings?.[currentUser?.id] || customizationSettings?.[currentUser?.role]) || {};
  const clientsActions = roleConfig.actions?.clients || { canChangeVisaStatus: true, canVerifyDocs: true, canDelete: true };

  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');

  let defaultTab = 0;
  if (tabParam === 'documents' || tabParam === '1') {
    defaultTab = 1;
  } else if (location.state?.initialTab !== undefined) {
    defaultTab = location.state.initialTab;
  }

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedVisaStatus, setSelectedVisaStatus] = useState('');
  const [selectedBillingStatus, setSelectedBillingStatus] = useState('');
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);

  // Fetch client details
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients });

  const client = clients.find((c) => c.id === id);

  // Fetch payments, documents, consultations
  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: dbService.getPayments });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: dbService.getDocuments });

  const { data: consultations = [] } = useQuery({
    queryKey: ['consultations'],
    queryFn: dbService.getConsultations });

  // Fetch Consultants dynamically
  const { data: consultants = [] } = useQuery({
    queryKey: ['consultants'],
    queryFn: dbService.getConsultants });

  // Fetch Leads dynamically
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: dbService.getLeads });

  // Fetch dynamic lifecycle stages
  const { data: leadStages = [] } = useQuery({
    queryKey: ['lead-stages'],
    queryFn: dbService.getLeadStages });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ clientId, visaStatus, status }) =>
      dbService.updateClientVisaStatus(clientId, visaStatus, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showAlert('Client status updated', 'success');
      setStatusModalOpen(false);
    } });

  const uploadDocMutation = useMutation({
    mutationFn: dbService.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showAlert('Document uploaded and queued for review', 'success');
    } });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Client not found</Typography>
        <Button startIcon={<KeyboardArrowLeftIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  // Linked details
  const clientPayments = payments.filter((p) => p.clientId === client.id);
  const clientDocuments = documents.filter((d) => d.clientId === client.id);
  const clientConsultations = consultations.filter((c) => c.leadId === client.id || c.clientName === `${client.firstName} ${client.lastName}`);

  const serviceObj = SERVICES.find((s) => s.id === client.serviceId);
  const packageObj = PACKAGES.find((p) => p.id === client.packageId);
  const consultantObj = consultants.find((c) => c.id === client.assignedConsultantId);
  const originalLead = leads.find((l) => l.id === client.leadId || l.email === client.email);

  const handleOpenStatusModal = () => {
    setSelectedVisaStatus(client.visaStatus);
    setSelectedBillingStatus(client.status);
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = () => {
    updateStatusMutation.mutate({
      clientId: client.id,
      visaStatus: selectedVisaStatus,
      status: selectedBillingStatus });
  };

  const handleDocUploaded = (docData) => {
    uploadDocMutation.mutate(docData);
  };

  const visaStatuses = [
    'Not Started',
    'Document Preparation',
    'Document Review',
    'Apostille & Translations',
    'Submitted - Pending Decision',
    'NIE / Local Registration',
    'Visa Approved',
    'Rejected',
    'Closed',
  ];

  const billingStatuses = leadStages.map(s => s.name);

  return (
    <Box>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Clients
      </Button>

      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        subtitle={`Client Registry: ${client.id} | Managed by: ${consultantObj ? consultantObj.name : 'Unknown'}`}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="contained" 
              color="info" 
              onClick={() => setAiSummaryOpen(true)}
              startIcon={<SmartToyIcon />}
              sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', color: 'white', '&:hover': { opacity: 0.95 } }}
            >
              AI Summary
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                const link = `${window.location.origin}/#/public/intake/client/${client.id}`;
                navigator.clipboard.writeText(link);
                showAlert('Client document upload link copied!', 'success');
              }}
              sx={{ textTransform: 'none' }}
            >
              Copy Upload Link
            </Button>
            {clientsActions.canChangeVisaStatus !== false && (
              <Button variant="contained" onClick={handleOpenStatusModal} sx={{ textTransform: 'none' }}>
                Update Progression Status
              </Button>
            )}
          </Stack>
        }
      />

      <Box className="grid grid-cols-12 gap-2">
        {/* Left pane */}
        <Box className="col-span-12" md={3.5}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 72, height: 72, mx: 'auto', mb: 1.5, bgcolor: 'secondary.main', fontSize: '1.8rem', fontWeight: 600 }}
              >
                {client.firstName[0]}
                {client.lastName[0]}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {client.firstName} {client.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {client.email}
              </Typography>
              <Stack direction="column" spacing={1} alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Visa Process</Typography>
                  <StatusBadge status={client.visaStatus} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Billing Status</Typography>
                  <StatusBadge status={client.status} />
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Target Service Pathway</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{serviceObj?.name || client.serviceId}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Enrolled Package</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{packageObj?.name || client.packageId}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Phone Contact</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{client.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Nationality</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{client.nationality}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Language Preference</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{client.preferredLanguage}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Country of Residence</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{client.residence || 'Not Specified'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Number of Applicants</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{client.applicantsCount || 1}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Total Payment Paid</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  €{payments.filter(p => p.clientId === client.id && p.status === 'Paid').reduce((sum, p) => sum + p.amount - p.discount, 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right pane */}
        <Box className="col-span-12" md={8.5}>
          <AppCard noPadding>
            <Tabs
              value={activeTab}
              onChange={(e, newTab) => setActiveTab(newTab)}
              sx={{ px: 3, pt: 1, borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Tab label="Profile Summary" sx={{ fontWeight: 600 }} />
              <Tab label="Documents Upload" sx={{ fontWeight: 600 }} />
              <Tab label="Payments & Invoices" sx={{ fontWeight: 600 }} />
              <Tab label="Meetings / Consultations" sx={{ fontWeight: 600 }} />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      Case Notes & Profile Summary
                    </Typography>
                    <Typography variant="body2" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.neutral' }}>
                      {client.profileSummary || 'No case brief uploaded.'}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Case Comments
                    </Typography>
                    <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none' }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField 
                          fullWidth 
                          placeholder="Write a comment... (e.g. Documents sent to lawyer)" 
                          size="small"
                          id="comment-input"
                        />
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={() => {
                            const input = document.getElementById('comment-input');
                            if (!input.value) return;
                            const newComment = {
                              text: input.value,
                              author: 'Admin',
                              date: new Date().toLocaleDateString(),
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            const updatedComments = [...(client.comments || []), newComment];
                            // In real app, call mutation
                            // dbService.updateClient({ ...client, comments: updatedComments });
                            client.comments = updatedComments; // mock local update
                            input.value = '';
                            showAlert('Comment added successfully!', 'success');
                          }}
                        >
                          Add Comment
                        </Button>
                      </Box>
                      <List disablePadding>
                        {(client.comments || []).map((c, idx) => (
                          <Paper key={idx} sx={{ p: 1.5, mb: 1.5, bgcolor: 'background.neutral', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.author}</Typography>
                              <Typography variant="caption" color="text.secondary">{c.date} at {c.time}</Typography>
                            </Box>
                            <Typography variant="body2">{c.text}</Typography>
                          </Paper>
                        ))}
                        {(!client.comments || client.comments.length === 0) && (
                          <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
                        )}
                      </List>
                    </Paper>
                  </Box>

                  {originalLead && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Original Lead History & Timeline
                      </Typography>
                      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: 'none' }}>
                        {originalLead.notes && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                              Lead Intake Notes
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.neutral', borderLeft: '3px solid', borderColor: 'secondary.main', whiteSpace: 'pre-line' }}>
                              {originalLead.notes}
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                          Intake Event Timeline
                        </Typography>
                        <Timeline items={originalLead.timeline || []} />
                      </Paper>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      Enrolled Package Benefits Checklist
                    </Typography>
                    <Box className="grid grid-cols-12 gap-2">
                      {packageObj?.includes.map((benefit, idx) => (
                        <Box className="col-span-12 sm:col-span-6" key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="body2">{benefit}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Upload Checklist Documents
                  </Typography>
                  <FileUploader
                    onUpload={handleDocUploaded}
                    clientId={client.id}
                    clientName={`${client.firstName} ${client.lastName}`}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Uploaded Documents List
                  </Typography>

                  {clientDocuments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No documents uploaded yet.
                    </Typography>
                  ) : (
                    <List disablePadding>
                      {clientDocuments.map((doc) => (
                        <Paper
                          key={doc.id}
                          sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center' }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {doc.name || doc.fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Category: {doc.category} | Size: {doc.fileSize || '1.5 MB'}
                            </Typography>
                            {doc.comment && (
                              <Box sx={{ mt: 1, p: 1, borderRadius: 1.5, bgcolor: doc.status === 'Approved' ? '#ECFDF5' : '#FEF2F2', borderLeft: '3px solid', borderColor: doc.status === 'Approved' ? '#10B981' : '#EF4444' }}>
                                <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', color: doc.status === 'Approved' ? '#065F46' : '#991B1B' }}>
                                  Note: {doc.comment}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                            <StatusBadge status={doc.status} />
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => navigate('/documents/verify')}
                              sx={{ textTransform: 'none' }}
                            >
                              Review
                            </Button>
                          </Box>
                        </Paper>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Invoices & Retainers
                  </Typography>

                  {clientPayments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No invoices found.
                    </Typography>
                  ) : (
                    clientPayments.map((pay) => (
                      <Paper
                        key={pay.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center' }}
                      >
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Invoice ID</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{pay.id}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Due Date</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{pay.dueDate}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Amount</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>€{pay.amount - pay.discount}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <StatusBadge status={pay.status} />
                          <Button
                            size="small"
                            onClick={() => navigate(`/payments/invoice-details/${pay.id}`)}
                          >
                            View details
                          </Button>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              )}

              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Session Log
                  </Typography>

                  {clientConsultations.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                      No scheduled meetings linked.
                    </Typography>
                  ) : (
                    clientConsultations.map((cons) => (
                      <Paper
                        key={cons.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center' }}
                      >
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Eligibility Meeting Session
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scheduled: {cons.meetingDate} at {cons.meetingTime} | Duration: {cons.durationMinutes} min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <StatusBadge status={cons.status} />
                          <Button
                            size="small"
                            onClick={() => navigate(`/consultations/details/${cons.id}`)}
                          >
                            Outcome Details
                          </Button>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              )}
            </Box>
          </AppCard>
        </Box>
      </Box>

      {/* MODAL */}
      <AppModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Customer Registry Statuses"
        actions={
          <>
            <Button onClick={() => setStatusModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              variant="contained"
              color="secondary"
              disabled={updateStatusMutation.isPending}
            >
              Update
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            select
            value={selectedVisaStatus}
            onChange={(e) => setSelectedVisaStatus(e.target.value)}
            label="Spain Visa Progression"
            fullWidth
          >
            {visaStatuses.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={selectedBillingStatus}
            onChange={(e) => setSelectedBillingStatus(e.target.value)}
            label="Billing Status"
            fullWidth
          >
            {billingStatuses.map((st) => (
              <MenuItem key={st} value={st}>
                {st}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </AppModal>
      <AiSummaryModal open={aiSummaryOpen} onClose={() => setAiSummaryOpen(false)} clientData={client} isLead={false} />
    </Box>
  );
};

export default SuperAdminClientDetails;
