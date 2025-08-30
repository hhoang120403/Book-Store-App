import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import {
  TbHeart,
  TbShoppingBagPlus,
  TbStarFilled,
  TbStarHalfFilled,
} from 'react-icons/tb';
import { FaTruckFast } from 'react-icons/fa6';
import ProductDescription from '../components/ProductDescription';
import ProductFeatures from '../components/ProductFeatures';
import RelatedBooks from '../components/RelatedBooks';

const ProductDetails = () => {
  const { books, currency } = useSelector((state: RootState) => state.shop);
  const { id } = useParams();

  const book = books.find((book) => book._id === id);

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (book) {
      setImage(book.image[0]);
    }
  }, [book]);

  return (
    book && (
      <div className='max-padd-container py-16 pt-28'>
        <p>
          <Link to='/'>Home</Link> / <Link to='/shop'>Shop</Link> /{' '}
          <Link to={`/shop/${book.category}`}>{book.category}</Link> /{' '}
          <span className='medium-14 text-black'>{book.name}</span>
        </p>
        {/* Book data */}
        {/* TODO: RESPONSIVE */}
        <div className='flex flex-col gap-10 lg:flex-row my-6'>
          {/* Image */}
          <div className='flex gap-x-2 max-w-[433px]'>
            <div className='flex-1 flexCenter flex-col gap-[7px] flex-wrap'>
              {book.image.map((item, index) => (
                <div key={index}>
                  <img
                    src={item}
                    alt='Book image'
                    className='rounded-lg overflow-hidden'
                  />
                </div>
              ))}
            </div>
            <div className='flex flex-[4]'>
              <img
                src={image ?? ''}
                alt='Book Image'
                className='rounded-lg overflow-hidden'
              />
            </div>
          </div>

          {/* Info */}
          <div className='px-5 py-3 w-full bg-primary rounded-xl pt-8'>
            <h3 className='h3 leading-none'>{book.name}</h3>
            <div className='flex items-center gap-x-2 pt-2'>
              {/* TODO: Rating */}
              <div className='flex gap-x-2 text-yellow-400'>
                <TbStarFilled />
                <TbStarFilled />
                <TbStarFilled />
                <TbStarFilled />
                <TbStarHalfFilled />
              </div>
              <p className='medium-12'>(22)</p>
            </div>
            <div className='h4 flex items-baseline gap-4 my-2'>
              <h3 className='h3 line-through text-secondary'>
                {currency}
                {book.price.toFixed(2)}
              </h3>
              <h4 className='h4'>
                {currency}
                {book.offerPrice.toFixed(2)}
              </h4>
            </div>
            <p className='max-w-[555px]'>{book.description}</p>
            <div className='flex items-center gap-x-4 mt-6'>
              <button className='btn-dark sm:w-1/2 flexCenter gap-x-2 capitalize !rounded-md'>
                Add to Cart <TbShoppingBagPlus />
              </button>
              <button className='btn-secondary !rounded-md'>
                <TbHeart className='text-xl' />
              </button>
            </div>
            <div className='flex items-center gap-x-2 mt-3'>
              <FaTruckFast className='text-lg' />
              <span className='medium-14'>
                Free Delivery on orders over 100$
              </span>
            </div>
            <hr className='my-3 w-2/3' />
            <div className='mt-2 flex flex-col gap-1 text-gray-50 text-[14px]'>
              <p>Authenticy You Can Trust</p>
              <p>Enjoy Cash on Delivery for Your Convenience</p>
              <p>Easy Returns and Exchanges Within 7 Days</p>
            </div>
          </div>
        </div>
        <ProductDescription />
        <ProductFeatures />
        <RelatedBooks book={book} id={id ?? ''} />
      </div>
    )
  );
};
export default ProductDetails;
