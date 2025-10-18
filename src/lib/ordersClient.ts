
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseClient";

export async function createOrder(order: Omit<Order, "createdAt">) {
  const ordersCol = collection(db, "orders");
  const docRef = await addDoc(ordersCol, {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
