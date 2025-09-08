import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { type Book } from '../../types/Book.ts';
import axiosInstance from '../../configs/axiosConfig.ts';
import type { CartResponse, ProductResponse } from '../../types/apiResponse.ts';
import type { User } from '../../types/User.ts';
import toast from 'react-hot-toast';

interface ShopState {
  books: Book[];
  user: User | null;
  currency: string;
  searchQuery: string;
  cartItems: Record<string, number>;
  method: 'COD' | 'Stripe';
  delivery_charges: number;
  showUserLogin: boolean;
  isAdmin: boolean;
}

const initialState: ShopState = {
  books: [],
  user: null,
  currency: import.meta.env.VITE_CURRENCY ?? '$',
  searchQuery: '',
  cartItems: {},
  method: 'COD',
  delivery_charges: 10,
  showUserLogin: false,
  isAdmin: false,
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setCartItems: (state, action: PayloadAction<Record<string, number>>) => {
      state.cartItems = action.payload;
    },
    setShowUserLogin: (state, action: PayloadAction<boolean>) => {
      state.showUserLogin = action.payload;
    },
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = {};
      if (state.user) {
        state.user.cartData = {};
      }
    },
    setMethod: (state, action: PayloadAction<'COD' | 'Stripe'>) => {
      state.method = action.payload;
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.cartItems = {};
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.isAdmin = action.payload;
      })
      .addCase(fetchAdmin.rejected, (state) => {
        state.isAdmin = false;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload ?? [];
      })
      .addCase(fetchBooks.rejected, (state) => {
        state.books = [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.cartData = action.payload;
          toast.success('Add to cart successfully');
        }
      })
      .addCase(addToCart.rejected, (_, action) => {
        toast.error(String(action.payload));
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.cartData = action.payload;
        }
      })
      .addCase(updateQuantity.rejected, (_, action) => {
        if (action.payload) {
          toast.error(action.payload);
        }
      });
  },
});

export const selectCartCount = (state: { shop: ShopState }) =>
  Object.values(state.shop.user?.cartData ?? {}).reduce(
    (sum, qty) => sum + qty,
    0
  );

export const selectCartAmount = (state: { shop: ShopState }) => {
  return Object.entries(state.shop.user?.cartData ?? {}).reduce(
    (total, [itemId, qty]) => {
      const itemInfo = state.shop.books.find((book) => book._id === itemId);
      if (itemInfo) {
        total += itemInfo.offerPrice * qty;
      }
      return total;
    },
    0
  );
};

export const fetchAdmin = createAsyncThunk(
  'admin/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/admin/is-auth');
      if (data.success && data.user) {
        return data.user;
      }
      return rejectWithValue('User not authorized');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to check admin'
      );
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/api/user/is-auth');

      if (data.success && data.user) {
        return data.user;
      }

      return rejectWithValue('User not authenticated');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to check user'
      );
    }
  }
);

export const fetchBooks = createAsyncThunk(
  'admin/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ProductResponse>(
        '/api/product/list'
      );
      return data.products;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<CartResponse>('/api/cart/add', {
        itemId,
      });
      if (data.success) {
        return data.cartData;
      }
      return rejectWithValue('Failed to add to cart');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

export const updateQuantity = createAsyncThunk<
  CartResponse['cartData'],
  { itemId: string; quantity: number },
  { rejectValue: string }
>('cart/updateQuantity', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<CartResponse>(
      '/api/cart/update',
      { itemId, quantity }
    );

    if (data.success) {
      return data.cartData;
    }

    return rejectWithValue('Unable to update quantity');
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Server error');
  }
});

export const {
  setUser,
  setBooks,
  setSearchQuery,
  clearCart,
  setMethod,
  setShowUserLogin,
  setIsAdmin,
} = shopSlice.actions;
export default shopSlice.reducer;
