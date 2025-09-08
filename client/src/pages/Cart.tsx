import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import Title from '../components/Title';
import { updateQuantity } from '../redux/shop/shopSlice';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, currency, user } = useSelector(
    (state: RootState) => state.shop
  );

  const handleUpdateQuantity = ({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }) => {
    dispatch(updateQuantity({ itemId: id, quantity: quantity }));
  };

  return books && user?.cartData ? (
    <div className='max-padd-container py-16 pt-28'>
      <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
        {/* Left side */}
        <div className='flex flex-[2] flex-col gap-3'>
          <Title title1='Cart' title2='Overview' titleStyles='pb-5' />
          <div className='grid grid-cols-[6fr_1fr_2fr] text-base font-medium bg-primary p-2 rounded-lg'>
            <h5 className='h5 text-left'>Product Details</h5>
            <h5 className='h5 text-center'>Subtotal</h5>
            <h5 className='h5 text-center'>Action</h5>
          </div>
          {books.map((book) => {
            const quantity = user.cartData[book._id];
            if (quantity > 0) {
              return (
                <div
                  key={book._id}
                  className='grid grid-cols-[6fr_1fr_2fr] items-center bg-primary p-2 rounded-lg'
                >
                  <div className='flex items-center gap-3 md:gap-6'>
                    <div className='flex bg-primary'>
                      <img
                        src={book.image[0]}
                        alt='Book Image'
                        className='w-12 rounded-lg'
                      />
                    </div>
                    <div>
                      <h5 className='h5 hidden sm:block line-clamp-1'>
                        {book.name}
                      </h5>
                      <div className='flexBetween mt-2'>
                        <div className='flex gap-1.5 items-center ring-1 ring-slate-900/5 p-0.5 rounded-full overflow-hidden bg-white'>
                          <button
                            className='p-1.5 bg-primary rounded-full cursor-pointer'
                            onClick={() =>
                              handleUpdateQuantity({
                                id: book._id,
                                quantity: quantity - 1,
                              })
                            }
                          >
                            <FaMinus className='text-xs' />
                          </button>
                          <p>{quantity}</p>
                          <button
                            className='p-1.5 bg-primary rounded-full cursor-pointer'
                            onClick={() =>
                              handleUpdateQuantity({
                                id: book._id,
                                quantity: quantity + 1,
                              })
                            }
                          >
                            <FaPlus className='text-xs' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className='text-center'>
                    {currency}
                    {(book.offerPrice * quantity).toFixed(2)}
                  </p>
                  <button
                    className='cursor-pointer mx-auto bold-14 text-secondary'
                    onClick={() =>
                      handleUpdateQuantity({
                        id: book._id,
                        quantity: 0,
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Right side */}
        <div className='flex flex-1 flex-col'>
          <div className='max-w-[379px] w-full bg-primary p-5 py-10 max-md:mt-16 rounded-xl'>
            <CartTotal />
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
export default Cart;
