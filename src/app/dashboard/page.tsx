"use client";

import { useState, useEffect, useMemo } from "react";
import { db, updateOrderStatus, deleteOrder } from "@/lib/firebaseClient";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Import Dialog components for the "Credenza" functionality
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// --- Interface Definitions ---

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
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  orderDate: Timestamp;
}

// --- Component 1: OrderAnalysisChart (Unchanged) ---

const OrderAnalysisChart = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const chartConfig = {
    value: {
      label: "Order Amount",
      color: "#A6686A",
    },
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Sales Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="value"
                fill="#A6686A"
                name="Total Order Amount ($)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

// --- Component 2: OrderDetailDialog (New) ---

interface OrderDetailDialogProps {
  order: FirestoreOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog = ({
  order,
  isOpen,
  onClose,
}: OrderDetailDialogProps) => {
  if (!order) return null;

  // Helper to determine badge variant based on status
  const getStatusVariant = (status: FirestoreOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Processing":
        return "outline";
      case "Pending":
        return "destructive";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#A6686A]">
            Order Details: <span className="font-mono text-sm">{order.id}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information for order placed on{" "}
            {order.orderDate.toDate().toLocaleDateString()} at{" "}
            {order.orderDate.toDate().toLocaleTimeString()}.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Status and Total */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-lg font-semibold">
            Status:{" "}
            <Badge
              variant={getStatusVariant(order.status)}
              className="ml-2 px-3 py-1 text-base"
            >
              {order.status}
            </Badge>
          </div>
          <div className="text-xl font-bold text-right text-green-700">
            Total Price: ${order.totalPrice.toFixed(2)}
          </div>
        </div>

        {/* Customer Information */}
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium">Full Name:</span> {order.fullName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {order.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {order.phone}
          </div>
          <div>
            <span className="font-medium">Payment Method:</span>{" "}
            {order.paymentMethod}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Address:</span> {order.address}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items */}
        <h3 className="text-lg font-semibold mb-2">Order Items</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price/Unit</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ${item.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

// --- Component 3: OrdersPage (Main Component) ---

export default function OrdersPage() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the Order Detail Dialog/Credenza
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to open the dialog and set the selected order
  const handleViewDetails = (order: FirestoreOrder) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!db) {
      setError(
        "Firebase not initialized. Check the @/lib/firebaseClient file."
      );
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    const ordersCollectionRef = collection(db, "orders");
    const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const fetchedOrders = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as FirestoreOrder)
        );

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          "Failed to listen to orders. Check security rules or network."
        );
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const chartData = useMemo(() => {
    const monthlyData = orders.reduce((acc, order) => {
      const date = order.orderDate.toDate();
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += order.totalPrice;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, amount]) => ({
        name: month,
        value: Math.round(amount * 100) / 100,
      }));
  }, [orders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: FirestoreOrder["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      console.log(`Status updated for order ${orderId} to ${newStatus}`);
    } catch (e) {
      console.error("Error updating status:", e);
      alert("Failed to update status. Check permissions.");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (
      !confirm(
        `Are you sure you want to delete order ${orderId}? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await deleteOrder(orderId);
      console.log(`Order ${orderId} deleted successfully.`);
    } catch (e) {
      console.error("Error deleting order:", e);
      alert("Failed to delete order. Check permissions.");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#A6686A]">
            Welcome, Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3">
            {" "}
            Welcome to admin dashboard. Easily add, delete, edit your products and orders. click on the &apos;Manage
            product&apos; button to manage the products and login with your email in sanity. you need
            to click on the &apos;publish product&apos; button after adding or
            editing any product.
          </p>
          <Link
            href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#C08387] hover:bg-[#A6686A] cursor-pointer">
              Manage Products
            </Button>
          </Link>
        </CardContent>
      </Card>

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
                  <TableRow
                    key={order.id}
                    className={
                      order.status === "Delivered" ? "bg-green-50/50" : ""
                    }
                  >
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
                      <Select
                        value={order.status}
                        onValueChange={(value: FirestoreOrder["status"]) =>
                          handleStatusChange(order.id, value)
                        }
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
                        onClick={() => handleViewDetails(order)} // <-- UPDATED
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

      {/* The Order Detail Dialog/Credenza */}
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
