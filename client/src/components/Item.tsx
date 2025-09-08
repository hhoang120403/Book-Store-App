import { useDispatch, useSelector } from 'react-redux';
import type { Book } from '../types/Book.ts';
import type { AppDispatch, RootState } from '../redux/store.ts';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { addToCart } from '../redux/shop/shopSlice.ts';
import toast from 'react-hot-toast';

interface ItemProps {
  book: Book;
  fromHero?: boolean;
}

const Item = ({ book, fromHero }: ItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currency, user } = useSelector((state: RootState) => state.shop);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart(book._id));
    } else {
      toast.error('Please login before to add to cart');
    }
  };

  return book ? (
    <div
      className={`overflow-hidden sm:p-4 ${
        fromHero ? 'bg-white' : 'sm:bg-primary'
      } rounded-xl cursor-pointer`}
    >
      {/* Image */}
      <div
        className='overflow-hidden rounded-xl shadow-[0px_0px_2px_0px_rgba(0,_0,_0,_0.1)]'
        onClick={() => {
          navigate(`/shop/${book.category}/${book._id}`);
          scrollTo(0, 0);
        }}
      >
        <img src={book.image[0]} alt={book.name} className='rounded-lg' />
      </div>
      {/* Info */}
      <div className='pt-4'>
        <div
          className='flexBetween gap-2'
          onClick={() => {
            navigate(`/shop/${book.category}/${book._id}`);
            scrollTo(0, 0);
          }}
        >
          <h4 className='h5 line-clamp-1'>{book.name}</h4>
          <p className='text-secondary bold-15'>
            {currency}
            {book.offerPrice.toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between items-start gap-2 mt-1'>
          <p className='line-clamp-1'>{book.description}</p>
          <button className='cursor-pointer' onClick={() => handleAddToCart()}>
            <TbShoppingBagPlus className='text-xl' />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='p-5 text-red-600 text-sm rounded-md'>No book found.</div>
  );
};
export default Item;
