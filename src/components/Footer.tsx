import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-espresso text-white pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl">🌶️</span>
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-bold tracking-tight">
                  Masala <span className="text-saffron">Ghar</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 -mt-1">
                  Masala Ghar
                </span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mb-8">
              "The Taste of Home, The Secret of Authentic Spices." 
              Bringing 100% homemade, authentic Indian spices from our kitchen to yours.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: "#FF6B00" }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-serif font-bold mb-8 text-turmeric">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "All Spices", "Our Story", "Recipes", "Bulk Orders", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 hover:text-saffron transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-serif font-bold mb-8 text-turmeric">Categories</h4>
            <ul className="space-y-4">
              {["Garam Masala", "Pure Powders", "Regional Blends", "Seasoning", "Gift Boxes", "New Arrivals"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 hover:text-saffron transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-serif font-bold mb-8 text-turmeric">Newsletter</h4>
            <p className="text-white/50 text-sm mb-6">Subscribe to get the latest recipes and special offers.</p>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-saffron outline-none transition-all"
              />
              <button className="w-full bg-saffron text-white py-4 rounded-2xl font-bold hover:bg-burgundy transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
          <p>© 2024 Masala Ghar. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="flex items-center gap-2">
            Made with <span className="text-burgundy">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
