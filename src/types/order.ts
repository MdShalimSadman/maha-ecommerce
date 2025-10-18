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
}
