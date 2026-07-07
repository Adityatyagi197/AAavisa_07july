import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const { currentUser, isAuthenticated, login, logout, changeRole, refreshUser } = useAuthContext();

  const hasRole = (allowedRoles) => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isConsultant = currentUser?.role === 'consultant';
  const isFinance = currentUser?.role === 'finance';
  const isOperations = currentUser?.role === 'operations';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isMarketing = currentUser?.role === 'marketing';

  return {
    currentUser,
    isAuthenticated,
    hasRole,
    changeRole,
    logout,
    login,
    refreshUser,
    isAdmin,
    isConsultant,
    isFinance,
    isOperations,
    isSuperAdmin,
    isMarketing,
  };
};

export default useAuth;
