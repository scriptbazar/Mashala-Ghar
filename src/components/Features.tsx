import { motion } from "motion/react";
import { Leaf, Home, Sprout, ChefHat, ShieldCheck, Sparkles, Microscope, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    desc: "No artificial colors, preservatives, or MSG. Just pure, sun-dried goodness from nature.",
    color: "bg-green-500/10 text-green-600",
    size: "lg:col-span-2",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: Home,
    title: "Home Kitchen Crafted",
    desc: "Small batches made with traditional methods, ensuring that 'Maa ke haath ka swad'.",
    color: "bg-saffron/10 text-saffron",
    size: "lg:col-span-1"
  },
  {
    icon: Sprout,
    title: "Ethically Sourced",
    desc: "Directly from organic farms across India, supporting local farmers and sustainable practices.",
    color: "bg-turmeric/10 text-turmeric",
    size: "lg:col-span-1"
  },
  {
    icon: ChefHat,
    title: "Heritage Recipes",
    desc: "Secret family blends passed down through four generations, now available for your kitchen.",
    color: "bg-burgundy/10 text-burgundy",
    size: "lg:col-span-2",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: Microscope,
    title: "Lab Tested",
    desc: "Every batch undergoes rigorous quality checks for purity and potency.",
    color: "bg-blue-500/10 text-blue-600",
    size: "lg:col-span-1"
  },
  {
    icon: Heart,
    title: "Zero Adulteration",
    desc: "We promise 0% fillers. You get 100% of the spice you pay for, always.",
    color: "bg-espresso/10 text-espresso",
    size: "lg:col-span-1"
  },
  {
    icon: Sparkles,
    title: "Stone Ground",
    desc: "Slow-ground using traditional stones to preserve essential oils and intense aroma.",
    color: "bg-orange-500/10 text-orange-600",
    size: "lg:col-span-1"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-cream relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-saffron blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-burgundy blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-saffron" />
            <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px]">
              The Masala Ghar Difference
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-serif font-bold leading-[0.9] text-espresso"
          >
            Why Are Our Spices <br />
            <span className="italic text-burgundy">Truly Special?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-espresso/60 max-w-2xl font-medium"
          >
            We don't just sell spices; we preserve a legacy of purity and taste that has been lost in the age of mass production.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`${f.size} group relative bg-white rounded-[2.5rem] p-10 border border-espresso/5 hover:border-saffron/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-espresso/5 overflow-hidden`}
            >
              {f.image && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                  <img src={f.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon size={28} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif font-bold mb-4 text-espresso group-hover:text-saffron transition-colors">
                  {f.title}
                </h3>
                
                <p className="text-espresso/50 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
              
              {/* Decorative Corner Element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-espresso/5 rounded-full blur-2xl group-hover:bg-saffron/10 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap items-center justify-center gap-12 py-12 border-t border-espresso/5"
        >
          <div className="flex items-center gap-3 text-espresso/40">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">FSSAI Certified</span>
          </div>
          <div className="flex items-center gap-3 text-espresso/40">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">ISO 9001:2015</span>
          </div>
          <div className="flex items-center gap-3 text-espresso/40">
            <ShieldCheck size={20} />
            <span className="text-xs font-black uppercase tracking-widest">100% Vegetarian</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
