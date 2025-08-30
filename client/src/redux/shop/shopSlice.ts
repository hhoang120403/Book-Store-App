import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Book } from '../../lib/types.ts';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface ShopState {
  books: Book[];
  user: User | null;
  currency: string;
  searchQuery: string;
}

const initialState: ShopState = {
  books: [],
  user: null,
  currency: import.meta.env.VITE_CURRENCY ?? '$',
  searchQuery: '',
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setBooks, setUser, setSearchQuery } = shopSlice.actions;
export default shopSlice.reducer;
