import type { AddressFormData } from '../schemas/addressSchema';
import type { Book } from './Book';
import type { Order } from './Order';

export interface ApiResponse<> {
  success: boolean;
  message: string;
}

export type ProductResponse = ApiResponse & {
  products: Book[];
};

export type AuthResponse = ApiResponse & {
  user: {
    email: string;
    password: string;
  };
};

export type CartResponse = ApiResponse & {
  cartData: Record<string, number>;
};

export type AddressResponse = ApiResponse & {
  addresses: AddressFormData[];
};

export type OrdersResponse = ApiResponse & {
  orders: Order[];
};

export type CheckoutStripeResponse = ApiResponse & {
  url: string;
};
