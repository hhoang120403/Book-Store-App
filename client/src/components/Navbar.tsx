import { IoLibraryOutline } from 'react-icons/io5';
import { PiEnvelopeDuotone } from 'react-icons/pi';
import { TbBrandBlogger, TbHome } from 'react-icons/tb';
import { NavLink } from 'react-router';
import { setSearchQuery } from '../redux/shop/shopSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';

interface NavbarProps {
  setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
  containerStyles: string;
}

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: <TbHome />,
  },
  {
    to: '/shop',
    label: 'Shop',
    icon: <IoLibraryOutline />,
  },
  {
    to: '/blog',
    label: 'Blog',
    icon: <TbBrandBlogger />,
  },
  {
    to: 'mailto:hhoang120403@gmail.com',
    label: 'Contact',
    icon: <PiEnvelopeDuotone />,
  },
];

const Navbar = ({ setMenuOpened, containerStyles }: NavbarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <nav className={containerStyles}>
      {navItems.map(({ to, label, icon }) => (
        <div key={label}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `${
                isActive ? 'bg-white ring-1 ring-slate-900/10' : ''
              } flexCenter gap-x-2 px-3 py-1.5 rounded-full`
            }
            onClick={() => {
              setMenuOpened(false);
              dispatch(setSearchQuery(''));
            }}
          >
            <span className='text-xl'>{icon}</span>
            <span className='medium-16'>{label}</span>
          </NavLink>
        </div>
      ))}
    </nav>
  );
};
export default Navbar;
