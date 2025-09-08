import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router';
import {
  clearCart,
  selectCartAmount,
  selectCartCount,
  setMethod,
} from '../redux/shop/shopSlice';
import { useEffect, useState } from 'react';
import type { AddressFormData } from '../schemas/addressSchema';
import axiosInstance from '../configs/axiosConfig';
import type {
  AddressResponse,
  ApiResponse,
  CheckoutStripeResponse,
} from '../types/apiResponse';
import toast from 'react-hot-toast';

const CartTotal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { books, currency, delivery_charges, method, user } = useSelector(
    (state: RootState) => state.shop
  );
  const {} = useSelector;
  const getCartCount = useSelector(selectCartCount);
  const getCartAmount = useSelector(selectCartAmount);

  const [addresses, setAddresses] = useState<AddressFormData[]>([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddres] = useState<AddressFormData | null>(
    null
  );
  const tax = 2;

  const getAddress = async () => {
    try {
      const { data } = await axiosInstance.get<AddressResponse>(
        '/api/address/get'
      );

      console.log(data);

      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddres(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error('Please select an address');
      }
      let orderItems = [];
      for (const itemId in user?.cartData) {
        const book = books.find((item) => item._id === itemId);
        if (book) {
          orderItems.push({ ...book, quantity: user.cartData[itemId] });
        }
      }

      if (orderItems.length === 0) {
        toast.error('Please add product to cart before checkout');
        return;
      }

      let items = orderItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      if (method === 'COD') {
        const { data } = await axiosInstance.post<ApiResponse>(
          '/api/order/cod',
          {
            items,
            address: selectedAddress,
          }
        );

        if (data.success) {
          toast.success(data.message);
          dispatch(clearCart());
          navigate('/my-orders');
        } else {
          toast.error(data.message);
        }
      } else if (method === 'Stripe') {
        const { data } = await axiosInstance.post<CheckoutStripeResponse>(
          '/api/order/stripe',
          {
            items,
            address: selectedAddress,
          }
        );

        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  const calculateTotalPrice = () => {
    let total = 0;
    if (getCartAmount > 0) {
      return (
        getCartAmount +
        Number(delivery_charges.toFixed(2)) +
        Number(((getCartAmount * 2) / 100).toFixed(2))
      );
    }
    return total;
  };

  return (
    <div>
      <h3 className='bold-22'>
        Order Details{' '}
        <span className='bold-15 text-secondary'>({getCartCount} Items)</span>
      </h3>
      <hr className='border-gray-300 my-5' />
      {/* Payment & Address */}
      <div className='mb-5'>
        <div my-5>
          <h4 className='h4 mb-5'>Where to ship your order?</h4>
          <div className='relative flex justify-between items-start mt-2'>
            <p>
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : 'No address found'}
            </p>
            <button
              className='text-secondary medium-14 hover:underline cursor-pointer'
              onClick={() => setShowAddress(!showAddress)}
            >
              Change
            </button>
            {showAddress && (
              <div className='absolute top-10 py-1 bg-white ring-1 ring-slate-900/10 text-sm w-full'>
                {addresses.map((address, index) => (
                  <p
                    key={index}
                    className='p-2 cursor-pointer hover:bg-gray-100 medium-14'
                    onClick={() => {
                      setSelectedAddres(address);
                      setShowAddress(false);
                    }}
                  >
                    {address.street}, {address.city}, {address.state},{' '}
                    {address.country}
                  </p>
                ))}
                <p
                  className='p-2 text-center cursor-pointer hover:bg-tertiary text-gray-600 font-bold'
                  onClick={() => navigate('/address-form')}
                >
                  Add Address
                </p>
              </div>
            )}
          </div>
        </div>
        <hr className='border-gray-300 my-5' />
        <div className='my-6'>
          <h4 className='h4 mb-5'>Payment Method?</h4>
          <div className='flex gap-3'>
            <div
              className={`${
                method === 'COD' ? 'btn-secondary' : 'btn-white'
              } !py-1 text-xs cursor-pointer`}
              onClick={() => dispatch(setMethod('COD'))}
            >
              Cash on Delivery
            </div>
            <div
              className={`${
                method === 'Stripe' ? 'btn-secondary' : 'btn-white'
              } !py-1 text-xs cursor-pointer`}
              onClick={() => dispatch(setMethod('Stripe'))}
            >
              Stripe
            </div>
          </div>
        </div>
        <hr className='border-gray-300 my-5' />
      </div>

      <div className='mt-4 space-y-2'>
        <div className='flex justify-between'>
          <h5 className='h5'>Price</h5>
          <p className='font-bold'>
            {currency}
            {getCartAmount.toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between'>
          <h5 className='h5'>Shipping Fee</h5>
          <p className='font-bold'>
            {currency}
            {getCartAmount > 0 ? `${delivery_charges.toFixed(2)}` : '0.00'}
          </p>
        </div>
        <div className='flex justify-between'>
          <h5 className='h5'>Tax ({tax}%)</h5>
          <p className='font-bold'>
            {currency}
            {((getCartAmount * 2) / 100).toFixed(2)}
          </p>
        </div>
        <div className='flex justify-between text-lg font-medium mt-3'>
          <h4 className='h4'>Total Amount:</h4>
          <p className='bold-18'>
            {currency}
            {calculateTotalPrice().toFixed(2)}
          </p>
        </div>
      </div>
      <button onClick={placeOrder} className='btn-dark w-full mt-8 !rounded-md'>
        Proceed to Order
      </button>
    </div>
  );
};
export default CartTotal;
