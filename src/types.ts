export interface Product {
  id: string | number;
  name: string;
  hindiName: string;
  price: number;
  weight: string;
  rating: number;
  color: string;
  tag?: string;
  image?: string;
  ingredients: string[];
  benefits: string[];
  reviews: { user: string; comment: string; rating: number }[];
}
