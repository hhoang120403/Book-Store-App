import { useSelector } from 'react-redux';
import Title from '../components/Title';
import type { RootState } from '../redux/store';
import Item from '../components/Item';
import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useParams } from 'react-router';

const CategoryShop = () => {
  const { books, searchQuery } = useSelector((state: RootState) => state.shop);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { category } = useParams();

  useEffect(() => {
    let result = books;

    if (category) {
      result = result.filter(
        (book) => book.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchQuery.trim().length > 0) {
      result = result.filter((book) =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(result);

    setCurrentPage(1);
  }, [searchQuery, books]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(
    filteredBooks.filter((book) => book.inStock).length / itemsPerPage
  );

  return (
    <>
      <div className='max-padd-container py-16 pt-28'>
        <Title title1={`${category}`} title2='Books' titleStyles='pb-6' />
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-8'>
          {filteredBooks.length > 0 ? (
            filteredBooks
              .filter((book) => book.inStock)
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((book) => <Item key={book._id} book={book} />)
          ) : (
            <h4 className='h4'>Oops! Nothing matched your search</h4>
          )}
        </div>

        {/* Pagination */}
        <div className='flexCenter flex-wrap gap-2 sm:gap-4 mt-14 mb-10'>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`${
              currentPage === 1 && 'opacity-50 cursor-not-allowed'
            } btn-dark !py-1 !px-3`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`${
                currentPage === index + 1 && 'bg-secondary !text-white'
              } btn-light !py-1 !px-3`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`${
              currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            } btn-white bg-tertiary !py-1 !px-3`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
export default CategoryShop;
