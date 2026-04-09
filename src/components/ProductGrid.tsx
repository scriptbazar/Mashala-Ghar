import { motion } from "motion/react";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { products as staticProducts } from "../data/products";

export default function ProductGrid() {
  const [activeCat, setActiveCat] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If Firestore is empty, we can show static products as fallback or merge them
      if (firestoreProducts.length === 0) {
        setProducts(staticProducts);
      } else {
        setProducts(firestoreProducts);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => 
    activeCat === "All" || p.category === activeCat
  );

  return (
    <section id="spices" className="py-32 bg-cream relative">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-burgundy font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
            >
              The Collection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl font-serif font-bold mb-6 leading-none"
            >
              Our <span className="text-saffron italic">Spices</span>
            </motion.h2>
            <p className="text-espresso/40 text-xl font-light max-w-lg">
              A curated selection of the finest artisanal blends, 
              hand-crafted for the discerning palate.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", "Blends", "Pure", "Limited"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-500 ${
                  activeCat === cat 
                    ? "bg-espresso text-white shadow-xl shadow-espresso/20" 
                    : "bg-white text-espresso/40 hover:text-espresso border border-espresso/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
