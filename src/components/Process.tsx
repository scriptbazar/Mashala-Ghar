import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ShieldCheck, Sun, Wind, Gem } from "lucide-react";

const steps = [
  {
    title: "Sourcing",
    desc: "We hand-pick the finest raw spices directly from heritage farms across India.",
    icon: Gem,
    color: "bg-saffron",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Sun Drying",
    desc: "Spices are naturally sun-dried to preserve their essential oils and vibrant colors.",
    icon: Sun,
    color: "bg-turmeric",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Stone Grinding",
    desc: "Traditional slow stone grinding ensures the aroma and flavor remain intact.",
    icon: Wind,
    color: "bg-burgundy",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Quality Check",
    desc: "Every batch undergoes rigorous lab testing for 100% purity and zero adulteration.",
    icon: ShieldCheck,
    color: "bg-espresso",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Our Craft
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif font-bold text-espresso"
          >
            The <span className="italic text-burgundy">Process</span>
          </motion.h2>
        </div>

        <div className="space-y-32">
          {steps.map((step, i) => (
            <div 
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32`}
            >
              <div className="flex-1 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className={`w-20 h-20 ${step.color} text-white rounded-3xl flex items-center justify-center shadow-2xl`}
                >
                  <step.icon size={32} />
                </motion.div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-serif font-bold text-espresso">
                    <span className="text-espresso/10 mr-4">0{i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-xl text-espresso/60 leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-px flex-1 bg-espresso/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-espresso/20">Traditional Method</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="w-full aspect-4/3 object-cover hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                {/* Decorative Elements */}
                <div className={`absolute -top-10 -${i % 2 === 0 ? 'right' : 'left'}-10 w-64 h-64 ${step.color} opacity-5 rounded-full blur-3xl`} />
                <div className={`absolute -bottom-10 -${i % 2 === 0 ? 'left' : 'right'}-10 w-48 h-48 ${step.color} opacity-10 rounded-full blur-2xl`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
