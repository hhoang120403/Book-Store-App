import type { FieldError, UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}

const InputFieldAuth = ({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
}: InputFieldProps) => (
  <div className='w-full'>
    <p className='medium-14'>{label}</p>
    <input
      {...register(name)}
      type={type}
      placeholder={placeholder}
      className='border border-gray-200 rounded w-full p-2 mt-1 outline-black/80'
    />
    {error && <span className='text-red-500 text-sm'>{error.message}</span>}
  </div>
);

export default InputFieldAuth;
