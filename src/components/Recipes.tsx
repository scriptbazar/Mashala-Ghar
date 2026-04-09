import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, Flame, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const recipes = [
  {
    title: "Classic Butter Chicken",
    time: "45 mins",
    serves: "4 People",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    spice: "Garam Masala",
    ingredients: [
      "800g Chicken thighs, bite-sized",
      "2 tbsp Masala Ghar Garam Masala",
      "1 cup Tomato puree",
      "1/2 cup Heavy cream",
      "50g Butter",
      "1 tbsp Ginger-garlic paste",
      "Kasoori Methi for garnish"
    ],
    steps: [
      "Marinate chicken with ginger-garlic paste and a pinch of salt for 20 mins.",
      "Pan-fry the chicken until golden brown and set aside.",
      "In the same pan, melt butter and add tomato puree. Cook until oil separates.",
      "Add Masala Ghar Garam Masala and cook for 2 minutes.",
      "Stir in the cream and add the chicken back to the pan.",
      "Simmer for 5-10 minutes and garnish with crushed Kasoori Methi."
    ]
  },
  {
    title: "Authentic Paneer Tikka",
    time: "30 mins",
    serves: "3 People",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800",
    spice: "Tandoori Masala",
    ingredients: [
      "400g Paneer cubes",
      "1 cup Thick yogurt (Hung curd)",
      "2 tbsp Masala Ghar Tandoori Masala",
      "1 Bell pepper, cubed",
      "1 Onion, cubed",
      "1 tbsp Lemon juice",
      "Butter for basting"
    ],
    steps: [
      "Whisk yogurt with Masala Ghar Tandoori Masala and lemon juice.",
      "Add paneer, peppers, and onions to the marinade. Coat well and rest for 30 mins.",
      "Skewer the paneer and vegetables alternately.",
      "Grill in a preheated oven at 200°C or on a tawa until charred on edges.",
      "Baste with butter halfway through for extra richness.",
      "Serve hot with mint chutney."
    ]
  },
  {
    title: "Royal Mutton Biryani",
    time: "90 mins",
    serves: "6 People",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800",
    spice: "Biryani Masala",
    ingredients: [
      "1kg Mutton, bone-in",
      "3 cups Basmati rice, soaked",
      "3 tbsp Masala Ghar Biryani Masala",
      "2 large Onions, thinly sliced (Birista)",
      "1 cup Yogurt",
      "Saffron soaked in warm milk",
      "Fresh Mint and Coriander"
    ],
    steps: [
      "Marinate mutton with yogurt and Masala Ghar Biryani Masala for at least 2 hours.",
      "Cook the marinated mutton in a pressure cooker until 80% done.",
      "Parboil the rice with whole spices until 70% cooked.",
      "In a heavy-bottomed pot, layer mutton and rice alternately.",
      "Top with fried onions, mint, coriander, and saffron milk.",
      "Seal the pot (Dum) and cook on very low heat for 20-25 minutes."
    ]
  },
  {
    title: "Dal Tadka Dhaba Style",
    time: "25 mins",
    serves: "4 People",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800",
    spice: "Turmeric & Cumin",
    ingredients: [
      "1 cup Toor Dal (Pigeon peas)",
      "1 tsp Masala Ghar Turmeric",
      "1 tsp Masala Ghar Cumin seeds",
      "2 Dried red chilies",
      "1 tbsp Ghee",
      "4 cloves Garlic, minced",
      "Fresh Coriander"
    ],
    steps: [
      "Pressure cook dal with turmeric and salt until soft.",
      "Heat ghee in a small pan for tadka.",
      "Add cumin seeds and let them splutter.",
      "Add dried red chilies and minced garlic. Fry until garlic is golden.",
      "Pour the hot tadka over the cooked dal.",
      "Garnish with fresh coriander and serve with steamed rice."
    ]
  },
  {
    title: "Spicy Fish Curry",
    time: "40 mins",
    serves: "3 People",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800",
    spice: "Fish Curry Masala",
    ingredients: [
      "500g Fish steaks (Rohu or Surmai)",
      "2 tbsp Masala Ghar Fish Curry Masala",
      "1 cup Coconut milk",
      "2 tbsp Tamarind pulp",
      "1 Onion, finely chopped",
      "Curry leaves and Mustard seeds"
    ],
    steps: [
      "Rub fish with a bit of salt and turmeric. Set aside.",
      "Sauté onions until translucent. Add Masala Ghar Fish Curry Masala.",
      "Add tamarind pulp and coconut milk. Bring to a gentle simmer.",
      "Carefully slide in the fish pieces.",
      "Cook for 8-10 minutes until fish is tender.",
      "Finish with a tempering of mustard seeds and curry leaves in coconut oil."
    ]
  },
  {
    title: "Masala Chai Heritage",
    time: "10 mins",
    serves: "2 People",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800",
    spice: "Chai Masala",
    ingredients: [
      "2 cups Water",
      "1 cup Milk",
      "2 tsp Black tea leaves",
      "1 tsp Masala Ghar Chai Masala",
      "Sugar to taste"
    ],
    steps: [
      "Boil water in a saucepan.",
      "Add tea leaves and Masala Ghar Chai Masala. Simmer for 2 minutes.",
      "Add milk and sugar. Bring to a rolling boil.",
      "Let it boil up 2-3 times for a rich texture.",
      "Strain into cups and serve with biscuits."
    ]
  }
];

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipes[0] | null>(null);

  return (
    <section id="recipes" className="py-32 bg-cream">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-burgundy font-black uppercase tracking-[0.4em] text-[10px] mb-4 block"
            >
              Kitchen Secrets
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-8xl font-serif font-bold text-espresso leading-none"
            >
              Spice <span className="italic text-saffron">Recipes</span>
            </motion.h2>
          </div>
          <button className="group flex items-center gap-3 text-espresso font-bold uppercase tracking-widest text-xs hover:text-saffron transition-colors">
            View All Recipes <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {recipes.map((recipe, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-espresso/5"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-espresso shadow-sm">
                    {recipe.spice}
                  </span>
                </div>
              </div>

              <div className="p-10">
                <h3 className="text-2xl font-serif font-bold text-espresso mb-6 group-hover:text-saffron transition-colors">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center justify-between py-6 border-y border-espresso/5 mb-8">
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={16} className="text-saffron" />
                    <span className="text-[10px] font-bold text-espresso/40 uppercase">{recipe.time}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Users size={16} className="text-saffron" />
                    <span className="text-[10px] font-bold text-espresso/40 uppercase">{recipe.serves}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Flame size={16} className="text-saffron" />
                    <span className="text-[10px] font-bold text-espresso/40 uppercase">{recipe.difficulty}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full py-4 rounded-2xl border border-espresso/10 font-bold text-xs uppercase tracking-widest text-espresso hover:bg-espresso hover:text-white transition-all duration-300"
                >
                  View Recipe
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-espresso/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-espresso hover:bg-saffron hover:text-white transition-all"
              >
                <X size={24} />
              </button>

              {/* Modal Image Section */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-espresso/60 to-transparent md:hidden" />
                <div className="absolute bottom-6 left-6 md:hidden">
                  <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                    {selectedRecipe.title}
                  </h3>
                </div>
              </div>

              {/* Modal Content Section */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                <div className="hidden md:block mb-8">
                  <span className="text-saffron font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
                    {selectedRecipe.spice} Special
                  </span>
                  <h3 className="text-5xl font-serif font-bold text-espresso leading-tight">
                    {selectedRecipe.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-lg font-bold text-espresso uppercase tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-saffron" /> Ingredients
                    </h4>
                    <ul className="space-y-4">
                      {selectedRecipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-espresso/60 text-sm">
                          <CheckCircle2 size={18} className="text-saffron shrink-0 mt-0.5" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preparation */}
                  <div>
                    <h4 className="text-lg font-bold text-espresso uppercase tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-saffron" /> Preparation
                    </h4>
                    <div className="space-y-6">
                      {selectedRecipe.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className="text-2xl font-serif font-bold text-saffron/30 shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <p className="text-espresso/70 text-sm leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-8 border-t border-espresso/5 flex flex-wrap gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-espresso/30 uppercase tracking-widest">Time</p>
                      <p className="text-sm font-bold text-espresso">{selectedRecipe.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-espresso/30 uppercase tracking-widest">Serves</p>
                      <p className="text-sm font-bold text-espresso">{selectedRecipe.serves}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                      <Flame size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-espresso/30 uppercase tracking-widest">Difficulty</p>
                      <p className="text-sm font-bold text-espresso">{selectedRecipe.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
