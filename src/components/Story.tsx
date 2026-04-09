import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Quote } from "lucide-react";

const milestones = [
  {
    year: "1985",
    title: "The Humble Kitchen",
    desc: "In a small village in Rajasthan, Dadi ji began grinding spices by hand on a stone sil-batta. Her goal was simple: to bring back the lost aroma of pure spices to her neighborhood.",
    image: "https://picsum.photos/seed/rajasthan-kitchen/1200/800",
    location: "Rajasthan, India"
  },
  {
    year: "1998",
    title: "The Golden Ratio",
    desc: "After years of experimentation, our signature 'Garam Masala' was born. A precise blend of 21 hand-picked spices, roasted at specific temperatures to unlock their hidden essential oils.",
    image: "https://picsum.photos/seed/spice-blend/1200/800",
    location: "Family Recipe"
  },
  {
    year: "2012",
    title: "Legacy of Trust",
    desc: "What started in a kitchen grew into a community movement. Masala Ghar became synonymous with 'Purity' in an age where adulteration was common. We never compromised on quality.",
    image: "https://picsum.photos/seed/spice-market/1200/800",
    location: "Community Growth"
  },
  {
    year: "2024",
    title: "Global Heritage",
    desc: "Today, we combine ancient wisdom with modern technology. Our spices are still small-batch, but now they travel from our home to yours, anywhere in India, within days.",
    image: "https://picsum.photos/seed/modern-spice/1200/800",
    location: "Digital Era"
  },
];

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section 
      id="our-story"
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-cream"
    >
      {/* Parallax Background Texture */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] scale-150" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 mb-8 bg-burgundy/5 px-6 py-2 rounded-full border border-burgundy/10"
          >
            <span className="text-burgundy font-black uppercase tracking-[0.4em] text-[10px]">
              Our Heritage & Legacy
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-serif font-bold mb-12 text-espresso leading-[0.85]"
          >
            The Story of <br />
            <span className="text-saffron italic">Our Spices</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative inline-block"
          >
            <Quote className="absolute -top-10 -left-10 text-saffron/20 w-20 h-20" />
            <p className="text-espresso/60 italic font-serif text-3xl md:text-4xl max-w-3xl mx-auto leading-relaxed">
              "A legacy of taste, passed down through four generations of home kitchens, now arriving at yours."
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-espresso/10 to-transparent hidden lg:block" />

          <div className="space-y-64">
            {milestones.map((m, i) => (
              <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Image Side */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: "circOut" }}
                  className="flex-1 w-full"
                >
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-burgundy/5 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform duration-700" />
                    <div className="relative overflow-hidden rounded-[3rem] shadow-2xl aspect-[4/3]">
                      <img 
                        src={m.image} 
                        alt={m.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-espresso/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                        <span className="text-white/80 text-xs font-bold uppercase tracking-widest">{m.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Year Marker (Center) */}
                <div className="relative flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="w-24 h-24 rounded-full bg-espresso text-white flex flex-col items-center justify-center z-10 shadow-2xl border-[12px] border-cream"
                  >
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-black">Year</span>
                    <span className="text-xl font-bold">{m.year}</span>
                  </motion.div>
                </div>

                {/* Text Side */}
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="flex-1 text-center lg:text-left"
                >
                  <span className="text-saffron font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
                    Chapter {i + 1}
                  </span>
                  <h3 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-espresso leading-tight">
                    {m.title}
                  </h3>
                  <p className="text-espresso/50 text-xl leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                    {m.desc}
                  </p>
                  <div className="mt-10 h-1 w-20 bg-saffron/20 rounded-full mx-auto lg:mx-0" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-64 text-center max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <Quote className="text-burgundy w-8 h-8" />
          </div>
          <h3 className="text-4xl font-serif font-bold text-espresso mb-6">And the story continues...</h3>
          <p className="text-espresso/40 text-lg leading-relaxed">
            Every time you open a pack of Masala Ghar, you become a part of our legacy. Thank you for keeping the tradition alive in your kitchen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
