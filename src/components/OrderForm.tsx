import { motion } from "motion/react";
import { Send, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    product: "Garam Masala",
    message: ""
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, "tickets"), {
        customerName: formData.name,
        phone: formData.phone,
        city: formData.city,
        subject: `Inquiry: ${formData.product}`,
        message: formData.message,
        status: 'open',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: "", phone: "", city: "", product: "Garam Masala", message: "" });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-espresso rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-1/3 p-12 lg:p-16 bg-[radial-gradient(circle_at_0%_0%,#3a1500_0%,#1c0a00_100%)] text-white">
            <h2 className="text-4xl font-serif font-bold mb-8">Get in Touch</h2>
            <p className="text-white/60 mb-12">
              Have questions about our spices or want to place a bulk order? 
              We're here to help you bring authentic flavors to your kitchen.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-turmeric">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Our Kitchen</h4>
                  <p className="text-sm text-white/60">123, Heritage Lane, Jaipur, Rajasthan - 302001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-saffron">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Call Us</h4>
                  <p className="text-sm text-white/60">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-burgundy">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-sm text-white/60">namaste@masalaghar.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="flex-1 p-12 lg:p-16 bg-white">
            <h3 className="text-3xl font-serif font-bold mb-8 text-espresso">Place an Order</h3>
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-2xl font-serif font-bold text-espresso mb-2">Inquiry Sent!</h4>
                <p className="text-espresso/40">Thank you for reaching out. Our team will contact you shortly.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-saffron font-bold uppercase tracking-widest text-xs hover:underline"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-espresso/40">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 rounded-2xl bg-cream border border-espresso/5 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-espresso/40">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-6 py-4 rounded-2xl bg-cream border border-espresso/5 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-espresso/40">City</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Your city"
                    className="w-full px-6 py-4 rounded-2xl bg-cream border border-espresso/5 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-espresso/40">Product</label>
                  <select 
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-cream border border-espresso/5 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                  >
                    <option>Garam Masala</option>
                    <option>Chaat Masala</option>
                    <option>Biryani Masala</option>
                    <option>Turmeric Powder</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-espresso/40">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Any special instructions?"
                    className="w-full px-6 py-4 rounded-2xl bg-cream border border-espresso/5 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-saffron text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-burgundy transition-all shadow-xl shadow-saffron/20 disabled:opacity-50"
                  >
                    <Send size={20} />
                    {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                  </button>
                  {status === 'error' && (
                    <p className="mt-4 text-center text-burgundy text-xs font-bold uppercase tracking-widest">Something went wrong. Please try again.</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
