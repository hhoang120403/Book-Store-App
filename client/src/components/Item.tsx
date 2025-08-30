import { useSelector } from 'react-redux';
import type { Book } from '../lib/types.ts';
import type { RootState } from '../redux/store.ts';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router';

interface ItemProps {
  book: Book;
  fromHero?: boolean;
}

const Item = ({ book, fromHero }: ItemProps) => {
  const { currency } = useSelector((state: RootState) => state.shop);
  const navigate = useNavigate();

  return book ? (
    <div
      onClick={() => {
        navigate(`/shop/${book.category}/${book._id}`);
      }}
      className={`overflow-hidden sm:p-4 ${
        fromHero ? 'bg-white' : 'sm:bg-primary'
      } rounded-xl cursor-pointer`}
    >
      {/* Image */}
      <div className='overflow-hidden rounded-xl shadow-[0px_0px_2px_0px_rgba(0,_0,_0,_0.1)]'>
        <img src={book.image[0]} alt={book.name} className='rounded-lg' />
      </div>
      {/* Info */}
      <div className='pt-4'>
        <div className='flexBetween gap-2'>
          <h4 className='h5 line-clamp-1'>{book.name}</h4>
          <p className='text-secondary bold-15'>
            {currency}
            {book.offerPrice.toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between items-start gap-2 mt-1'>
          <p className='line-clamp-1'>{book.description}</p>
          <button className='cursor-pointer'>
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
