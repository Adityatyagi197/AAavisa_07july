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
    isViewOnlyMenu: (customizationSettings, menuName) => {
      if (!customizationSettings || !currentUser) return false;
      const roleConfig = customizationSettings[currentUser.id] || customizationSettings[currentUser.role];
      return roleConfig?.viewOnlyMenus?.includes(menuName) || false;
    },
    hasFeature: (customizationSettings, featureName) => {
      if (!currentUser) return false;
      if (currentUser.role === 'super_admin') return true;
      if (!customizationSettings) return false;
      const roleConfig = customizationSettings[currentUser.role];
      return roleConfig?.features?.includes(featureName) || false;
    }
  };
};

export default useAuth;
