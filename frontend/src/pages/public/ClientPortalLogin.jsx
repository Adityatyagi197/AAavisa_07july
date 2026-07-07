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
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAlert } from '../../contexts/AlertContext';
import { dbService } from '../../services/dbService';

const LOGIN_TRANSLATIONS = {
  English: {
    title: "Client Portal",
    subtitle: "Sign in to upload and manage your documents.",
    username_label: "Username (Client ID)",
    password_label: "Password",
    login_btn: "Log In",
    quick_login: "DEMO QUICK LOGIN",
    support_text: "If you have issues logging in, please contact your Case Manager.",
    elena_btn: "Client: Elena (Golden Visa)",
    chloe_btn: "Client: Chloe (Study Visa)"
  },
  Arabic: {
    title: "بوابة العميل",
    subtitle: "سجل الدخول لتحميل وإدارة مستنداتك.",
    username_label: "اسم المستخدم (معرف العميل)",
    password_label: "كلمة المرور",
    login_btn: "تسجيل الدخول",
    quick_login: "تسجيل دخول سريع تجريبي",
    support_text: "إذا واجهت مشاكل في تسجيل الدخول، يرجى الاتصال بمدير الحالة الخاص بك.",
    elena_btn: "العميل: إلينا (الفيزا الذهبية)",
    chloe_btn: "العميل: كلوي (فيزا الدراسة)"
  },
  Spanish: {
    title: "Portal del Cliente",
    subtitle: "Inicie sesión para cargar y administrar sus documentos.",
    username_label: "Nombre de usuario (ID de cliente)",
    password_label: "Contraseña",
    login_btn: "Iniciar Sesión",
    quick_login: "INICIO DE SESIÓN RÁPIDO DE DEMO",
    support_text: "Si tiene problemas para iniciar sesión, comuníquese con su administrador de casos.",
    elena_btn: "Cliente: Elena (Visa Dorada)",
    chloe_btn: "Cliente: Chloe (Visa de Estudios)"
  },
  French: {
    title: "Portail Client",
    subtitle: "Connectez-vous pour télécharger et gérer vos documents.",
    username_label: "Nom d'utilisateur (Identifiant client)",
    password_label: "Mot de passe",
    login_btn: "Se Connecter",
    quick_login: "CONNEXION RAPIDE DEMO",
    support_text: "Si vous rencontrez des problèmes de connexion, veuillez contacter votre gestionnaire de dossier.",
    elena_btn: "Client: Elena (Visa Doré)",
    chloe_btn: "Client: Chloe (Visa d'Études)"
  },
  German: {
    title: "Kundenportal",
    subtitle: "Melden Sie sich an, um Ihre Dokumente hochzuladen und zu verwalten.",
    username_label: "Benutzername (Kunden-ID)",
    password_label: "Passwort",
    login_btn: "Einloggen",
    quick_login: "DEMO SCHNELLLOGIN",
    support_text: "Wenn Sie Probleme beim Einloggen haben, wenden Sie sich bitte an Ihren Fallmanager.",
    elena_btn: "Kunde: Elena (Golden Visa)",
    chloe_btn: "Kunde: Chloe (Visum für Studium)"
  },
  Urdu: {
    title: "کلائنٹ پورٹل",
    subtitle: "اپنی دستاویزات اپ لوڈ اور ان کا انتظام کرنے کے لیے سائن ان کریں۔",
    username_label: "صارف نام (کلائنٹ ID)",
    password_label: "پاس ورڈ",
    login_btn: "لاگ ان کریں",
    quick_login: "ڈیمو فوری لاگ ان",
    support_text: "اگر آپ کو لاگ ان کرنے میں کوئی مسئلہ درپیش ہے تو براہ کرم اپنے کیس مینیجر سے رابطہ کریں۔",
    elena_btn: "کلائنٹ: ایلینا (گولڈن ویزا)",
    chloe_btn: "کلائنٹ: کلوئی (اسٹڈی ویزا)"
  }
};

export const ClientPortalLogin = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize lang from localStorage if set, default to English
  const [loginLang, setLoginLang] = useState(() => {
    return localStorage.getItem('client-portal-lang') || 'English';
  });

  const changeLanguage = (newLang) => {
    setLoginLang(newLang);
    localStorage.setItem('client-portal-lang', newLang);
  };

  const t = (key) => {
    if (LOGIN_TRANSLATIONS[loginLang] && LOGIN_TRANSLATIONS[loginLang][key]) {
      return LOGIN_TRANSLATIONS[loginLang][key];
    }
    return LOGIN_TRANSLATIONS['English'][key] || key;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showAlert('Please enter both username and password.', 'error');
      return;
    }
    const clientId = username.trim();
    try {
      const res = await dbService.clientLogin(clientId, password);
      localStorage.setItem('clientToken', res.token);
      localStorage.setItem('clientData', JSON.stringify(res.client));
      showAlert('Login successful! Welcome to the Client Portal.', 'success');
      
      if (res.client.isTemporaryPassword) {
        navigate('/portal/change-password');
      } else {
        navigate(`/portal/documents/${clientId}`);
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Login failed. Invalid credentials.', 'error');
    }
  };

  const handleQuickLogin = async (clientId) => {
    setUsername(clientId);
    setPassword('password123');
    try {
      const res = await dbService.clientLogin(clientId, 'password123');
      localStorage.setItem('clientToken', res.token);
      localStorage.setItem('clientData', JSON.stringify(res.client));
      showAlert('Login successful! Welcome to the Client Portal.', 'success');
      
      if (res.client.isTemporaryPassword) {
        navigate('/portal/change-password');
      } else {
        navigate(`/portal/documents/${clientId}`);
      }
    } catch (err) {
      showAlert(err.response?.data?.message || 'Quick login failed.', 'error');
    }
  };

  const isRTL = loginLang === 'Arabic' || loginLang === 'Urdu';

  return (
    <Box 
      dir={isRTL ? 'rtl' : 'ltr'}
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        p: 3, 
        flexDirection: 'column', 
        gap: 2,
        position: 'relative'
      }}
    >
      {/* Top right language switcher on login page */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={loginLang}
            onChange={(e) => changeLanguage(e.target.value)}
            sx={{ borderRadius: 2, height: 36, bgcolor: 'background.paper', fontSize: '0.85rem', fontWeight: 600 }}
          >
            <MenuItem value="English">English 🇺🇸</MenuItem>
            <MenuItem value="Arabic">العربية 🇦ئه</MenuItem>
            <MenuItem value="Spanish">Español 🇪🇸</MenuItem>
            <MenuItem value="French">Français 🇫🇷</MenuItem>
            <MenuItem value="German">Deutsch 🇩🇪</MenuItem>
            <MenuItem value="Urdu">Urdu 🇵🇰</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ p: 5, borderRadius: 3, maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: isRTL ? 'right' : 'left' }}>
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
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{t('title')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('subtitle')}</Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t('username_label')}
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. client_123"
              inputProps={{ dir: 'ltr', style: { textAlign: isRTL ? 'right' : 'left' } }}
            />
            <TextField
              label={t('password_label')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ dir: 'ltr', style: { textAlign: isRTL ? 'right' : 'left' } }}
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
            <Button type="submit" variant="contained" color="secondary" size="large" fullWidth sx={{ textTransform: 'none', fontWeight: 700 }}>
              {t('login_btn')}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Chip label={t('quick_login')} size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
        </Divider>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2001')} sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
            {t('elena_btn')}
          </Button>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2002')} sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}>
            {t('chloe_btn')}
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('support_text')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientPortalLogin;
