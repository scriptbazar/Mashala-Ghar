import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type CheckoutStep = 'details' | 'success';

export default function Checkout() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(' ')[0] || "",
    lastName: user?.displayName?.split(' ')[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "online" as "online"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const txnid = `ORD${Date.now()}`;
      const productinfo = cart.map(item => item.name).join(', ');
      
      // 1. Create order in Firestore
      const orderData = {
        userId: user?.uid || "guest",
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          hindiName: item.hindiName,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: totalPrice,
        status: "pending_payment",
        paymentMethod: "online",
        txnid,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // 2. Get PayU Hash from our server
      const response = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid,
          amount: totalPrice,
          productinfo,
          firstname: formData.firstName,
          email: formData.email
        })
      });

      const { hash } = await response.json();

      // 3. Redirect to PayU
      const payuData: any = {
        key: import.meta.env.VITE_PAYU_MERCHANT_KEY || "TEST_KEY",
        txnid,
        amount: totalPrice.toString(),
        productinfo,
        firstname: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        surl: `${window.location.origin}/api/payu/success?orderId=${docRef.id}`,
        furl: `${window.location.origin}/api/payu/failure?orderId=${docRef.id}`,
        hash,
        service_provider: "payu_paisa"
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action = import.meta.env.VITE_PAYU_BASE_URL || "https://test.payu.in/_payment";

      for (const key in payuData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payuData[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl shadow-espresso/10 border border-espresso/5"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-espresso mb-4">Order Placed!</h2>
          <p className="text-espresso/60 mb-2">Thank you for your purchase.</p>
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

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-espresso/40 hover:text-espresso transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Checkout Form */}
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-espresso/5 border border-espresso/5"
            >
              <h1 className="text-4xl font-serif font-bold text-espresso mb-12">Checkout Details</h1>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Shipping Information */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                      <Truck size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-espresso">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={18} />
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={18} />
                        <input
                          required
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={18} />
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={18} />
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/20" size={18} />
                        <input
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                          placeholder="123, Spice Lane, Old Market"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">City</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">State</label>
                      <input
                        required
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-espresso/40 ml-1">ZIP Code</label>
                      <input
                        required
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full bg-cream/50 border border-espresso/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-espresso font-medium"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                      <CreditCard size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-espresso">Payment Method</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative flex items-center gap-4 p-6 rounded-[2rem] border-2 border-saffron bg-saffron/5">
                      <div className="w-6 h-6 rounded-full border-2 border-saffron flex items-center justify-center">
                        <div className="w-3 h-3 bg-saffron rounded-full" />
                      </div>
                      <div>
                        <p className="font-bold text-espresso">Online Payment (PayU)</p>
                        <p className="text-[10px] text-espresso/40 uppercase tracking-widest">Credit/Debit/UPI/Net Banking</p>
                      </div>
                    </div>
                  </div>
                </section>

                <button
                  disabled={isSubmitting || cart.length === 0}
                  type="submit"
                  className="w-full bg-espresso text-white py-6 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 hover:bg-saffron transition-all shadow-2xl shadow-espresso/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Place Order
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-espresso text-white rounded-[3rem] p-10 shadow-2xl shadow-espresso/20"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-saffron">
                    <ShoppingBag size={20} />
                  </div>
                  <h2 className="text-xl font-serif font-bold">Order Summary</h2>
                </div>

                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className={`w-16 h-16 rounded-xl ${item.color || 'bg-white/10'} flex-shrink-0 flex items-center justify-center`}>
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-bold truncate">{item.hindiName}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{item.quantity} x ₹{item.price}</p>
                      </div>
                      <p className="font-bold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Shipping</span>
                    <span className="text-saffron font-bold uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold pt-4">
                    <span>Total</span>
                    <span className="text-saffron">₹{totalPrice}</span>
                  </div>
                </div>
              </motion.div>

              <div className="bg-white rounded-[2rem] p-8 border border-espresso/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-espresso">Secure Checkout</p>
                  <p className="text-[10px] text-espresso/40 uppercase tracking-widest">SSL Encrypted Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
