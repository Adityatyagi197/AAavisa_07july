import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Services
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import { useAlert } from '../../contexts/AlertContext';

const AVAILABLE_MENUS = [
  'Dashboard',
  'Agents',
  'Active Cases',
  'Doc Verification',
  'Finance',
  'Closed Cases',
  'Clients',
  'Leads',
  'Social Inbox',
  'Marketing',
  'Calendar',
  'All Agents Performance',
  'Integrations'
];

const AVAILABLE_CARDS = [
  'Total Clients',
  'Today\'s Clients',
  'Total Consultations',
  'Today\'s Consultations',
  'Upcoming Meetings',
  'Pending Payments',
  'Total Revenue',
  'Active Cases',
  'Completed Cases',
  'Lost Consultations',
  'Revenue Today',
  'Outstanding Revenue',
  'Refunded (50% Rejections)'
];

const ROLES = [
  { id: 'admin', label: 'Admin (General Manager)' },
  { id: 'operations', label: 'Operations Admin' },
  { id: 'finance', label: 'Finance Officer' },
  { id: 'consultant', label: 'Consultant / Visa Agent' },
  { id: 'marketing', label: 'Marketing Executive' }
];

const PRESET_COLORS = [
  { value: '#2196F3', name: 'Blue' },
  { value: '#FF9800', name: 'Amber' },
  { value: '#FF5722', name: 'Orange' },
  { value: '#4CAF50', name: 'Green' },
  { value: '#E91E63', name: 'Pink' },
  { value: '#9C27B0', name: 'Purple' },
  { value: '#3F51B5', name: 'Indigo' },
  { value: '#009688', name: 'Teal' },
  { value: '#F44336', name: 'Red' },
  { value: '#9E9E9E', name: 'Gray' }
];

export const SuperAdminCustomization = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  
  // Top level tabs: 0 = Role Permissions, 1 = Stage Manager
  const [topTab, setTopTab] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const currentRoleId = ROLES[activeTab].id;

  // Local state for modified customization
  const [localSettings, setLocalSettings] = useState(null);

  // Modal / Editing states for Custom Stages
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null); // null means adding new
  const [stageForm, setStageForm] = useState({ name: '', emoji: '🆕', color: '#2196F3', type: 'lead' });

  // Fetch customization settings
  const { data: customizationSettings, isLoading: isCustomizationLoading } = useQuery({
    queryKey: ['customization-settings'],
    queryFn: dbService.getCustomizationSettings });

  // Fetch customizable stages
  const { data: leadStages = [], isLoading: isStagesLoading } = useQuery({
    queryKey: ['lead-stages'],
    queryFn: dbService.getLeadStages });

  useEffect(() => {
    if (customizationSettings && !localSettings) {
      setLocalSettings(customizationSettings);
    }
  }, [customizationSettings, localSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: dbService.saveCustomizationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customization-settings'] });
      showAlert('Customization layout settings updated in real-time!', 'success');
    }
  });

  const saveStagesMutation = useMutation({
    mutationFn: dbService.saveLeadStages,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-stages'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showAlert('Lifecycle stages saved successfully!', 'success');
    }
  });

  const handleToggleMenu = (menu) => {
    if (!localSettings) return;
    const currentMenus = localSettings[currentRoleId]?.menus || [];
    const updatedMenus = currentMenus.includes(menu)
      ? currentMenus.filter(m => m !== menu)
      : [...currentMenus, menu];

    setLocalSettings({
      ...localSettings,
      [currentRoleId]: {
        ...localSettings[currentRoleId],
        menus: updatedMenus
      }
    });
  };

  const handleToggleCard = (card) => {
    if (!localSettings) return;
    const currentCards = localSettings[currentRoleId]?.cards || [];
    const updatedCards = currentCards.includes(card)
      ? currentCards.filter(c => c !== card)
      : [...currentCards, card];

    setLocalSettings({
      ...localSettings,
      [currentRoleId]: {
        ...localSettings[currentRoleId],
        cards: updatedCards
      }
    });
  };

  const handleToggleFeature = (feature) => {
    if (!localSettings) return;
    const currentFeatures = localSettings[currentRoleId]?.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];

    setLocalSettings({
      ...localSettings,
      [currentRoleId]: {
        ...localSettings[currentRoleId],
        features: updatedFeatures
      }
    });
  };

  const handleSave = () => {
    if (!localSettings) return;
    saveSettingsMutation.mutate(localSettings);
  };

  const handleResetDefaults = () => {
    const DEFAULT_CUSTOMIZATION = {
      allowAdminCustomOverrides: false,
      admin: {
        menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
        cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)'],
        features: ['canEditTranslationRates']
      },
      operations: {
        menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
        cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases'],
        features: []
      },
      finance: {
        menus: ['Dashboard', 'Finance'],
        cards: ['Total Revenue', 'Pending Payments'],
        features: []
      },
      consultant: {
        menus: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
        cards: ['Upcoming Meetings', 'Active Cases'],
        features: []
      },
      marketing: {
        menus: ['Dashboard', 'Leads', 'Marketing'],
        cards: ['Total Consultations', 'Today\'s Consultations'],
        features: []
      }
    };
    setLocalSettings(DEFAULT_CUSTOMIZATION);
    saveSettingsMutation.mutate(DEFAULT_CUSTOMIZATION);
  };

  // Stage CRUD operations
  const handleOpenAddStage = () => {
    setEditingStage(null);
    setStageForm({ name: '', emoji: '🆕', color: '#2196F3', type: 'lead' });
    setStageDialogOpen(true);
  };

  const handleOpenEditStage = (stage) => {
    setEditingStage(stage.id);
    setStageForm({ name: stage.name, emoji: stage.emoji || '🆕', color: stage.color || '#2196F3', type: stage.type || 'lead' });
    setStageDialogOpen(true);
  };

  const handleSaveStage = () => {
    if (!stageForm.name) return;
    let updatedStages = [...leadStages];
    if (editingStage) {
      updatedStages = updatedStages.map(s => s.id === editingStage ? { ...s, ...stageForm } : s);
    } else {
      const newId = 'stage_' + Math.random().toString(36).substring(2, 9);
      updatedStages.push({ id: newId, ...stageForm });
    }
    saveStagesMutation.mutate(updatedStages);
    setStageDialogOpen(false);
  };

  const handleDeleteStage = (id) => {
    if (window.confirm('Are you sure you want to delete this stage? Active leads/clients in this stage will revert to default.')) {
      const updatedStages = leadStages.filter(s => s.id !== id);
      saveStagesMutation.mutate(updatedStages);
    }
  };

  const handleMoveStage = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === leadStages.length - 1) return;
    
    const updatedStages = [...leadStages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [movedStage] = updatedStages.splice(index, 1);
    updatedStages.splice(targetIndex, 0, movedStage);
    saveStagesMutation.mutate(updatedStages);
  };

  const handleResetStages = () => {
    if (window.confirm('Are you sure you want to reset lifecycle stages to their original factory defaults?')) {
      const DEFAULT_LEAD_STAGES = [
        { id: 'stage_new_lead', name: 'New Lead', type: 'lead', color: '#2196F3', emoji: '🆕' },
        { id: 'stage_hot_lead', name: 'Hot Lead', type: 'lead', color: '#FF9800', emoji: '🔥' },
        { id: 'stage_processing', name: 'Processing', type: 'lead', color: '#3F51B5', emoji: '⚙️' },
        { id: 'stage_under_consultation', name: 'Under Consultation', type: 'lead', color: '#9C27B0', emoji: '📅' },
        { id: 'stage_waiting_payment', name: 'Waiting for Payment', type: 'client', color: '#FF5722', emoji: '💳' },
        { id: 'stage_documents_pending', name: 'Documents Pending', type: 'client', color: '#E91E63', emoji: '📎' },
        { id: 'stage_under_process', name: 'Under Process', type: 'client', color: '#03A9F4', emoji: '📂' },
        { id: 'stage_completed', name: 'Completed', type: 'client', color: '#4CAF50', emoji: '✅' },
        { id: 'stage_closed', name: 'Closed', type: 'client', color: '#9E9E9E', emoji: '🔒' },
        { id: 'stage_cold_lead', name: 'Cold Lead', type: 'lead', color: '#009688', emoji: '❄️' },
        { id: 'stage_lost_lead', name: 'Lost Lead', type: 'lead', color: '#F44336', emoji: '❌' },
      ];
      saveStagesMutation.mutate(DEFAULT_LEAD_STAGES);
    }
  };

  if (isCustomizationLoading || !localSettings || isStagesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const roleMenus = localSettings[currentRoleId]?.menus || [];
  const roleCards = localSettings[currentRoleId]?.cards || [];
  const roleFeatures = localSettings[currentRoleId]?.features || [];

  return (
    <Box>
      <PageHeader
        title="CRM Portal Customization Hub"
        subtitle="Manage navigation layout permissions, dashboard stats cards, and custom customer lifecycle stages."
      />

      <Box sx={{ width: '100%', mb: 3 }}>
        <Paper square sx={{ borderRadius: 3, borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={topTab}
            onChange={(e, val) => setTopTab(val)}
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ px: 3 }}
          >
            <Tab label="👤 Role Permissions" sx={{ fontWeight: 800, px: 3, py: 2 }} />
            <Tab label="⚡ Lifecycle Stages Manager" sx={{ fontWeight: 800, px: 3, py: 2 }} />
          </Tabs>
        </Paper>
      </Box>

      {/* ─── TAB 0: Role Permissions ─── */}
      {topTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleResetDefaults}
              sx={{ fontWeight: 700 }}
            >
              Reset Permissions
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ fontWeight: 700 }}
            >
              Save Layout Config
            </Button>
          </Box>

          {/* General Config Overrides Switch */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Allow Admin Managers to Custom Override Agent Permissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When enabled, users with General Admin roles can toggle and customize individual agent menus/dashboard cards directly within the Agents Directory.
              </Typography>
            </Box>
            <Switch
              color="secondary"
              checked={localSettings?.allowAdminCustomOverrides || false}
              onChange={(e) => {
                setLocalSettings({
                  ...localSettings,
                  allowAdminCustomOverrides: e.target.checked
                });
              }}
            />
          </Paper>

          <Box sx={{ width: '100%', mb: 3 }}>
            <Paper square sx={{ borderRadius: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                textColor="secondary"
                indicatorColor="secondary"
              >
                {ROLES.map((role) => (
                  <Tab key={role.id} label={role.label} sx={{ fontWeight: 700, px: 3 }} />
                ))}
              </Tabs>
            </Paper>
          </Box>

          <Box className="grid grid-cols-12 gap-2">
            {/* Menu Permissions */}
            <Box className="col-span-12 md:col-span-6">
              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Sidebar Menus Visibility
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Toggle the navigation tabs visible in the left sidebar for {ROLES[activeTab].label}.
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                <FormGroup>
                  <Box className="grid grid-cols-12 gap-1">
                    {AVAILABLE_MENUS.map((menu) => (
                      <Box className="col-span-12 sm:col-span-6" key={menu}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={roleMenus.includes(menu)}
                              onChange={() => handleToggleMenu(menu)}
                              color="secondary"
                            />
                          }
                          label={<Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{menu}</Typography>}
                        />
                      </Box>
                    ))}
                  </Box>
                </FormGroup>
              </Paper>
            </Box>

            {/* Card Permissions */}
            <Box className="col-span-12 md:col-span-6">
              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Dashboard Stats Cards Visibility
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure which summary cards are visible on the dashboard home screen for {ROLES[activeTab].label}.
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                <FormGroup>
                  <Box className="grid grid-cols-12 gap-1">
                    {AVAILABLE_CARDS.map((card) => (
                      <Box className="col-span-12 sm:col-span-6" key={card}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={roleCards.includes(card)}
                              onChange={() => handleToggleCard(card)}
                              color="primary"
                            />
                          }
                          label={<Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{card}</Typography>}
                        />
                      </Box>
                    ))}
                  </Box>
                </FormGroup>
              </Paper>
            </Box>

            {/* Feature-Level Permissions */}
            <Box className="col-span-12" sx={{ mt: 2 }}>
              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Feature-Level Security Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Grant or restrict specific actions and controls inside CRM settings and workflows for {ROLES[activeTab].label}.
                </Typography>
                <Divider sx={{ mb: 2.5 }} />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={roleFeatures.includes('canEditTranslationRates')}
                        onChange={() => handleToggleFeature('canEditTranslationRates')}
                        color="secondary"
                      />
                    }
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 700 }}>Can Edit Sworn Translation Rates</Typography>
                        <Typography variant="caption" color="text.secondary">Allows this role to manually modify the per-word rates of English, French, Arabic, Spanish sworn translations in the general settings.</Typography>
                      </Box>
                    }
                  />
                </FormGroup>
              </Paper>
            </Box>
          </Box>
        </Box>
      )}

      {/* ─── TAB 1: Lifecycle Stages Manager ─── */}
      {topTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
              Create, rename, reorder, and configure custom lead pipeline & client stages. These changes apply globally.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RestartAltIcon />}
                onClick={handleResetStages}
                sx={{ fontWeight: 700 }}
              >
                Reset to Defaults
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddStage}
                sx={{ fontWeight: 700 }}
              >
                Add Stage
              </Button>
            </Box>
          </Box>

          <Box className="grid grid-cols-12 gap-2">
            {/* Lead Categories */}
            {['lead', 'client', 'universal', 'lost'].map((category) => {
              const stagesFiltered = leadStages.filter(s => s.type === category);
              const getCategoryLabel = (cat) => {
                if (cat === 'lead') return '📋 Lead Pipeline Stages';
                if (cat === 'client') return '👥 Client Lifecycle Stages';
                if (cat === 'universal') return '🌐 Universal / Shared Stages';
                return '❄️ Canceled / Lost Stages';
              };
              
              return (
                <Box className="col-span-12 md:col-span-6" key={category}>
                  <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                      {getCategoryLabel(category)}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {stagesFiltered.length === 0 ? (
                      <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                        No stages defined for this category.
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {stagesFiltered.map((stage) => {
                          const globalIndex = leadStages.findIndex(s => s.id === stage.id);
                          return (
                            <Box
                              key={stage.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 2,
                                border: '1.5px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: stage.color || '#2196F3',
                                  boxShadow: `0 2px 8px ${stage.color || '#2196F3'}15`
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography sx={{ fontSize: '1.25rem' }}>{stage.emoji || '🆕'}</Typography>
                                <Chip
                                  label={stage.name}
                                  size="small"
                                  sx={{
                                    bgcolor: (stage.color || '#2196F3') + '15',
                                    color: stage.color || '#2196F3',
                                    fontWeight: 700,
                                    border: '1px solid',
                                    borderColor: (stage.color || '#2196F3') + '40',
                                    borderRadius: 1.5,
                                    fontSize: '0.8rem',
                                    px: 0.5
                                  }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Tooltip title="Move Up">
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={globalIndex === 0}
                                      onClick={() => handleMoveStage(globalIndex, 'up')}
                                    >
                                      <ArrowUpwardIcon sx={{ fontSize: '0.95rem' }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Move Down">
                                  <span>
                                    <IconButton
                                      size="small"
                                      disabled={globalIndex === leadStages.length - 1}
                                      onClick={() => handleMoveStage(globalIndex, 'down')}
                                    >
                                      <ArrowDownwardIcon sx={{ fontSize: '0.95rem' }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Rename / Edit">
                                  <IconButton size="small" onClick={() => handleOpenEditStage(stage)}>
                                    <EditIcon sx={{ fontSize: '0.95rem', color: 'primary.main' }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Stage">
                                  <IconButton size="small" onClick={() => handleDeleteStage(stage.id)}>
                                    <DeleteIcon sx={{ fontSize: '0.95rem', color: 'error.main' }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ─── Add / Edit Stage Dialog ─── */}
      <Dialog open={stageDialogOpen} onClose={() => setStageDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingStage ? '✏️ Edit Lifecycle Stage' : '➕ Add Custom Stage'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 3 }}>
          <TextField
            label="Stage Name"
            size="small"
            fullWidth
            value={stageForm.name}
            onChange={(e) => setStageForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. VIP Customer, Follow-up"
          />

          <Box className="grid grid-cols-12 gap-2">
            <Box className="col-span-6">
              <TextField
                label="Emoji Icon"
                size="small"
                fullWidth
                value={stageForm.emoji}
                onChange={(e) => setStageForm(prev => ({ ...prev, emoji: e.target.value }))}
                placeholder="e.g. ⭐, 🆕"
              />
            </Box>
            <Box className="col-span-6">
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={stageForm.type}
                  onChange={(e) => setStageForm(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="lead">Lead Stage</MenuItem>
                  <MenuItem value="client">Client Stage</MenuItem>
                  <MenuItem value="universal">Universal Stage</MenuItem>
                  <MenuItem value="lost">Lost Stage</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
              🎨 Select Theme Color
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESET_COLORS.map((color) => (
                <Tooltip title={color.name} key={color.value}>
                  <Box
                    onClick={() => setStageForm(prev => ({ ...prev, color: color.value }))}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: color.value,
                      cursor: 'pointer',
                      border: stageForm.color === color.value ? '2px solid #000' : '2px solid transparent',
                      transform: stageForm.color === color.value ? 'scale(1.15)' : 'none',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {stageForm.color === color.value && <CheckCircleIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setStageDialogOpen(false)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveStage} variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Save Stage
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminCustomization;

