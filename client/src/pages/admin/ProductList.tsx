import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import axiosInstance from '../../configs/axiosConfig';
import type { ApiResponse } from '../../types/apiResponse';
import { fetchBooks } from '../../redux/shop/shopSlice';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const ProductList = () => {
  const { books, currency } = useSelector((state: RootState) => state.shop);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const toggleStock = async (productId: string, inStock: boolean) => {
    try {
      const { data } = await axiosInstance.post<ApiResponse>(
        '/api/product/stock',
        {
          productId,
          inStock,
        }
      );

      if (data.success) {
        dispatch(fetchBooks());
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_3.5fr_1fr_1fr_1fr] items-center py-1 px-2 gap-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>InStock</h5>
        </div>
        {/* Product List */}
        {books.map((book) => (
          <div
            key={book._id}
            className='grid grid-cols-[1fr_3.5fr_1fr_1fr_1fr] items-center gap-2 p-2 bg-white rounded-lg'
          >
            <img
              src={book.image[0]}
              alt={book.name}
              className='w-12 bg-primary rounded'
            />
            <h5 className='text-sm font-semibold'>{book.name}</h5>
            <p className='text-sm font-semibold'>{book.category}</p>
            <div className='text-sm font-semibold'>
              {currency}
              {book.offerPrice.toFixed(2)}
            </div>
            <div>
              <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                <input
                  type='checkbox'
                  className='sr-only peer'
                  defaultChecked={book.inStock}
                  onClick={() => toggleStock(book._id, !book.inStock)}
                />
                <div className='w-10 h-6 bg-slate-300 rounded-full peer peer-checked:bg-secondary transition-colors duration-200'></div>
                <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
