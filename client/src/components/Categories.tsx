import { useNavigate } from 'react-router';
import Title from './Title';
import { categories } from '../assets/data';

const Categories = () => {
  const navigate = useNavigate();
  const colors = ['bg-[#aedae6]', 'bg-[#fff6c9]', 'bg-[#fddbdb]'];

  return (
    <section className='max-padd-container pt-16'>
      <Title
        title1='Category'
        title2='List'
        titleStyles='pb-6'
        paraStyles='hidden'
      />

      <div className='flex gap-9 flex-wrap'>
        {categories.map((cate, index) => (
          <div
            key={index}
            className='flexCenter flex-col cursor-pointer group'
            onClick={() => navigate(`/shop/${cate.name.toLowerCase()}`)}
          >
            <div
              className={`flexCenter flex-col h-36 w-36 sm:h-40 sm:w-40 rounded-xl ${
                colors[index % 3]
              }`}
            >
              <img
                src={cate.image}
                alt={cate.name}
                height={46}
                width={46}
                className='object-cover'
              />
              <h5 className='h5 capitalize mt-6'>{cate.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Categories;
