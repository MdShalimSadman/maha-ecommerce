"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient"; // Assuming db is the firestore instance
import { doc, getDoc, type Timestamp } from "firebase/firestore"; // Import doc and getDoc for single document retrieval
import { useSearchParams } from "next/navigation"; // For Next.js to read query parameters
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// --- Interface Definitions (Kept the same) ---
interface OrderItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

interface FirestoreOrder {
  id: string;
  fullName: string;
  email: string; // <-- This is the key field for security check
  phone: string;
  address: string;
  paymentMethod: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  orderDate: Timestamp;
}

// Placeholder for OrderDetailDialog (Kept the same)
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
  return (
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


// --- Component 4: TrackOrderPage (New Component with Security Improvement) ---

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");
  // ADDED: Retrieve email from URL if available (optional)
  const urlEmail = searchParams.get("email"); 

  const [orderId, setOrderId] = useState(urlOrderId || "");
  // ADDED: State for the email address
  const [email, setEmail] = useState(urlEmail || ""); 
  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // MODIFIED: Function to fetch the order and verify the email
  const fetchOrder = async (id: string, customerEmail: string) => {
    const trimmedEmail = customerEmail.trim().toLowerCase(); // Normalize email
    if (!id || !trimmedEmail) return;

    setLoading(true);
    setFetchError(null);
    setOrder(null);

    try {
      const docRef = doc(db, "orders", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedOrderData = docSnap.data();
        // SECURITY CHECK: Verify the email in the document matches the provided email
        if (fetchedOrderData.email.toLowerCase() === trimmedEmail) {
          const fetchedOrder = {
            id: docSnap.id,
            ...fetchedOrderData,
          } as FirestoreOrder;
          
          setOrder(fetchedOrder);
          // Automatically open the dialog on successful fetch
          setIsDialogOpen(true); 
        } else {
          // IMPORTANT: Use a generic error message to prevent revealing which piece of info was wrong
          setFetchError(`No order found matching the provided ID and Email.`);
        }
      } else {
        setFetchError(`No order found matching the provided ID and Email.`);
      }
    } catch (e) {
      console.error("Error fetching order:", e);
      setFetchError("An error occurred while fetching the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // MODIFIED: Effect to fetch order if both ID and Email are in the URL
  useEffect(() => {
    if (urlOrderId && urlEmail) {
      fetchOrder(urlOrderId, urlEmail);
    }
  }, [urlOrderId, urlEmail]);

  // MODIFIED: Handler for the "Track Order" button click
  const handleTrack = () => {
    // Ensure both fields are filled before attempting to track
    if (orderId.trim().length > 0 && email.trim().length > 0) {
      fetchOrder(orderId.trim(), email.trim());
    } else {
      setFetchError("Please enter both the Order ID and Email Address.");
    }
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
            Please enter your unique Order ID and the Email Address used for the order.
          </p>

          <div className="space-y-4"> {/* Added spacing */}
            {/* Order ID Input */}
            <Input
              type="text"
              placeholder="Enter Order ID (e.g., V4XkL8qZ)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              aria-label="Order ID Input"
            />

            {/* NEW: Email Input */}
            <Input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email Address Input"
            />

            {/* Track Button */}
            <Button 
                onClick={handleTrack} 
                disabled={loading || orderId.trim().length === 0 || email.trim().length === 0}
                className="w-full bg-[#C08387] hover:bg-[#A6686A]"
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