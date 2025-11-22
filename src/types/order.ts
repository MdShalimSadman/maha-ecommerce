type OrderItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  paymentMethod: string; 
  items: OrderItem[];
  subtotal: number;
  shipping?: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  userId?: string | null;          
  createdAt: string;    
  paymentStatus:string;            
}

export interface OrderDetails {
    email: string;
    fullName: string;
    totalPrice: number; // Assuming amount is a number
    address: string;
    phone: string;
    paymentMethod: string;
}