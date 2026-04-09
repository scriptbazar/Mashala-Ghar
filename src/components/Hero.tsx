import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-espresso flex items-center"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1920" 
          alt="Authentic Indian Spices" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-espresso/90 via-espresso/40 to-espresso" />
      </motion.div>

      {/* Floating Spice Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: ["-10%", "110%"],
              x: [Math.random() * 100 + "%", (Math.random() * 100 + 5) + "%"],
              opacity: [0, 0.4, 0],
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-2xl"
          >
            {['🍂', '🌿', '✨', '🌶️'][i % 4]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-8 relative z-20">
        <div className="max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl md:text-[10rem] font-serif font-bold mb-8 leading-[0.85] text-white"
          >
            Crafting <br />
            <span className="text-saffron italic">Pure</span> Magic
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-cream/60 text-xl md:text-3xl font-light mb-12 max-w-2xl leading-relaxed"
          >
            From heritage farms to every kitchen, we bring the 
            <span className="text-white font-serif italic"> soul of authentic Indian spices </span> 
            back to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap items-center gap-8"
          >
            <button 
              data-cursor="shop"
              className="group relative px-12 py-5 bg-saffron text-white font-black uppercase tracking-widest text-xs rounded-full overflow-hidden shadow-2xl shadow-saffron/20 hover:shadow-saffron/40 transition-all"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-burgundy translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Side Decorative Text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="rotate-90 origin-right flex items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-[1em] text-white/10 whitespace-nowrap">
            100% NATURAL • STONE GROUND
          </span>
          <div className="w-32 h-px bg-white/10" />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-8 right-8 flex justify-end items-end"
      >
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Scroll to explore</span>
        </div>
      </motion.div>
    </section>
  );
}
