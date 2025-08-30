const ProductDescription = () => {
  return (
    <div className='mt-14 ring-1 ring-slate-900/10 rounded-lg'>
      <div className='flex gap-3'>
        <button className='medium-14 p-3 w-32 border-b-2 border-secondary'>
          Description
        </button>
        <button className='medium-14 p-3 w-32'>Color Guide</button>
        <button className='medium-14 p-3 w-32'>Size Guide</button>
      </div>
      <hr className='h-[1px] w-full border-gray-500/30' />
      <div className='flex flex-col gap-3 p-3'>
        <div>
          <h5 className='h5'>Detail</h5>
          <p className='text-sm'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptatum, sed facilis iste labore ea quo minus laborum sequi nam
            id quas quia adipisci ipsam voluptates cum laboriosam ullam
            recusandae reprehenderit.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            fugit, quibusdam, dicta, autem voluptatem eaque placeat saepe
            inventore dolore expedita maiores vero beatae laudantium molestias
            iure voluptates. Fugit, quam harum.
          </p>
        </div>
        <div>
          <h5 className='h5'>Benefit</h5>
          <ul className='list-disc pl-5 text-sm flex flex-col gap-1'>
            <li className='text-gray-50'>High-quality</li>
            <li className='text-gray-50'>High-quality</li>
            <li className='text-gray-50'>High-quality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ProductDescription;
