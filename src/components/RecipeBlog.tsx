import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const recipes = [
  {
    title: "Royal Paneer Butter Masala",
    time: "30 mins",
    difficulty: "Medium",
    image: "https://picsum.photos/seed/paneer/800/600",
    spice: "Kitchen King",
  },
  {
    title: "Authentic Hyderabadi Biryani",
    time: "60 mins",
    difficulty: "Hard",
    image: "https://picsum.photos/seed/biryani/800/600",
    spice: "Biryani Masala",
  },
  {
    title: "Street Style Pav Bhaji",
    time: "25 mins",
    difficulty: "Easy",
    image: "https://picsum.photos/seed/pavbhaji/800/600",
    spice: "Pav Bhaji Masala",
  },
];

export default function RecipeBlog() {
  return (
    <section id="recipes" className="py-24 bg-cream">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold mb-4"
            >
              Dishes Made With Our <span className="text-burgundy">Spices</span>
            </motion.h2>
            <p className="text-espresso/60">
              Discover delicious recipes crafted with our authentic spice blends. 
              Bring the restaurant taste to your home kitchen.
            </p>
          </div>
          <button className="flex items-center gap-2 text-saffron font-bold hover:gap-4 transition-all">
            View All Recipes <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[4/5]">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-espresso/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-turmeric font-bold text-xs uppercase tracking-widest mb-2">Main Spice: {recipe.spice}</span>
                  <h3 className="text-white text-2xl font-serif font-bold">{recipe.title}</h3>
                </div>
                <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full text-white text-xs font-bold">
                  {recipe.time}
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold group-hover:text-saffron transition-colors">{recipe.title}</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-espresso/40">{recipe.difficulty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
