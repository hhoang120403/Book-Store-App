import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import type { AppDispatch } from '../redux/store';
import { fetchUser, setShowUserLogin } from '../redux/shop/shopSlice';
import InputFieldAuth from './InputFieldAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, type AuthFormData } from '../schemas/authSchema';
import axiosInstance from '../configs/axiosConfig';
import type { AuthResponse } from '../types/apiResponse';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLogin, setIsLogin] = useState(true);

  const schema = AuthSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        const res = await axiosInstance.post<AuthResponse>('/api/user/login', {
          name: data.name,
          email: data.email,
          password: data.password,
        });

        if (res.data.success) {
          toast.success('Login successfully');
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await axiosInstance.post<AuthResponse>(
          '/api/user/register',
          {
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }
        );

        if (res.data.success) {
          toast.success('Login successfully');
        } else {
          toast.error(res.data.message);
        }
      }

      dispatch(fetchUser());
      dispatch(setShowUserLogin(false));
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => dispatch(setShowUserLogin(false))}
      className='fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center text-sm text-gray-600 bg-black/50'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className='flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white'
      >
        <h3 className='bold-28 mx-auto mb-3'>
          <span className='text-secondary capitalize'>User </span>
          <span className='capitalize'>{isLogin ? 'Login' : 'Register'}</span>
        </h3>

        {!isLogin && (
          <InputFieldAuth
            name='name'
            label='Name'
            placeholder='Name'
            register={register}
            error={errors['name']}
          />
        )}

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

        {!isLogin && (
          <InputFieldAuth
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='Confirm Password'
            register={register}
            error={errors['confirmPassword']}
          />
        )}

        {isLogin ? (
          <p>
            Create an account?{' '}
            <span
              className='text-secondary cursor-pointer'
              onClick={() => {
                setIsLogin(false);
                reset();
              }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span
              className='text-secondary cursor-pointer'
              onClick={() => {
                setIsLogin(true);
                reset();
              }}
            >
              Click here
            </span>
          </p>
        )}

        <button type='submit' className='btn-secondary w-full rounded !py-2.5'>
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Login;
