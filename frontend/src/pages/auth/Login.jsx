import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CampaignIcon from '@mui/icons-material/Campaign';

const schema = yup.object().shape({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required') });

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '' } });

  const onSubmit = async (data) => {
    try {
      const res = await dbService.authLogin(data.email.toLowerCase().trim(), data.password);
      login(res.user, res.token);
      showAlert(`Logged in successfully as ${res.user.role}`, 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      showAlert(error.response?.data?.message || 'Invalid login credentials. Please check email/password.', 'error');
    }
  };

  const handleQuickLogin = (role) => {
    let mockUser = {
      id: 'admin-1',
      name: 'General Manager',
      email: 'manager@aaabusinessconsultancy.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' };

    if (role === 'consultant') {
      mockUser = {
        id: 'c1',
        name: 'Sofia Rodriguez',
        email: 'sofia.r@aaabusinessconsultancy.com',
        role: 'consultant',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' };
    } else if (role === 'finance') {
      mockUser = {
        id: 'finance-staff',
        name: 'Elena Finance',
        email: 'finance@aaabusinessconsultancy.com',
        role: 'finance',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' };
    } else if (role === 'operations') {
      mockUser = {
        id: 'operations-staff',
        name: 'Carlos Ops',
        email: 'ops@aaabusinessconsultancy.com',
        role: 'operations',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' };
    } else if (role === 'super_admin') {
      mockUser = {
        id: 'super-admin',
        name: 'Wael Madi (CEO)',
        email: 'wael.m@aaabusinessconsultancy.com',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' };
    } else if (role === 'marketing') {
      mockUser = {
        id: 'marketing-staff',
        name: 'Marketing Manager',
        email: 'marketing@aaabusinessconsultancy.com',
        role: 'marketing',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150' };
    }

    login(mockUser);
    showAlert(`Logged in as Demo ${role.toUpperCase()}`, 'success');
    navigate('/dashboard');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access the CRM portal.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            {...register('email')}
            label="Email Address"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 3 }}>
        <Chip label="DEMO QUICK LOGIN" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
      </Divider>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<AdminPanelSettingsIcon />} fullWidth onClick={() => handleQuickLogin('super_admin')}>
          Super Admin
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<SupervisorAccountIcon />} fullWidth onClick={() => handleQuickLogin('admin')}>
          Admin
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<SupportAgentIcon />} fullWidth onClick={() => handleQuickLogin('consultant')}>
          Agent
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<AccountBalanceWalletIcon />} fullWidth onClick={() => handleQuickLogin('finance')}>
          Finance
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<SettingsSuggestIcon />} fullWidth onClick={() => handleQuickLogin('operations')}>
          Operations
        </Button>
        <Button variant="outlined" size="small" sx={{ py: 0.5, fontSize: '0.7rem' }} startIcon={<CampaignIcon />} fullWidth onClick={() => handleQuickLogin('marketing')}>
          Marketing
        </Button>
      </Box>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Are you a client looking for your portal?
        </Typography>
        <Button 
          component={RouterLink} 
          to="/portal/login" 
          variant="text" 
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Go to Client Portal Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
