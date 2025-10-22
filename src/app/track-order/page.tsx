"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient"; // Assuming db is the firestore instance
import { doc, getDoc, type Timestamp } from "firebase/firestore"; // Import doc and getDoc for single document retrieval
import { useSearchParams } from "next/navigation"; // For Next.js to read query parameters
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// --- Re-using Interface Definitions from OrdersPage ---
// (You should place these in a shared file like @/types/order.ts in a real app)

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

// --- Component 2: OrderDetailDialog (Copy from original file, or import if shared) ---
// Note: Since this component is large, I'll assume you'll place it in a shared location 
// or copy-paste it here, as it's defined in your original code.
// I'll skip the body of OrderDetailDialog for brevity, but its interface is required:

interface OrderDetailDialogProps {
  order: FirestoreOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

// Placeholder for the dialog component to make the main component compile.
// **In your file, you must include the full OrderDetailDialog component from your initial code.**
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
    // ... [FULL OrderDetailDialog CONTENT FROM YOUR ORIGINAL CODE GOES HERE] ...
    // For this demonstration, a minimal version suffices:
    <div
      style={{
        display: isOpen && order ? "block" : "none",
        border: "1px solid #ccc",
        padding: "20px",
      }}
    >
      <h3>Order ID: {order.id}</h3>
      <p>Status: {order.status}</p>
      <p>Customer: {order.fullName}</p>
      <p>Total: ${order.totalPrice.toFixed(2)}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};


// --- Component 4: TrackOrderPage (New Component) ---

export default function TrackOrderPage() {
  // Use Next.js searchParams hook to get the orderId from the URL (e.g., /track?orderId=XYZ)
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");

  const [orderId, setOrderId] = useState(urlOrderId || "");
  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to fetch the order from Firestore
  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setFetchError(null);
    setOrder(null);

    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedOrder = {
          id: docSnap.id,
          ...docSnap.data(),
        } as FirestoreOrder;
        
        setOrder(fetchedOrder);
        // Automatically open the dialog on successful fetch
        setIsDialogOpen(true); 
      } else {
        setFetchError(`No order found with ID: ${id}`);
      }
    } catch (e) {
      console.error("Error fetching order:", e);
      setFetchError("An error occurred while fetching the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch order if orderId is present in URL on initial load
  useEffect(() => {
    if (urlOrderId) {
      fetchOrder(urlOrderId);
    }
  }, [urlOrderId]);

  // Handler for the "Track Order" button click
  const handleTrack = () => {
    // Navigate to the new URL with the orderId as a query parameter
    // This will trigger the useEffect for a full page navigation/refresh,
    // but a cleaner way in a real app might be to use Next.js router.push 
    // to update the URL without a full page reload, or just call fetchOrder(orderId) directly.
    // For a simple implementation, we call fetchOrder directly.
    fetchOrder(orderId.trim());
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#A6686A]">
            Track Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            Please enter your unique Order ID to view the current status of your shipment.
          </p>

          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-grow"
              aria-label="Order ID Input"
            />
            <Button 
                onClick={handleTrack} 
                disabled={loading || orderId.trim().length === 0}
                className="bg-[#C08387] hover:bg-[#A6686A]"
            >
              {loading ? "Tracking..." : "Track Order"}
            </Button>
          </div>

          {fetchError && (
            <p className="mt-4 text-sm text-red-600 font-medium">
              Error: {fetchError}
            </p>
          )}

          <Separator className="my-6" />

          {/* Optional: Show last search result summary here */}
          {order && !isDialogOpen && (
             <div className="p-3 border rounded-md">
                <p className="font-semibold text-lg">Order ID: <span className="font-mono text-sm text-[#A6686A]">{order.id}</span></p>
                <p>Status: <span className="font-medium">{order.status}</span></p>
                <Button variant="link" onClick={() => setIsDialogOpen(true)} className="p-0 h-auto">View Full Details</Button>
             </div>
          )}

        </CardContent>
      </Card>

      {/* Re-use the existing Order Detail Dialog */}
      <OrderDetailDialog
        order={order}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

// Example usage in your Next.js route:
// If this file is at app/track/page.tsx, the page URL would be /track.
// You could link to it as: <Link href="/track?orderId=SOME_ID">Track</Link>