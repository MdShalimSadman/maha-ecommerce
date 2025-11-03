"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

import type { FirestoreOrder } from "./index";

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
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const getStatusVariant = (status: FirestoreOrder["status"]) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Processing":
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const statusColors: Record<string, string> = {
    Pending: "#FBBF24",
    Processing: "#60A5FA",
    Shipped: "#34D399",
    Delivered: "#10B981",
    Cancelled: "#EF4444",
  };

  const getStatusColor = (status: string) => statusColors[status] ?? "#9CA3AF"; // fallback gray

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    toast.success("Order ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto text-gray-600">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#A6686A] flex items-end gap-2">
            Order Details:
            <span className="font-mono text-sm truncate">{order.id}</span>
            <button
              onClick={handleCopyOrderId}
              className="ml-2 p-1 rounded hover:bg-gray-200 cursor-pointer"
              aria-label="Copy order ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </DialogTitle>
          <DialogDescription>
            Detailed information for order placed on{" "}
            {order.orderDate.toDate().toLocaleDateString()} at{" "}
            {order.orderDate.toDate().toLocaleTimeString()}.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Status and Total */}
        <div className="flex justify-between items-center mb-4 p-3 bg-[#A6686A]/5 rounded-lg border">
          <div className="text-lg font-normal">
            Status:{" "}
            <Badge
              style={{
                backgroundColor: getStatusColor(order.status),
                color: "#fff",
              }}
              className="ml-2 px-2 py-1 text-xs rounded-full"
            >
              {order.status}
            </Badge>
          </div>
          <div className="text-xl font-semibold text-right text-[#7C4A4A]">
            Total Price: BDT {order.totalPrice.toFixed(2)}
          </div>
        </div>

        {/* Customer Info */}
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
              <TableHead className="text-center">Size</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price/Unit</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-center font-semibold">
                  {item.selectedSize ?? "N/A"}
                </TableCell>
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

export default OrderDetailDialog;
