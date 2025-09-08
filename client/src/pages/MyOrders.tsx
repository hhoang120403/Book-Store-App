import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import Title from '../components/Title';
import { useEffect, useState } from 'react';
import type { Order } from '../types/Order';
import axiosInstance from '../configs/axiosConfig';
import type { OrdersResponse } from '../types/apiResponse';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { currency, user } = useSelector((state: RootState) => state.shop);
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrderData = async () => {
    if (!user) return;
    try {
      const { data } = await axiosInstance.get<OrdersResponse>(
        '/api/order/user-orders'
      );
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [user]);

  return (
    <div className='max-padd-container py-16 pt-28'>
      <Title title1='My Orders' title2='List' titleStyles='pb-10' />
      {orders.map((order) => (
        <div key={order._id} className='bg-primary p-2 mt-3 rounded-lg'>
          {/* Book List */}
          <div className='flex flex-col lg:flex-row gap-4 mb-3'>
            {order.items.map((item, index) => (
              <div key={index} className='flex gap-x-3'>
                <div className='flexCenter rounded-lg overflow-hidden'>
                  <img
                    src={item.product.image[0]}
                    alt='Order Image'
                    className='max-h-20 max-w-32 aspect-square object-contain'
                  />
                </div>
                <div className='w-full block'>
                  <h5 className='h5 capitalize line-clamp-1'>
                    {item.product.name}
                  </h5>
                  <div className='flex flex-wrap gap-3 max-sm:gap-y-1 mt-1'>
                    <div className='flex items-center gap-x-2'>
                      <h5 className='medium-14'>Price: </h5>
                      <p>
                        {currency}
                        {item.product.offerPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className='flex items-center gap-x-2'>
                      <h5 className='medium-14'>Quantity: </h5>
                      <p>{item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-t border-gray-300 pt-3'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Order Id:</h5>
                <p className='text-gray-400 text-xs break-all'>{order._id}</p>
              </div>
              <div className='flex gap-4'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='medium-14'>Payment Status: </h5>
                  <p>{order.isPaid ? 'Done' : 'Pending'}</p>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='medium-14'>Method: </h5>
                    <p className='text-gray-400 text-xm'>
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='medium-14'>Date: </h5>
                  <p className='text-gray-400 text-xm'>
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
                <div className='flex items-center gap-x-2'>
                  <h5 className='medium-14'>Amount: </h5>
                  <p className='text-gray-400 text-xm'>
                    {currency}
                    {order.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex gap-3'>
              <div className='flex items-center gap-x-2'>
                <h5 className='medium-14'>Status: </h5>
                <div className='flex items-center gap-1'>
                  <span className='min-w-2 h-2 rounded-full bg-green-500' />
                  <p>{order.status}</p>
                </div>
              </div>
              <button
                onClick={loadOrderData}
                className='btn-secondary !py-1 !text-xs rounded-sm'
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default MyOrders;
