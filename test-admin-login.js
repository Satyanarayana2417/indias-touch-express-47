// Test script to check admin login functionality
console.log('Testing admin login functionality...');

// Simulate admin login in development mode
const testAdminLogin = () => {
  const adminEmails = [
    'admin@venkatexpress.com',
    'satyanarayana2417@gmail.com',
    'venkatexpress@gmail.com',
    'neha@gmail.com'
  ];

  console.log('Authorized admin emails:', adminEmails);
  
  // Check if we're in development mode
  const isDevMode = true; // Since we're using demo Firebase config
  console.log('Development mode:', isDevMode);
  
  // Simulate localStorage check
  const mockAdminUser = localStorage.getItem('mockAdminUser');
  console.log('Current mock admin user:', mockAdminUser);
  
  if (!mockAdminUser) {
    console.log('No admin user found in localStorage. You need to login first.');
    console.log('Go to http://localhost:8081/admin/login and use:');
    console.log('Email: admin@venkatexpress.com');
    console.log('Password: any password');
  } else {
    console.log('Admin user found:', JSON.parse(mockAdminUser));
  }
};

// Function to simulate admin login
const simulateAdminLogin = () => {
  const mockAdmin = {
    uid: 'admin-' + Date.now(),
    email: 'admin@venkatexpress.com',
    displayName: 'Admin User'
  };
  
  localStorage.setItem('mockAdminUser', JSON.stringify(mockAdmin));
  console.log('Mock admin user created:', mockAdmin);
  console.log('You should now be able to access admin features');
};

// Run tests
testAdminLogin();

// Expose functions to global scope for manual testing
window.testAdminLogin = testAdminLogin;
window.simulateAdminLogin = simulateAdminLogin;
window.clearAdminLogin = () => {
  localStorage.removeItem('mockAdminUser');
  console.log('Admin login cleared');
};

console.log('Test functions available:');
console.log('- testAdminLogin() - Check current admin status');
console.log('- simulateAdminLogin() - Create mock admin user');
console.log('- clearAdminLogin() - Clear admin session');