import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { addressSchema, type AddressFormData } from '../schemas/addressSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import CartTotal from '../components/CartTotal';
import InputField from '../components/InputField';
import Title from '../components/Title';
import axiosInstance from '../configs/axiosConfig';
import type { ApiResponse } from '../types/apiResponse';
import toast from 'react-hot-toast';

const AddressForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      const res = await axiosInstance.post<ApiResponse>('/api/address/add', {
        address: data,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/cart');
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='max-padd-container py-16 pt-28'>
      <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
        {/* Left side */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-[2] flex-col gap-3 text-[95%]'
        >
          <Title title1='Delivery' title2='Information' titleStyles='pb-5' />

          <div className='flex gap-3'>
            <InputField
              name='firstName'
              placeholder='First Name'
              register={register}
              error={errors.firstName}
              className='w-1/2'
            />
            <InputField
              name='lastName'
              placeholder='Last Name'
              register={register}
              error={errors.lastName}
              className='w-1/2'
            />
          </div>

          <InputField
            name='email'
            placeholder='Email'
            type='email'
            register={register}
            error={errors.email}
          />

          <InputField
            name='phone'
            placeholder='Phone Number'
            type='tel'
            register={register}
            error={errors.phone}
          />

          <InputField
            name='street'
            placeholder='Street'
            register={register}
            error={errors.street}
          />

          <div className='flex gap-3'>
            <InputField
              name='city'
              placeholder='City'
              register={register}
              error={errors.city}
              className='w-1/2'
            />
            <InputField
              name='state'
              placeholder='State'
              register={register}
              error={errors.state}
              className='w-1/2'
            />
          </div>

          <div className='flex gap-3'>
            <InputField
              name='zipcode'
              placeholder='Zip Code'
              register={register}
              error={errors.zipcode}
              className='w-1/2'
            />
            <InputField
              name='country'
              placeholder='Country'
              register={register}
              error={errors.country}
              className='w-1/2'
            />
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              className='btn-dark rounded-md w-1/2 mt-2'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Address...' : 'Add Address'}
            </button>
          </div>
        </form>

        {/* Right Side */}
        <div className='flex flex-1 flex-col'>
          <div className='max-w-[379px] w-full bg-primary p-5 py-10 max-md:mt-16 rounded-xl'>
            <CartTotal />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddressForm;
