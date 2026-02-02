/**
 * Authentication Helper Utilities
 * 
 * Use this to reset admin credentials if login fails
 */

const USERS_KEY = 'csg_users';

/**
 * Reset Admin user credentials to default
 * Call this from browser console if login fails:
 * 
 * import { resetAdminUser } from '@/utils/authHelper.js';
 * resetAdminUser();
 */
export function resetAdminUser() {
  const defaultAdmin = {
    id: '1',
    username: 'Admin',
    password: 'Admin@1881!',
    email: 'admin@csg-logistics.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  };

  const storedUsers = localStorage.getItem(USERS_KEY);
  let users = storedUsers ? JSON.parse(storedUsers) : [];
  
  // Remove old Admin user
  users = users.filter((u) => u.username.toLowerCase() !== 'admin');
  
  // Add default Admin user
  users.push(defaultAdmin);
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  console.log('✅ Admin user reset successfully!');
  console.log('Username: Admin');
  console.log('Password: Admin@1881!');
  console.log('Status: active');
  
  return defaultAdmin;
}

/**
 * Check current admin user status
 */
export function checkAdminUser() {
  const storedUsers = localStorage.getItem(USERS_KEY);
  const users = storedUsers ? JSON.parse(storedUsers) : [];
  const admin = users.find((u) => u.username.toLowerCase() === 'admin');
  
  if (admin) {
    console.log('Admin user found:', {
      username: admin.username,
      status: admin.status,
      passwordLength: admin.password?.length,
      passwordPreview: admin.password ? admin.password.substring(0, 5) + '...' : 'missing',
    });
    return admin;
  } else {
    console.warn('⚠️ Admin user not found!');
    return null;
  }
}

/**
 * Clear all auth data (for testing)
 */
export function clearAuthData() {
  localStorage.removeItem('csg_admin_session');
  localStorage.removeItem(USERS_KEY);
  console.log('✅ Auth data cleared');
}
