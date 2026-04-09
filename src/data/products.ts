import { Product } from "../types";

export const products: Product[] = [
  {
    id: 1,
    name: "Garam Masala",
    hindiName: "Authentic Blend",
    price: 249,
    weight: "200g",
    rating: 4.9,
    color: "bg-burgundy/10",
    tag: "Best Seller",
    ingredients: ["Cinnamon", "Cardamom", "Cloves", "Black Pepper", "Nutmeg"],
    benefits: ["Boosts metabolism", "Rich in antioxidants", "Improves digestion", "Reduces inflammation"],
    reviews: [
      { user: "Priya S.", comment: "The aroma is incredible!", rating: 5 },
      { user: "Rahul M.", comment: "Best garam masala I've used.", rating: 5 }
    ]
  },
  {
    id: 2,
    name: "Chaat Masala",
    hindiName: "Tangy Seasoning",
    price: 189,
    weight: "200g",
    rating: 4.8,
    color: "bg-turmeric/10",
    tag: "Trending",
    ingredients: ["Dried Mango Powder", "Black Salt", "Cumin", "Coriander", "Chili"],
    benefits: ["Aids digestion", "Rich in Vitamin C", "Natural cooling effect", "Improves appetite"],
    reviews: [
      { user: "Anjali K.", comment: "Perfectly tangy!", rating: 4 },
      { user: "Vikram R.", comment: "Makes every snack better.", rating: 5 }
    ]
  },
  {
    id: 3,
    name: "Biryani Masala",
    hindiName: "Royal Spice Mix",
    price: 299,
    weight: "200g",
    rating: 5.0,
    color: "bg-saffron/10",
    tag: "New",
    ingredients: ["Star Anise", "Mace", "Saffron", "Shahi Jeera", "Bay Leaf"],
    benefits: ["Enhances flavor", "Aromatic experience", "Natural digestive", "Rich in minerals"],
    reviews: [
      { user: "Suresh G.", comment: "Restaurant style biryani at home.", rating: 5 },
      { user: "Meera P.", comment: "Simply royal taste.", rating: 5 }
    ]
  },
  {
    id: 4,
    name: "Rajma Masala",
    hindiName: "Kidney Bean Mix",
    price: 199,
    weight: "200g",
    rating: 4.7,
    color: "bg-espresso/10",
    ingredients: ["Cumin", "Ginger", "Garlic", "Onion Powder", "Tomato Powder"],
    benefits: ["High protein support", "Rich in iron", "Improves heart health", "Natural energy boost"],
    reviews: [
      { user: "Amit B.", comment: "Authentic taste.", rating: 4 },
      { user: "Sneha L.", comment: "My family loves it.", rating: 5 }
    ]
  },
  {
    id: 5,
    name: "Turmeric Powder",
    hindiName: "Golden Powder",
    price: 149,
    weight: "200g",
    rating: 4.9,
    color: "bg-yellow-500/10",
    tag: "Pure",
    ingredients: ["100% Pure Turmeric Root"],
    benefits: ["Anti-inflammatory", "Immunity booster", "Natural detoxifier", "Skin health"],
    reviews: [
      { user: "Kavita D.", comment: "Pure and vibrant color.", rating: 5 },
      { user: "Rajesh V.", comment: "High quality turmeric.", rating: 5 }
    ]
  },
  {
    id: 6,
    name: "Red Chili Powder",
    hindiName: "Spicy Red Chili",
    price: 179,
    weight: "200g",
    rating: 4.8,
    color: "bg-red-500/10",
    ingredients: ["Sun-dried Red Chilies"],
    benefits: ["Pain relief", "Heart health", "Weight management", "Rich in Vitamin A"],
    reviews: [
      { user: "Neha T.", comment: "Just the right amount of heat.", rating: 5 },
      { user: "Arjun S.", comment: "Very fresh and spicy.", rating: 4 }
    ]
  },
];
