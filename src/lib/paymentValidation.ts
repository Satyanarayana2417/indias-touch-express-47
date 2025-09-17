// UPI validation utilities

/**
 * Validate UPI ID format
 * UPI ID format: username@bank (e.g., user@paytm, 9876543210@ybl)
 */
export const validateUPIId = (upiId: string): { isValid: boolean; error?: string } => {
  if (!upiId || typeof upiId !== 'string') {
    return { isValid: false, error: 'UPI ID is required' };
  }

  // Remove extra spaces
  const cleanUpiId = upiId.trim();

  // Check basic format: should contain exactly one @
  if (!cleanUpiId.includes('@')) {
    return { isValid: false, error: 'UPI ID must contain @ symbol' };
  }

  const parts = cleanUpiId.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid UPI ID format' };
  }

  const [username, bankCode] = parts;

  // Validate username part
  if (!username || username.length < 2) {
    return { isValid: false, error: 'Username must be at least 2 characters' };
  }

  if (username.length > 256) {
    return { isValid: false, error: 'Username is too long' };
  }

  // Username can contain letters, numbers, dots, hyphens, underscores
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username contains invalid characters' };
  }

  // Validate bank code part
  if (!bankCode || bankCode.length < 2) {
    return { isValid: false, error: 'Bank code must be at least 2 characters' };
  }

  if (bankCode.length > 64) {
    return { isValid: false, error: 'Bank code is too long' };
  }

  // Bank code should only contain letters and numbers
  const bankCodeRegex = /^[a-zA-Z0-9]+$/;
  if (!bankCodeRegex.test(bankCode)) {
    return { isValid: false, error: 'Bank code contains invalid characters' };
  }

  // Check against known bank codes (optional but recommended)
  const knownBankCodes = [
    'ybl', 'okhdfcbank', 'okaxis', 'paytm', 'ibl', 'axl', 'upi',
    'okicici', 'oksbi', 'airtel', 'fbl', 'yapl', 'jupiteraxis'
  ];

  const isKnownBank = knownBankCodes.includes(bankCode.toLowerCase());
  
  return { 
    isValid: true, 
    error: isKnownBank ? undefined : 'Unknown bank code - please verify'
  };
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (amount: number | string): { isValid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Invalid amount format' };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (numAmount > 1000000) {
    return { isValid: false, error: 'Amount exceeds maximum limit (₹10,00,000)' };
  }

  // Check for too many decimal places
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Amount cannot have more than 2 decimal places' };
  }

  return { isValid: true };
};

/**
 * Validate order notes/transaction note
 */
export const validateOrderNotes = (notes: string): { isValid: boolean; error?: string } => {
  if (!notes) {
    return { isValid: true }; // Notes are optional
  }

  if (notes.length > 100) {
    return { isValid: false, error: 'Notes cannot exceed 100 characters' };
  }

  // Check for special characters that might cause issues in UPI
  const invalidChars = /[<>\"'&]/;
  if (invalidChars.test(notes)) {
    return { isValid: false, error: 'Notes contain invalid characters' };
  }

  return { isValid: true };
};

/**
 * Generate secure payment reference ID
 */
export const generatePaymentReference = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD${timestamp}${random}`.toUpperCase();
};

/**
 * Format UPI payment URL with validation
 */
export const generateUPIPaymentUrl = (params: {
  payeeAddress: string;
  payeeName: string;
  amount: number;
  currency?: string;
  transactionNote?: string;
  transactionRef?: string;
}): { url?: string; error?: string } => {
  // Validate payee UPI ID
  const upiValidation = validateUPIId(params.payeeAddress);
  if (!upiValidation.isValid) {
    return { error: `Invalid payee UPI ID: ${upiValidation.error}` };
  }

  // Validate amount
  const amountValidation = validatePaymentAmount(params.amount);
  if (!amountValidation.isValid) {
    return { error: `Invalid amount: ${amountValidation.error}` };
  }

  // Validate notes
  if (params.transactionNote) {
    const notesValidation = validateOrderNotes(params.transactionNote);
    if (!notesValidation.isValid) {
      return { error: `Invalid notes: ${notesValidation.error}` };
    }
  }

  // Build UPI URL
  const upiParams = new URLSearchParams({
    pa: params.payeeAddress,
    pn: params.payeeName,
    am: params.amount.toFixed(2),
    cu: params.currency || 'INR'
  });

  if (params.transactionNote) {
    upiParams.set('tn', params.transactionNote);
  }

  if (params.transactionRef) {
    upiParams.set('tr', params.transactionRef);
  }

  return { url: `upi://pay?${upiParams.toString()}` };
};

/**
 * Check if device supports UPI payments
 */
export const isUPISupported = (): boolean => {
  // Check if running on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // UPI is primarily supported on mobile devices
  return isMobile;
};

/**
 * Get estimated delivery time (40-50 minutes)
 */
export const getEstimatedDeliveryTime = (): { time: string; timeRange: string } => {
  const now = new Date();
  const minDelivery = new Date(now.getTime() + 40 * 60 * 1000); // 40 minutes
  const maxDelivery = new Date(now.getTime() + 50 * 60 * 1000); // 50 minutes

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return {
    time: formatTime(minDelivery),
    timeRange: `${formatTime(minDelivery)} - ${formatTime(maxDelivery)}`
  };
};