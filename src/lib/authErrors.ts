// Helper to map Firebase auth error codes to user-friendly messages
// Ref: https://firebase.google.com/docs/auth/admin/errors
export const mapAuthError = (code: string): string => {
  const normalized = code.replace('auth/', '');
  switch (normalized) {
    case 'invalid-email':
      return 'The email address is badly formatted.';
    case 'user-disabled':
      return 'This account has been disabled.';
    case 'user-not-found':
      return 'No account found with that email.';
    case 'wrong-password':
      return 'Incorrect password. Please try again.';
    case 'email-already-in-use':
      return 'An account already exists with this email.';
    case 'weak-password':
      return 'Password should be at least 6 characters.';
    case 'too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Authentication error. Please try again.';
  }
};

