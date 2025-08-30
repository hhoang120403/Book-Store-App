import { useEffect, useState } from 'react';
import type { Book } from '../lib/types';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import Item from './Item.tsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Title from './Title';

interface RelatedBooksProps {
  book: Book;
  id: string;
}

const RelatedBooks = ({ book, id }: RelatedBooksProps) => {
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const { books } = useSelector((state: RootState) => state.shop);

  useEffect(() => {
    if (books.length > 0) {
      let filteredBooks = books.slice();
      filteredBooks = filteredBooks.filter(
        (item) => item.category === book.category && item._id !== id
      );
      setRelatedBooks(filteredBooks.slice(0, 6));
    }
  }, [books]);

  return (
    <section className='max-padd-container py-16'>
      <Title title1='Related' title2='Books' titleStyles='pb-6' />

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
          {relatedBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <Item book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      }
    </section>
  );
};
export default RelatedBooks;
