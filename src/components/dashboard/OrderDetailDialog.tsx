"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import type { FirestoreOrder } from "./index"; // shared interface

interface OrderDetailDialogProps {
  order: FirestoreOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog = ({ order, isOpen, onClose }: OrderDetailDialogProps) => {
  if (!order) return null;

  const getStatusVariant = (status: FirestoreOrder["status"]) => {
    switch (status) {
      case "Delivered": return "default";
      case "Shipped": return "secondary";
      case "Processing":
      case "Pending": return "outline";
      case "Cancelled": return "destructive";
      default: return "outline";
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
            Detailed information for order placed on {order.orderDate.toDate().toLocaleDateString()} at {order.orderDate.toDate().toLocaleTimeString()}.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Status and Total */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-lg font-semibold">
            Status: <Badge variant={getStatusVariant(order.status)} className="ml-2 px-3 py-1 text-base">{order.status}</Badge>
          </div>
          <div className="text-xl font-bold text-right text-green-700">
            Total Price: ${order.totalPrice.toFixed(2)}
          </div>
        </div>

        {/* Customer Info */}
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div><span className="font-medium">Full Name:</span> {order.fullName}</div>
          <div><span className="font-medium">Email:</span> {order.email}</div>
          <div><span className="font-medium">Phone:</span> {order.phone}</div>
          <div><span className="font-medium">Payment Method:</span> {order.paymentMethod}</div>
          <div className="col-span-2"><span className="font-medium">Address:</span> {order.address}</div>
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
                <TableCell className="text-center font-semibold">{item.selectedSize ?? "N/A"}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
