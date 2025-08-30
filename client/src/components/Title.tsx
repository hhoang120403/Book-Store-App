interface TitleProps {
  title1: string;
  title2: string;
  titleStyles: string;
  title1Styles?: string;
  paraStyles?: string;
  para?: string;
}

const Title = ({
  title1,
  title2,
  titleStyles,
  title1Styles,
  paraStyles,
  para,
}: TitleProps) => {
  return (
    <div className={titleStyles}>
      <h3 className={`${title1Styles} h3 capitalize`}>
        {title1} <span className='font-light underline'>{title2}</span>
      </h3>
      <p className={`${paraStyles} max-w-md mt-2`}>
        {para
          ? para
          : 'Discover books that spark curiosity, deliver quality and bring inspiration to your everyday reading'}
      </p>
    </div>
  );
};
export default Title;
