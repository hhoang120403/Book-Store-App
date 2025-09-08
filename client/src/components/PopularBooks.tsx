import Item from './Item.tsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { type Book } from '../types/Book.ts';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store.ts';
import Title from './Title.tsx';

const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const { books } = useSelector((state: RootState) => state.shop);

  const para =
    'Explore our top-selling books loved for their powerful stories, creative writing, and lasting impact.';

  useEffect(() => {
    const data = books.filter((item) => item.popular);
    setPopularBooks(data.slice(0, 12));
  }, [books]);

  return (
    <section className='max-padd-container py-16'>
      <Title
        title1='Popular'
        title2='Products'
        titleStyles='pb-6'
        para={para}
      />

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
          {popularBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <Item book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      }
    </section>
  );
};
export default PopularBooks;
