import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Anjali Sharma",
    city: "Mumbai",
    text: "The aroma of the Garam Masala reminded me of my grandmother's kitchen. Truly authentic and fresh!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=anjali",
  },
  {
    name: "Rahul Verma",
    city: "Delhi",
    text: "Best Biryani Masala I've ever used. The saffron notes are incredible. Highly recommended for spice lovers.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=rahul",
  },
  {
    name: "Priya Iyer",
    city: "Bangalore",
    text: "I was skeptical about ordering spices online, but Masala Ghar exceeded my expectations. The packaging is top-notch.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=priya",
  },
  {
    name: "Vikram Singh",
    city: "Jaipur",
    text: "Pure, stone-ground spices that actually have flavor. You can taste the difference in every meal.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=vikram",
  },
  {
    name: "Meera Reddy",
    city: "Hyderabad",
    text: "The Turmeric is so vibrant and pure. I use it for both cooking and my morning health drinks.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=meera",
  },
  {
    name: "Sanjay Gupta",
    city: "Kolkata",
    text: "Fast delivery and amazing quality. The Chaat Masala is a game changer for my evening snacks.",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=sanjay",
  }
];

export default function Reviews() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-burgundy font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
          >
            Testimonials
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif font-bold text-espresso"
          >
            Wall of <span className="italic text-saffron">Love</span>
          </motion.h2>
        </div>

        {/* Reviews Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid bg-cream/30 p-10 rounded-[2.5rem] border border-espresso/5 hover:border-saffron/20 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso text-sm">{review.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-espresso/30">{review.city}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      size={10} 
                      fill={starIdx < review.rating ? "#F27D26" : "none"} 
                      className={starIdx < review.rating ? "text-saffron" : "text-espresso/10"}
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 text-saffron/5 group-hover:text-saffron/10 transition-colors" size={60} />
                <p className="relative z-10 text-lg text-espresso/70 leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Marquee */}
        <div className="mt-32 pt-20 border-t border-espresso/5">
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-20 items-center">
                  <span className="text-4xl md:text-6xl font-serif font-bold text-espresso/10">100% NATURAL</span>
                  <span className="text-4xl md:text-6xl font-serif font-bold text-espresso/10">STONE GROUND</span>
                  <span className="text-4xl md:text-6xl font-serif font-bold text-espresso/10">NO PRESERVATIVES</span>
                  <span className="text-4xl md:text-6xl font-serif font-bold text-espresso/10">LAB TESTED</span>
                  <span className="text-4xl md:text-6xl font-serif font-bold text-espresso/10">HERITAGE FARMS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
