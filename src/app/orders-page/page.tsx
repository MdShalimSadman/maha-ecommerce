"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// --- Type Definitions (Copy from above) ---
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
  status: string;
  items: OrderItem[];
  // Firestore Timestamp is an object, we'll convert it to a string for display
  orderDate: Timestamp;
}
// ------------------------------------------

export default function OrdersPage() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Create a query to the 'orders' collection
        const ordersCollectionRef = collection(db, "orders");

        // 2. Query orders, ordering by the most recent first
        const q = query(ordersCollectionRef, orderBy("orderDate", "desc"));

        // 3. Execute the query
        const querySnapshot = await getDocs(q);

        // 4. Map the documents to the desired data structure
        const fetchedOrders = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              // Explicitly cast to the defined type
            } as FirestoreOrder)
        );

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          "Failed to load orders. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this runs once on mount

  // --- Loading and Error States ---
  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-xl text-red-600">{error}</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-10 text-xl">No orders found.</p>;
  }

  // --- Render Orders List ---
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-[#A6686A] mb-8 text-center">
        Customer Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <div>
                <p className="text-lg font-semibold text-[#5e5a57]">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {order.orderDate.toDate().toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <h3 className="text-md font-bold mb-2 text-[#A6686A]">
              Customer Details
            </h3>
            <p>
              <strong>Name:</strong> {order.fullName}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentMethod.replace(/_/g, " ").toUpperCase()}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-md font-bold mb-2 text-[#A6686A]">Items</h3>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.title} (Qty: {item.quantity}) - $
                    {item.price.toFixed(2)} each
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
              <span className="text-xl font-bold text-[#A6686A]">
                Total: ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
