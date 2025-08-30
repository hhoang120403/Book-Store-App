import { useDispatch } from 'react-redux';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import type { AppDispatch } from '../redux/store';
import { useEffect } from 'react';
import { setBooks } from '../redux/shop/shopSlice';
import { dummyBooks } from '../assets/data';
import NewArrivals from '../components/NewArrivals';
import FeaturedBooks from '../components/FeaturedBooks';
import PopularBooks from '../components/PopularBooks';
import NewLetter from '../components/NewsLetter';
import Achievement from '../components/Achievement';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setBooks(dummyBooks));
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <Categories />
      <NewArrivals />
      <FeaturedBooks />
      <PopularBooks />
      <Achievement />
      <NewLetter />
    </div>
  );
};
export default Home;
