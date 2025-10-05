// Mock orders library without Firebase
import { clearCartAfterCheckout } from './cart';

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  variant?: string;
  productId: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  trackingNumber?: string;
  courierService?: string;
  estimatedDelivery?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock orders data
const mockOrders: Order[] = [];

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VE${timestamp}${random}`;
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  console.log('Mock: Creating order');
  const orderId = 'order-' + Date.now();
  const order: Order = {
    ...orderData,
    id: orderId,
    orderNumber: generateOrderNumber(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockOrders.push(order);
  
  // Store in localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear the user's cart after successful order creation
  try {
    await clearCartAfterCheckout(orderId);
    console.log('Cart cleared after order creation');
  } catch (error) {
    console.error('Error clearing cart after order creation:', error);
    // Don't fail the order creation if cart clearing fails
  }
  
  return orderId;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  console.log('Mock: Getting order:', orderId);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.find((order: Order) => order.id === orderId) || null;
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  console.log('Mock: Getting order by number:', orderNumber);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.find((order: Order) => order.orderNumber === orderNumber) || null;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  console.log('Mock: Getting user orders:', userId);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.filter((order: Order) => order.userId === userId);
};

export const getAllOrders = async (): Promise<Order[]> => {
  console.log('Mock: Getting all orders');
  return JSON.parse(localStorage.getItem('orders') || '[]');
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<void> => {
  console.log('Mock: Updating order status:', orderId, status, trackingNumber);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    if (trackingNumber) {
      orders[orderIndex].trackingNumber = trackingNumber;
    }
    orders[orderIndex].updatedAt = new Date();
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']): Promise<void> => {
  console.log('Mock: Updating payment status:', orderId, paymentStatus);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].paymentStatus = paymentStatus;
    orders[orderIndex].updatedAt = new Date();
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

export const addTrackingInfo = async (orderId: string, trackingNumber: string, courierService: string): Promise<void> => {
  console.log('Mock: Adding tracking info:', orderId, trackingNumber);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].trackingNumber = trackingNumber;
    orders[orderIndex].courierService = courierService;
    orders[orderIndex].updatedAt = new Date();
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

export const getRecentOrders = async (limitCount = 10): Promise<Order[]> => {
  console.log('Mock: Getting recent orders');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.slice(-limitCount).reverse();
};

export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  console.log('Mock: Getting orders by status:', status);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  return orders.filter((order: Order) => order.status === status);
};

export const getOrderStats = async () => {
  console.log('Mock: Getting order stats');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  return {
    total: orders.length,
    pending: orders.filter((o: Order) => o.status === 'pending').length,
    processing: orders.filter((o: Order) => o.status === 'processing').length,
    shipped: orders.filter((o: Order) => o.status === 'shipped').length,
    delivered: orders.filter((o: Order) => o.status === 'delivered').length,
    cancelled: orders.filter((o: Order) => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum: number, order: Order) => 
      order.paymentStatus === 'paid' ? sum + order.total : sum, 0
    )
  };
};

export const updateOrderNotes = async (orderId: string, notes: string): Promise<void> => {
  console.log('Mock: Updating order notes:', orderId, notes);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].notes = notes;
    orders[orderIndex].updatedAt = new Date();
    localStorage.setItem('orders', JSON.stringify(orders));
  }
};

export const searchOrders = async (searchTerm: string): Promise<Order[]> => {
  console.log('Mock: Searching orders:', searchTerm);
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const term = searchTerm.toLowerCase();
  
  return orders.filter((order: Order) => 
    order.orderNumber.toLowerCase().includes(term) ||
    order.userEmail.toLowerCase().includes(term) ||
    order.shippingAddress.fullName.toLowerCase().includes(term)
  );
};

