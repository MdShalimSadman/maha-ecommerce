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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import GradientButton from "@/components/common/GradientButton";

import OrderAnalysisChart from "./OrderAnalysisChart";
import OrderDetailDialog from "./OrderDetailDialog";
import OrdersTable from "./OrdersTable";

import { toast } from "sonner";
import { Input } from "../ui/input";
import ConfirmDialog from "./ConfirmDialog";

export interface OrderItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize?: number | null;
}

export interface FirestoreOrder {
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

export default function OrdersIndex() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleViewDetails = (order: FirestoreOrder) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const chartData = useMemo(() => {
    const monthlyData = orders.reduce((acc, order) => {
      const date = order.orderDate.toDate();
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      acc[monthKey] = (acc[monthKey] || 0) + order.totalPrice;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, value]) => ({
        name: month,
        value: Math.round(value * 100) / 100,
      }));
  }, [orders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: FirestoreOrder["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrder(orderToDelete);
      toast.success("Order deleted successfully");
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setIsConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setOrderToDelete(null);
  };

  useEffect(() => {
    if (!db) {
      setError("Firebase not initialized.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);

    const ordersCollectionRef = collection(db, "orders");
    const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as FirestoreOrder)
      );
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      {/* Welcome Card */}
      <Card className="mb-8 bg-gradient-to-r from-[#7C4A4A] to-[#A6686A] text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome, Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3">
            Welcome to admin dashboard. Easily view your orders. For managing
            products, click on the &apos;Manage product&apos; button and login
            with your email in sanity. You need to click on the &apos;publish
            product&apos; button after adding or editing any product.
          </p>
          <Link
            href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GradientButton className="bg-white text-[#A6686A] cursor-pointer">
              Manage Products
            </GradientButton>
          </Link>
        </CardContent>
      </Card>

      {/* Order Analysis Chart */}
      <div className="mb-8">
        <OrderAnalysisChart data={chartData} />
      </div>

      {/* Orders Table Card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle>Order List ({orders.length})</CardTitle>
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-0 md:w-50 bg-transparent border-0 border-b border-[#A6686A] focus:border-[#7C4A4A] focus:!ring-0 transition-colors duration-200 !rounded-none"
          />
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteClick} // Use the new handler
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Order?"
        description={`Are you sure you want to delete order ${orderToDelete}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
