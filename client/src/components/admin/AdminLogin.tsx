import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setIsAdmin } from '../../redux/shop/shopSlice';
import { useForm } from 'react-hook-form';
import {
  AdminLoginSchema,
  type AdminLoginFormData,
} from '../../schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import InputFieldAuth from '../InputFieldAuth';
import axiosInstance from '../../configs/axiosConfig';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../types/apiResponse';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isAdmin } = useSelector((state: RootState) => state.shop);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminLoginSchema),
  });

  const onSubmitHandler = async (data: AdminLoginFormData) => {
    try {
      const response = await axiosInstance.post<ApiResponse>(
        '/api/admin/login',
        {
          email: data.email,
          password: data.password,
        }
      );

      const result = response.data;

      if (result.success) {
        dispatch(setIsAdmin(true));
        navigate('/admin');
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    !isAdmin && (
      <div className='fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center text-sm text-gray-600 text-[85%]'>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'
        >
          <h3 className='bold-28 mx-auto mb-3'>
            <span className='text-secondary capitalize'>Admin </span>
            <span className='capitalize'>Login</span>
          </h3>
          <InputFieldAuth
            name='email'
            label='Email'
            type='email'
            placeholder='Email'
            register={register}
            error={errors['email']}
          />
          <InputFieldAuth
            name='password'
            label='Password'
            type='password'
            placeholder='Password'
            register={register}
            error={errors['password']}
          />
          <button
            type='submit'
            className='btn-secondary w-full rounded !py-2.5 mt-3'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    )
  );
};
export default AdminLogin;
