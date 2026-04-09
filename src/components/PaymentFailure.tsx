import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { XCircle } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const updateOrder = async () => {
      if (orderId) {
        try {
          const orderRef = doc(db, "orders", orderId);
          await updateDoc(orderRef, {
            status: "payment_failed",
            paymentStatus: "failed"
          });
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }
    };
    updateOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-espresso/10 border border-espresso/5"
      >
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle size={48} />
        </div>
        <h2 className="text-4xl font-serif font-bold text-espresso mb-4">Payment Failed</h2>
        <p className="text-espresso/60 mb-8">We couldn't process your payment. Please try again or contact support.</p>
        
        <div className="space-y-4">
          <Link 
            to="/checkout"
            className="block w-full bg-espresso text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-saffron transition-all"
          >
            Try Again
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
