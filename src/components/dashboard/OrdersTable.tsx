"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrdersTableRow from "./OrdersTableRow";
import type { FirestoreOrder } from "./index";

interface OrdersTableProps {
  orders: FirestoreOrder[];
  onViewDetails: (order: FirestoreOrder) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, status: FirestoreOrder["status"]) => void;
}

const OrdersTable = ({ orders, onViewDetails, onDelete, onStatusChange }: OrdersTableProps) => {
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <Table>
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
          <OrdersTableRow
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
