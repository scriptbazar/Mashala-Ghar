import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../lib/CartContext";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    const updateOrder = async () => {
      if (orderId) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await updateDoc(orderRef, {
            status: "paid",
            paymentStatus: "success"
          });
          clearCart();
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }
    };
    updateOrder();
  }, [orderId, clearCart]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-espresso/10 border border-espresso/5"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-espresso mb-4">Payment Successful!</h2>
        <p className="text-espresso/60 mb-2">Your order has been placed successfully.</p>
        <p className="text-sm font-mono text-espresso/40 mb-8 uppercase tracking-widest">Order ID: {orderId}</p>
        
        <div className="space-y-4">
          <Link 
            to="/dashboard"
            className="block w-full bg-espresso text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-saffron transition-all"
          >
            Track Order
          </Link>
          <Link 
            to="/"
            className="block w-full py-4 text-espresso/40 font-bold uppercase tracking-widest text-xs hover:text-espresso transition-all"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
