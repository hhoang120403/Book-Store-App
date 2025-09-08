import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import Title from './Title';
import { TbShoppingBagPlus } from 'react-icons/tb';
import featuredBooksImg from '../assets/featured-books.png';
import { addToCart } from '../redux/shop/shopSlice';
import toast from 'react-hot-toast';

const FeaturedBooks = () => {
  const { books, currency, user } = useSelector(
    (state: RootState) => state.shop
  );
  const book = books[0];
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart(book._id));
    } else {
      toast.error('Please login before to add to cart');
    }
  };

  const para =
    'Browse featured books carefully selected for quality, imagination, storytelling, and unique characters';

  return (
    <section className='max-padd-container max-sm:bg-primary'>
      {/* Container */}
      <div className='sm:px-10 flex sm:bg-primary py-16 rounded-2xl'>
        {/* Left side */}
        <div className='flex-1'>
          <Title
            title1='Featured'
            title2='Books'
            titleStyles='pb-6'
            para={para}
          />

          {/* Book card */}
          <div className='flex gap-3 sm:gap-8 sm:bg-white sm:p-4 rounded-2xl'>
            <div className='min-w-[160px]'>
              <img
                src={book?.image[0]}
                alt={book?.name}
                className='h-64 w-44 object-cover rounded-xl shadow-[0px_0px_6px_0px_rgba(0,_0,_0,_0.1)]'
              />
            </div>
            <div className='flex flex-col justify-between flex-1'>
              <div className='space-y-1'>
                <h3 className='text-xl font-semibold text-gray-800 line-clamp-1'>
                  {book?.name}
                </h3>
                <p className='text-sm text-gray-500'>{book?.category}</p>
              </div>
              <div className='flex items-center gap-3 sm:mt-2'>
                <h4 className='text-lg font-bold text-secondary'>
                  {currency}
                  {book?.offerPrice.toFixed(2)}
                </h4>
                <p className='text-sm text-gray-400 line-through'>
                  {currency}
                  {book?.price.toFixed(2)}
                </p>
                <span className='hidden sm:flex bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full'>
                  Save 5
                </span>
              </div>
              <div className='grid grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-4 text-sm text-gray-700'>
                <p>
                  <span className='font-medium text-gray-700'>Published:</span>{' '}
                  2023
                </p>
                <p>
                  <span className='font-medium text-gray-700'>Pages:</span> 300
                </p>
                <p>
                  <span className='font-medium text-gray-700'>Language:</span>{' '}
                  English
                </p>
                <p>
                  <span className='font-medium text-gray-700'>Stock:</span> In
                  Stock
                </p>
              </div>
              <p className='mt-1 sm:mt-4 text-gray-600 text-sm line-clamp-3'>
                {book?.description}
              </p>
              <button
                className='btn-secondary max-sm:text-xs mt-1 sm:mt-5 w-fit px-5 py-2 flex items-center gap-2 text-sm font-medium'
                onClick={() => handleAddToCart()}
              >
                <TbShoppingBagPlus className='text-lg' />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right side */}
        {/* TODO: Click image right side then show infor left side */}
        <div
          className='hidden xl:flex flex-1 bg-center bg-cover bg-no-repeat'
          style={{
            backgroundImage: `url(${featuredBooksImg})`,
          }}
        ></div>
      </div>
    </section>
  );
};
export default FeaturedBooks;
