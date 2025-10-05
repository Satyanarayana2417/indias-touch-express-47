// Mock product requests library without Firebase

export interface ProductRequest {
  id?: string;
  productName: string;
  description: string;
  category: string;
  estimatedPrice?: string; // original user estimated price
  userEmail: string;
  userName?: string;
  // Extended statuses to match component usage & validation schema
  status: 'pending' | 'quote_sent' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string; // internal progress / public notes
  adminNotes?: string; // admin only notes
  quotedPrice?: number; // price quoted by admin
  estimatedDelivery?: string; // human readable date string
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock product requests data
const mockProductRequests: ProductRequest[] = [];

export const submitProductRequest = async (requestData: Omit<ProductRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  console.log('Mock: Submitting product request:', requestData.productName);
  
  const requestId = 'request-' + Date.now();
  const request: ProductRequest = {
    ...requestData,
    id: requestId,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Store in localStorage
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  requests.push(request);
  localStorage.setItem('productRequests', JSON.stringify(requests));
  
  return requestId;
};

export const getAllProductRequests = async (): Promise<ProductRequest[]> => {
  console.log('Mock: Getting all product requests');
  return JSON.parse(localStorage.getItem('productRequests') || '[]');
};

export const getProductRequestById = async (requestId: string): Promise<ProductRequest | null> => {
  console.log('Mock: Getting product request by ID:', requestId);
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  return requests.find((request: ProductRequest) => request.id === requestId) || null;
};

export const getUserProductRequests = async (userEmail: string): Promise<ProductRequest[]> => {
  console.log('Mock: Getting user product requests:', userEmail);
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  return requests.filter((request: ProductRequest) => request.userEmail === userEmail);
};

// Extended to accept optional notes, quotedPrice & estimatedDelivery
export const updateProductRequestStatus = async (
  requestId: string,
  status: ProductRequest['status'],
  notes?: string,
  quotedPrice?: number,
  estimatedDelivery?: string
): Promise<void> => {
  console.log('Mock: Updating product request status:', requestId, status, { notes, quotedPrice, estimatedDelivery });

  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  const requestIndex = requests.findIndex((request: ProductRequest) => request.id === requestId);

  if (requestIndex !== -1) {
    const target = requests[requestIndex];
    target.status = status;
    if (notes) target.notes = notes;
    if (typeof quotedPrice === 'number') target.quotedPrice = quotedPrice;
    if (estimatedDelivery) target.estimatedDelivery = estimatedDelivery;
    target.updatedAt = new Date();
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }
};

export const updateProductRequestPriority = async (requestId: string, priority: ProductRequest['priority']): Promise<void> => {
  console.log('Mock: Updating product request priority:', requestId, priority);
  
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  const requestIndex = requests.findIndex((request: ProductRequest) => request.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].priority = priority;
    requests[requestIndex].updatedAt = new Date();
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }
};

export const deleteProductRequest = async (requestId: string): Promise<void> => {
  console.log('Mock: Deleting product request:', requestId);
  
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  const filteredRequests = requests.filter((request: ProductRequest) => request.id !== requestId);
  localStorage.setItem('productRequests', JSON.stringify(filteredRequests));
};

export const getProductRequestsByStatus = async (status: ProductRequest['status']): Promise<ProductRequest[]> => {
  console.log('Mock: Getting product requests by status:', status);
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  return requests.filter((request: ProductRequest) => request.status === status);
};

export const getProductRequestsByCategory = async (category: string): Promise<ProductRequest[]> => {
  console.log('Mock: Getting product requests by category:', category);
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  return requests.filter((request: ProductRequest) => request.category === category);
};

export const searchProductRequests = async (searchTerm: string): Promise<ProductRequest[]> => {
  console.log('Mock: Searching product requests:', searchTerm);
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  const term = searchTerm.toLowerCase();
  
  return requests.filter((request: ProductRequest) => 
    request.productName.toLowerCase().includes(term) ||
    request.description.toLowerCase().includes(term) ||
    request.category.toLowerCase().includes(term) ||
    request.userEmail.toLowerCase().includes(term)
  );
};

export const updateProductRequestNotes = async (requestId: string, notes: string): Promise<void> => {
  console.log('Mock: Updating product request notes:', requestId, notes);
  
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  const requestIndex = requests.findIndex((request: ProductRequest) => request.id === requestId);
  
  if (requestIndex !== -1) {
    requests[requestIndex].notes = notes;
    requests[requestIndex].updatedAt = new Date();
    localStorage.setItem('productRequests', JSON.stringify(requests));
  }
};

export const getProductRequestStats = async () => {
  console.log('Mock: Getting product request stats');
  const requests = JSON.parse(localStorage.getItem('productRequests') || '[]');
  
  return {
    total: requests.length,
    pending: requests.filter((r: ProductRequest) => r.status === 'pending').length,
    quoteSent: requests.filter((r: ProductRequest) => r.status === 'quote_sent').length,
    approved: requests.filter((r: ProductRequest) => r.status === 'approved').length,
    rejected: requests.filter((r: ProductRequest) => r.status === 'rejected').length,
    completed: requests.filter((r: ProductRequest) => r.status === 'completed').length,
    highPriority: requests.filter((r: ProductRequest) => r.priority === 'high').length,
    mediumPriority: requests.filter((r: ProductRequest) => r.priority === 'medium').length,
    lowPriority: requests.filter((r: ProductRequest) => r.priority === 'low').length
  };
};

