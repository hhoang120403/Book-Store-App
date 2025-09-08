import type { Book } from './Book';

interface OrderItem {
  product: Book;
  quantity: number;
}

interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  amount: number;
  paymentMethod: string;
  isPaid: boolean;
  status: string;
  createdAt: string;
}
