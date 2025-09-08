import Categories from '../components/Categories';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';
import FeaturedBooks from '../components/FeaturedBooks';
import PopularBooks from '../components/PopularBooks';
import NewLetter from '../components/NewsLetter';
import Achievement from '../components/Achievement';

const Home = () => {
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
