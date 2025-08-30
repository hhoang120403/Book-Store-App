import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { dummyBooks } from '../assets/data.ts';

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;

  const fetchBooks = () => {
    setBooks(dummyBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const value = { books, navigate, user, setUser, currency };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
