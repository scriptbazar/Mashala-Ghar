import { useParams, Link, useNavigate } from "react-router-dom";
import { products as staticProducts } from "../data/products";
import { motion } from "motion/react";
import { Star, ShoppingCart, MessageCircle, ArrowLeft, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db, signInWithGoogle } from "../lib/firebase";
import { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        // Try to find in static products first (for fallback)
        const staticP = staticProducts.find(p => p.id.toString() === id);
        if (staticP) {
          setProduct(staticP);
          setLoading(false);
          return;
        }

        // Otherwise fetch from Firestore
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream">
        <h2 className="text-2xl font-serif font-bold text-espresso mb-4">Product not found</h2>
        <Link to="/" className="text-saffron font-bold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const isInWishlist = profile?.wishlist?.includes(product.id);

  const toggleWishlist = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }

    setIsWishlisting(true);
    const userDocRef = doc(db, 'users', user.uid);

    try {
      if (isInWishlist) {
        await updateDoc(userDocRef, {
          wishlist: arrayRemove(product.id)
        });
      } else {
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(product.id)
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <div className="container mx-auto px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-espresso/40 hover:text-espresso transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> Back to Collection
        </button>

        {/* Top Section: Image & Primary Info */}
        <div className="flex flex-col lg:flex-row gap-16 mb-20">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative aspect-square rounded-[3rem] overflow-hidden flex items-center justify-center ${product.color} shadow-2xl shadow-espresso/10`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,white_0%,transparent_70%)]" />
              <img 
                src={product.image || `https://picsum.photos/seed/${product.name}/800/800`} 
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply"
                referrerPolicy="no-referrer"
              />
              
              {product.tag && (
                <div className="absolute top-8 left-8">
                  <span className="bg-burgundy text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-[0.2em]">
                    {product.tag}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-6xl md:text-7xl font-serif font-bold text-espresso mb-2"
                >
                  {product.hindiName}
                </motion.h1>
                <p className="text-xl font-bold text-espresso/40 uppercase tracking-[0.3em]">{product.name}</p>
              </div>
              <button 
                onClick={toggleWishlist}
                disabled={isWishlisting}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isInWishlist 
                    ? "bg-burgundy text-white shadow-xl shadow-burgundy/20" 
                    : "bg-white text-espresso/40 hover:text-burgundy shadow-lg"
                }`}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-turmeric bg-turmeric/10 px-4 py-2 rounded-full">
                <Star size={20} fill="currentColor" />
                <span className="text-lg font-bold">{product.rating}</span>
                <span className="text-espresso/40 text-sm font-medium">({product.reviews.length} Reviews)</span>
              </div>
              <div className="h-8 w-px bg-espresso/10" />
              <span className="text-espresso/60 font-bold">{product.weight} Pack</span>
            </div>

            <div className="mb-12">
              <span className="text-6xl font-serif font-bold text-saffron">₹{product.price}</span>
              <p className="text-espresso/40 text-sm mt-2">Inclusive of all taxes</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-white rounded-2xl border border-espresso/10 p-2">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors text-xl font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-bold text-espresso">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 flex items-center justify-center text-espresso/40 hover:text-saffron transition-colors text-xl font-bold"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${
                  isAdded 
                    ? "bg-green-600 text-white shadow-green-600/20" 
                    : "bg-espresso text-white hover:bg-espresso/90 shadow-espresso/20"
                }`}
              >
                {isAdded ? (
                  <>
                    <Star size={20} fill="currentColor" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Details & Shipping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Ingredients */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-espresso/5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-espresso/40 mb-6">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="px-4 py-2 bg-cream border border-espresso/5 rounded-xl text-sm font-medium text-espresso/70">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Health Benefits */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-espresso/5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-espresso/40 mb-6">Health Benefits</h3>
            <div className="space-y-4">
              {product.benefits.map((ben, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-espresso/70 font-medium leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-saffron mt-1.5 shrink-0" />
                  {ben}
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Trust */}
          <div className="bg-espresso text-white p-10 rounded-[2.5rem] shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Shipping & Trust</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">100% Pure</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Lab Tested Quality</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">Fast Delivery</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Across India</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-saffron">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">Easy Return</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">7-Day Policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-serif font-bold text-espresso">Customer Reviews</h2>
            <div className="flex items-center gap-2 text-turmeric">
              <Star size={24} fill="currentColor" />
              <span className="text-2xl font-bold">{product.rating}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2rem] border border-espresso/5 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center font-bold text-espresso">
                      {rev.user[0]}
                    </div>
                    <span className="font-bold text-espresso">{rev.user}</span>
                  </div>
                  <div className="flex items-center gap-1 text-turmeric">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star 
                        key={starIdx} 
                        size={12} 
                        fill={starIdx < rev.rating ? "currentColor" : "none"} 
                        stroke="currentColor" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-espresso/60 italic leading-relaxed">"{rev.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
