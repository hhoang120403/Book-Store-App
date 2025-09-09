import upload_icon from '../../assets/upload_icon.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ProductSchema,
  type ProductFormData,
} from '../../schemas/productSchema';
import { categories } from '../../constants/categories';
import axiosInstance from '../../configs/axiosConfig';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../../types/apiResponse';
import { fetchBooks } from '../../redux/shop/shopSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';

const AddProduct = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      category: categories[0],
      price: '',
      offerPrice: '',
      popular: false,
      files: [],
      published: '',
      pages: '',
      language: '',
    },
  });

  const files = watch('files'); // Watch the value of files

  const onSubmitHandler = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      const { files, ...productData } = data;
      formData.append('productData', JSON.stringify(productData));
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('images', file);
        });
      }

      const res = await axiosInstance.post<ApiResponse>(
        '/api/product/add-product',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        dispatch(fetchBooks());
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll w-full lg:w-4/5 rounded-xl'>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className='flex flex-col gap-y-3 medium-14'
      >
        <div className='w-full'>
          <h5 className='h5'>Name</h5>
          <input
            {...register('name')}
            type='text'
            placeholder='Write here...'
            disabled={isSubmitting}
            className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-xl'
          />
          {errors.name && (
            <p className='text-red-500 text-sm mt-2'>{errors.name.message}</p>
          )}
        </div>
        <div className='w-full'>
          <h5 className='h5'>Description</h5>
          <textarea
            {...register('description')}
            rows={5}
            placeholder='Write here...'
            disabled={isSubmitting}
            className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-xl'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>
        <div>
          <div className='flex gap-4'>
            <div>
              <h5 className='h5'>Pages</h5>
              <input
                {...register('pages')}
                type='number'
                placeholder='0'
                disabled={isSubmitting}
                className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 max-w-24'
              />
            </div>
            <div>
              <h5 className='h5'>Published</h5>
              <input
                {...register('published')}
                type='number'
                placeholder='0'
                disabled={isSubmitting}
                className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 max-w-24'
              />
            </div>
            <div>
              <h5 className='h5'>Languague</h5>
              <input
                {...register('language')}
                type='text'
                placeholder='Vietnamese'
                disabled={isSubmitting}
                className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 max-w-24'
              />
            </div>
          </div>
          <div className='flex flex-col mt-2 gap-2'>
            {errors.pages && (
              <p className='text-red-500 text-sm'>{errors.pages.message}</p>
            )}
            {errors.published && (
              <p className='text-red-500 text-sm'>{errors.published.message}</p>
            )}
            {errors.language && (
              <p className='text-red-500 text-sm'>{errors.language.message}</p>
            )}
          </div>
        </div>
        <div>
          <div className='flex gap-4'>
            <div>
              <h5 className='h5'>Category</h5>
              <select
                {...register('category')}
                disabled={isSubmitting}
                className='max-w-30 px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1'
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h5 className='h5'>Price</h5>
              <input
                {...register('price')}
                type='number'
                placeholder='0'
                disabled={isSubmitting}
                className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 max-w-24'
              />
            </div>
            <div>
              <h5 className='h5'>Offer Price</h5>
              <input
                {...register('offerPrice')}
                type='number'
                placeholder='0'
                disabled={isSubmitting}
                className='px-3 py-2 ring-1 ring-slate-900/10 rounded bg-white mt-1 max-w-24'
              />
            </div>
          </div>
          <div className='flex flex-col mt-2 gap-2'>
            {errors.price && (
              <p className='text-red-500 text-sm'>{errors.price.message}</p>
            )}
            {errors.offerPrice && (
              <p className='text-red-500 text-sm'>
                {errors.offerPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className='flex gap-2 mt-2'>
            {Array(4)
              .fill('')
              .map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className='ring-1 ring-slate-900/10 overflow-hidden rounded'
                >
                  <input
                    type='file'
                    id={`image${index}`}
                    hidden
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const newFiles = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      if (newFiles.length > 0) {
                        const updatedFiles = [...(files || [])];
                        updatedFiles[index] = newFiles[0]; // thay thế ảnh ở vị trí index
                        setValue('files', updatedFiles, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                  <img
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : upload_icon
                    }
                    alt='Upload Image'
                    height={68}
                    width={68}
                    className='bg-white overflow-hidden aspect-square object-cover'
                  />
                </label>
              ))}
          </div>
          {errors.files && (
            <p className='text-red-500 text-sm mt-2'>{errors.files.message}</p>
          )}
        </div>
        <div className='flexStart gap-2 my-2'>
          <input
            {...register('popular')}
            type='checkbox'
            id='popular'
            disabled={isSubmitting}
          />
          <label htmlFor='popular' className='cursor-pointer'>
            Add to Popular
          </label>
        </div>
        <button
          type='submit'
          className='btn-dark mt-3 max-w-44 sm:w-full rounded'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
