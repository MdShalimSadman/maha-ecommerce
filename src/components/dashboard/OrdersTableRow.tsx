"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { FirestoreOrder } from "./index";
import { Info, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface OrdersTableRowProps {
  order: FirestoreOrder;
  onViewDetails: (order: FirestoreOrder) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, status: FirestoreOrder["status"]) => void;
}

const OrdersTableRow = ({
  order,
  onViewDetails,
  onDelete,
  onStatusChange,
}: OrdersTableRowProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 1500); // show check for 1.5 seconds
    });
  };

  return (
    <TableRow className={order.status === "Delivered" ? "bg-green-50/50" : ""}>
      <TableCell className="font-medium text-sm text-[#A6686A] flex items-center gap-2">
        {order.id.substring(0, 8)}...
        <Button
          variant="ghost"
          size="icon"
          className="p-0 cursor-pointer"
          onClick={handleCopyId}
          title={copied ? "Copied!" : "Copy Order ID"}
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </Button>
      </TableCell>
      <TableCell>
        <div className="font-semibold">{order.fullName}</div>
        <div className="text-xs text-gray-500">{order.email}</div>
      </TableCell>
      <TableCell>{order.orderDate.toDate().toLocaleDateString()}</TableCell>
      <TableCell className="text-right font-bold text-lg">
        BDT {order.totalPrice.toFixed(2)}
      </TableCell>
      <TableCell>
        <Select
          value={order.status}
          onValueChange={(value) =>
            onStatusChange(order.id, value as FirestoreOrder["status"])
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
          title="View detail"
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
          onClick={() => onViewDetails(order)}
        >
          <Info />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          title="Delete"
          className="text-red-600 hover:text-red-800 cursor-pointer"
          onClick={() => onDelete(order.id)}
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default OrdersTableRow;
