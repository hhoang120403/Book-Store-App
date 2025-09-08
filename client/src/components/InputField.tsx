import type { AddressFormData } from '../schemas/addressSchema';
import type { FieldError, UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  name: keyof AddressFormData;
  placeholder: string;
  register: UseFormRegister<AddressFormData>;
  error?: FieldError;
  className?: string;
  type?: string;
}

const InputField = ({
  name,
  placeholder,
  register,
  error,
  className,
  type = 'text',
}: InputFieldProps) => {
  return (
    <div className='flex flex-col w-full'>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-primary outline-none w-full ${className}`}
      />
      {error && <span className='text-red-500 text-sm'>{error.message}</span>}
    </div>
  );
};
export default InputField;
