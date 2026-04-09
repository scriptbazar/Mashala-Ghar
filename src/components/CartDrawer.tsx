import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../lib/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const onClose = () => setIsCartOpen(false);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-cream shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-espresso/5 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center text-saffron">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-espresso">Your Cart</h2>
                  <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-black">
                    {totalItems} Items
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-espresso/40 hover:text-espresso transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-espresso/5 rounded-full flex items-center justify-center text-espresso/20 mb-4">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-espresso mb-2">Cart is empty</h3>
                  <p className="text-sm text-espresso/40 mb-8 max-w-[200px]">
                    Looks like you haven't added any spices to your collection yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 bg-espresso text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-saffron transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="flex gap-4 group"
                  >
                    <div className={`w-24 h-24 rounded-2xl ${item.color || 'bg-white'} flex-shrink-0 relative overflow-hidden flex items-center justify-center`}>
                      <img
                        src={item.image || `https://picsum.photos/seed/${item.name}/200/200`}
                        alt={item.name}
                        className="w-16 h-16 object-contain mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-bold text-espresso leading-tight">{item.hindiName || item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-espresso/20 hover:text-burgundy transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.hindiName && (
                          <p className="text-[10px] uppercase tracking-widest text-espresso/40 font-black mb-2">{item.name}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white rounded-lg border border-espresso/5 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-espresso">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-espresso">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-espresso/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-espresso/40 uppercase tracking-widest">Subtotal</span>
                  <span className="text-2xl font-serif font-bold text-espresso">₹{totalPrice}</span>
                </div>
                <p className="text-[10px] text-espresso/40 text-center italic">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-espresso text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-saffron transition-all shadow-xl shadow-espresso/10 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
