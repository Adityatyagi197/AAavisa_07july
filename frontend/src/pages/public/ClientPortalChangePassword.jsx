import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAlert } from '../../contexts/AlertContext';
import { dbService } from '../../services/dbService';

export const ClientPortalChangePassword = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const clientData = JSON.parse(localStorage.getItem('clientData'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showAlert('Please enter both fields.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Passwords do not match.', 'error');
      return;
    }
    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return;
    }

    try {
      if (!clientData || !clientData.id) {
        throw new Error('No client session found. Please log in again.');
      }
      await dbService.changeClientPassword(clientData.id, password);
      showAlert('Password updated successfully!', 'success');
      
      // Update local storage to reflect the change
      const updatedClientData = { ...clientData, isTemporaryPassword: false };
      localStorage.setItem('clientData', JSON.stringify(updatedClientData));

      // Redirect to dashboard
      navigate(`/portal/documents/${clientData.id}`);
    } catch (err) {
      showAlert(err.response?.data?.message || err.message || 'Failed to update password.', 'error');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        p: 3, 
        flexDirection: 'column', 
        gap: 2
      }}
    >
      <Paper sx={{ p: 5, borderRadius: 3, maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              mx: 'auto',
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.5rem',
              mb: 2
            }}
          >
            A³
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Change Password</Typography>
          <Typography variant="body2" color="text.secondary">
            For your security, please update your temporary password to continue.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="secondary" size="large" fullWidth sx={{ textTransform: 'none', fontWeight: 700 }}>
              Update Password
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ClientPortalChangePassword;
