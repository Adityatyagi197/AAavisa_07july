import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Setup Axios instance with JWT Interceptor
const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dbService = {
  // LEADS
  getLeads: async () => {
    const res = await apiClient.get('/leads');
    return res.data;
  },
  createLead: async (lead) => {
    const res = await apiClient.post('/leads', lead);
    return res.data;
  },
  updateLeadStatus: async (leadId, status) => {
    const res = await apiClient.post('/leads/status', { leadId, status });
    return res.data;
  },
  assignAgent: async (leadId, agentId) => {
    const res = await apiClient.post('/leads/assign', { leadId, agentId });
    return res.data;
  },

  // CLIENTS & CASES
  getClients: async () => {
    const res = await apiClient.get('/clients');
    return res.data;
  },
  createClient: async (client) => {
    const res = await apiClient.post('/clients', client);
    return res.data;
  },
  updateClientVisaStatus: async (clientId, visaStatus, status) => {
    const res = await apiClient.patch(`/clients/${clientId}/status`, { visaStatus, status });
    return res.data;
  },
  generateClientCredentials: async (clientId) => {
    const res = await apiClient.post(`/clients/${clientId}/credentials`);
    return res.data;
  },
  clientLogin: async (clientId, password) => {
    const res = await apiClient.post('/clients/login', { clientId, password });
    return res.data;
  },
  getActiveCases: async () => {
    const res = await apiClient.get('/cases/active');
    return res.data;
  },
  getClosedCases: async () => {
    const res = await apiClient.get('/cases/closed');
    return res.data;
  },

  // CONSULTATIONS
  getConsultations: async () => {
    const res = await apiClient.get('/consultations');
    return res.data;
  },
  createConsultation: async (cons) => {
    const res = await apiClient.post('/consultations', cons);
    return res.data;
  },
  updateConsultationStatus: async (consultationId, status) => {
    const res = await apiClient.patch(`/consultations/${consultationId}/outcome`, { status });
    return res.data;
  },
  completeConsultation: async (consultationId, outcome, notes) => {
    const res = await apiClient.patch(`/consultations/${consultationId}/outcome`, { 
      status: 'Completed', 
      eligibility: outcome, 
      internalNotes: notes 
    });
    return res.data;
  },
  bookClientConsultation: async (data) => {
    const res = await apiClient.post('/consultations', data);
    return res.data;
  },

  // PAYMENTS
  getPayments: async () => {
    const res = await apiClient.get('/payments');
    return res.data;
  },
  generatePaymentLink: async (payment) => {
    const res = await apiClient.post('/payments/generate-link', payment);
    return res.data;
  },
  updatePaymentStatus: async (paymentId, status, paymentMethod, transactionId) => {
    const res = await apiClient.patch(`/payments/${paymentId}/status`, { status, paymentMethod, transactionId });
    return res.data;
  },

  // DOCUMENTS
  getDocuments: async () => {
    const res = await apiClient.get('/documents');
    return res.data;
  },
  uploadDocument: async (doc) => {
    const formData = new FormData();
    formData.append('file', doc.file);
    formData.append('clientId', doc.clientId);
    formData.append('category', doc.category);

    const res = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  reviewDocument: async (documentId, status, comment) => {
    const res = await apiClient.patch(`/documents/${documentId}/verify`, { status, feedbackComment: comment });
    return res.data;
  },

  // MARKETING
  getMarketingSpend: async () => {
    const res = await apiClient.get('/marketing/spend');
    return res.data;
  },
  updateMarketingSpend: async (spendData) => {
    const res = await apiClient.post('/marketing/spend', spendData);
    return res.data;
  },

  // SETTINGS & CUSTOMIZATION
  getCustomizationSettings: async () => {
    try {
      const res = await apiClient.get('/settings/customization');
      const localDataStr = localStorage.getItem('crm_customization_settings');
      if (localDataStr) {
        try {
          const localData = JSON.parse(localDataStr);
          // We prefer localData over backend during development to prevent data loss on nodemon restarts
          // For rolesDefinition, we must ensure it replaces the default rather than just merging if it's longer
          return { ...res.data, ...localData, rolesDefinition: localData.rolesDefinition || res.data.rolesDefinition };
        } catch (e) {
          console.error('Error parsing local settings', e);
        }
      }
      return res.data;
    } catch (error) {
      const localDataStr = localStorage.getItem('crm_customization_settings');
      if (localDataStr) {
        return JSON.parse(localDataStr);
      }
      throw error;
    }
  },
  saveCustomizationSettings: async (settings) => {
    try {
      localStorage.setItem('crm_customization_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to local storage', e);
    }
    const res = await apiClient.put('/settings/customization', { settings });
    return res.data;
  },
  getLeadStages: async () => {
    const res = await apiClient.get('/settings/lead-stages');
    return res.data;
  },
  saveLeadStages: async (stages) => {
    const res = await apiClient.put('/settings/lead-stages', stages);
    return res.data;
  },

  // AGENTS
  getAgents: async () => {
    const res = await apiClient.get('/users/agents');
    return res.data;
  },
  createAgent: async (agent) => {
    const payload = {
      fullName: agent.name,
      email: agent.email,
      password: agent.password,
      hotlineNumber: agent.phone,
      role: agent.role,
      spokenLanguages: agent.languages,
      nationalities: agent.nationalities,
      commissionRate: agent.commissionRate,
      immigrationBio: agent.bio,
      customPermissions: agent.customPermissions
    };
    const res = await apiClient.post('/users', payload);
    return res.data;
  },
  updateAgent: async (agent) => {
    const payload = {
      fullName: agent.name,
      email: agent.email,
      hotlineNumber: agent.phone,
      role: agent.role,
      spokenLanguages: agent.languages,
      nationalities: agent.nationalities,
      commissionRate: agent.commissionRate,
      immigrationBio: agent.bio,
      customPermissions: agent.customPermissions
    };
    const res = await apiClient.put(`/users/${agent.id}`, payload);
    return res.data;
  },
  resetAgentPassword: async (id, newPassword) => {
    const res = await apiClient.put(`/users/${id}/password`, { newPassword });
    return res.data;
  },
  deleteAgent: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
  getConsultants: async () => {
    const res = await apiClient.get('/users/agents');
    // filter consultants if needed
    return res.data;
  },

  // AUTH
  authLogin: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  clientLogin: async (clientId, password) => {
    const res = await apiClient.post('/clients/login', { clientId, password });
    return res.data;
  },
  changeClientPassword: async (clientId, newPassword) => {
    const res = await apiClient.put(`/clients/${clientId}/change-password`, { newPassword });
    return res.data;
  },

  // STUBS (To prevent UI crash where APIs are not yet built)
  getNotifications: async () => [],
  addNotification: async () => ({}),
  markNotificationRead: async (id) => ({ id }),
  markAllNotificationsRead: async () => ({}),
  getConversations: async () => [],
  getSettings: async () => {
    const res = await apiClient.get('/settings/company');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await apiClient.put('/settings/company', data);
    return res.data;
  },
  getServices: async () => {
    const res = await apiClient.get('/settings/services');
    return res.data;
  },
  updateServices: async (data) => {
    const res = await apiClient.put('/settings/services', data);
    return res.data;
  },
  getPackages: async () => {
    const res = await apiClient.get('/settings/packages');
    return res.data;
  },
  updatePackages: async (data) => {
    const res = await apiClient.put('/settings/packages', data);
    return res.data;
  },
  getEmailTemplates: async () => {
    const res = await apiClient.get('/settings/templates/email');
    return res.data;
  },
  updateEmailTemplates: async (data) => {
    const res = await apiClient.put('/settings/templates/email', data);
    return res.data;
  },
  getWhatsappTemplates: async () => {
    const res = await apiClient.get('/settings/templates/whatsapp');
    return res.data;
  },
  updateWhatsappTemplates: async (data) => {
    const res = await apiClient.put('/settings/templates/whatsapp', data);
    return res.data;
  },
  getCommissionRates: async () => {
    const res = await apiClient.get('/payments/commissions/rates');
    return res.data;
  },
  getCommissionsReport: async () => {
    const res = await apiClient.get('/payments/commissions/report');
    return res.data;
  },
  updateCommissionRate: async (agentId, type, value) => {
    const res = await apiClient.patch('/payments/commissions/rates', { agentId, type, value });
    return res.data;
  },
  getRefundRequests: async () => {
    const res = await apiClient.get('/payments/refunds');
    return res.data;
  },
  createRefundRequest: async (data) => {
    const res = await apiClient.post('/payments/refunds', data);
    return res.data;
  },
  updateRefundStatus: async (refundId, status) => {
    const res = await apiClient.patch(`/payments/refunds/${refundId}/status`, { status });
    return res.data;
  },
  getBackupLogs: async () => []
};
