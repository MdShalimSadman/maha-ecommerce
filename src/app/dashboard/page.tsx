"use client";

import { useState, useEffect, useMemo } from "react";
// Assuming you have separate update/delete functions in a service file for better structure
import { db, updateOrderStatus, deleteOrder } from "@/lib/firebaseClient"; 
import {
  collection,
  query,
  orderBy,
  onSnapshot, // Import for real-time updates!
  Timestamp
} from "firebase/firestore";

// --- Shadcn Imports (Assumed) ---
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card" // For charts/analysis


// --- Type Definitions (Unchanged) ---
interface OrderItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

interface FirestoreOrder {
  id: string; 
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; // Define possible statuses
  items: OrderItem[];
  orderDate: Timestamp; 
}
// ------------------------------------------

// Placeholder Chart Component (You need to implement this using a library like Recharts/Visx)
const OrderAnalysisChart = ({ data }: { data: { name: string; value: number }[] }) => {
    // This is where your chart logic would go. For simplicity, we just show a message.
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Sales Analysis by Status</CardTitle>
            </CardHeader>
            <CardContent>
                {/*  */}
                <p className="text-sm text-gray-500">
                    A bar chart showing orders by status (Pending, Delivered, etc.) would go here, built with a charting library.
                </p>
                <ul className="mt-2 text-sm">
                    {data.map(d => (
                        <li key={d.name}>{d.name}: {d.value} orders</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};


export default function OrdersPage() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. REAL-TIME DATA FETCHING (onSnapshot) ---
  useEffect(() => {
    // 🚨 Check for db instance immediately
    if (!db) {
        setError("Firebase not initialized. Check the @/lib/firebaseClient file.");
        setLoading(false);
        return;
    }
    
    setError(null);
    setLoading(true);

    const ordersCollectionRef = collection(db, "orders");
    const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreOrder));
        
        setOrders(fetchedOrders);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to listen to orders. Check security rules or network.");
        setLoading(false);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); 
  
  // --- 2. DATA ANALYSIS FOR CHART ---
  const chartData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
    }));
  }, [orders]);


  // --- 3. MUTATION HANDLERS (Update/Delete) ---

  const handleStatusChange = async (orderId: string, newStatus: FirestoreOrder['status']) => {
    try {
        // You MUST implement this function in your firebase client file:
        // await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        await updateOrderStatus(orderId, newStatus); 
        console.log(`Status updated for order ${orderId} to ${newStatus}`);
    } catch (e) {
        console.error("Error updating status:", e);
        alert("Failed to update status. Check permissions.");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}? This cannot be undone.`)) {
        return;
    }
    try {
        // You MUST implement this function in your firebase client file:
        // await deleteDoc(doc(db, "orders", orderId));
        await deleteOrder(orderId);
        console.log(`Order ${orderId} deleted successfully.`);
    } catch (e) {
        console.error("Error deleting order:", e);
        alert("Failed to delete order. Check permissions.");
    }
  };


  // --- Loading and Error States ---
  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  // --- Render Dashboard ---
  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-[#A6686A] mb-8 text-center">
        Orders Dashboard 📈
      </h1>
      
      {/* Chart/Analysis Section */}
      <div className="mb-8">
        <OrderAnalysisChart data={chartData} />
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
            <CardTitle>Order List ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <Table>
                    <TableCaption>A list of all customer orders.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="w-[200px]">Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className={order.status === 'Delivered' ? 'bg-green-50/50' : ''}>
                                <TableCell className="font-medium text-sm text-[#A6686A]">
                                    {order.id.substring(0, 8)}...
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold">{order.fullName}</div>
                                    <div className="text-xs text-gray-500">{order.email}</div>
                                </TableCell>
                                <TableCell>
                                    {order.orderDate.toDate().toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right font-bold text-lg">
                                    ${order.totalPrice.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {/* Status Update Dropdown */}
                                    <Select 
                                        value={order.status} 
                                        onValueChange={(value: FirestoreOrder['status']) => handleStatusChange(order.id, value)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Update Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Shipped">Shipped</SelectItem>
                                            <SelectItem value="Delivered">Delivered</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => console.log('View/Edit details for:', order.id)}
                                        className="text-[#A6686A]"
                                    >
                                        View
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDelete(order.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}