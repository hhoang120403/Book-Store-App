import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import type { Book } from '../types/Book.ts';
import Title from './Title';
import Item from './Item.tsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const { books } = useSelector((state: RootState) => state.shop);

  const para =
    'Check out our newest books arriving weekly with fresh ideas, exciting plots, and vibrant voices';

  useEffect(() => {
    setNewArrivals(books.slice(0, 6));
  }, [books]);

  return (
    <section className='max-padd-container py-16'>
      <Title title1='New' title2='Arrivals' titleStyles='pb-6' para={para} />

      {/* Container */}
      {
        <Swiper
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            355: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            600: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            900: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className='min-h-[333px]'
        >
          {newArrivals.map((book) => (
            <SwiperSlide key={book._id}>
              <Item book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      }
    </section>
  );
};
export default NewArrivals;
