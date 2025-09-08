import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { dummyBooks } from '../assets/data.ts';
import axiosInstance from '../configs/axiosConfig.ts';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;
  const [cartItems, setCartItems] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchBooks = () => {
    setBooks(dummyBooks);
  };

  // Ađing items to cart
  const addToCart = (itemId) => {
    const cartData = { ...cartItems };

    if (cartData) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
  };

  // Getting total cart Items
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      try {
        if (cartItems[itemId] > 0) {
          totalCount += cartItems[itemId];
        }
      } catch (error) {
        console.log(error);
      }
    }
    return totalCount;
  };

  // Update the quantity of item
  const updateQuantity = (itemId, quantity) => {
    const cartData = { ...cartItems };
    cartData[itemId] = quantity;
    setCartItems(cartData);
  };

  // Getting total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        let itemInfo = books.find((book) => book._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  const fetchAdmin = async () => {
    try {
      const { data } = await axiosInstance.get('/api/admin/is-auth');
      setIsAdmin(data.success);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const value = { books, navigate, user, setUser, currency, fetchAdmin };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
