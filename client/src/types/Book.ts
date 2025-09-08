export interface Book {
  _id: string;
  name: string;
  image: string[];
  offerPrice: number;
  price: number;
  description: string;
  category: string;
  date: number;
  popular: boolean;
  inStock: boolean;
}
