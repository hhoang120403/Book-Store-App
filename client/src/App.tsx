import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryShop from './pages/CategoryShop';
import ProductDetails from './pages/ProductDetails';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import AddressForm from './pages/AddressForm';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './redux/store';
import Login from './components/Login';
import Sidebar from './components/admin/Sidebar';
import AdminLogin from './components/admin/AdminLogin';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import Orders from './pages/admin/Orders';
import { useEffect } from 'react';
import { fetchAdmin, fetchBooks, fetchUser } from './redux/shop/shopSlice';
import Loading from './components/Loading';

const App = () => {
  const { showUserLogin, isAdmin, user } = useSelector(
    (state: RootState) => state.shop
  );

  const isAdminPath = useLocation().pathname.includes('admin');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAdmin());
    dispatch(fetchUser());
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <main>
      {showUserLogin && <Login />}
      {!isAdminPath && <Header />}
      <Toaster position='top-right' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/shop/:category' element={<CategoryShop />} />
        <Route path='/shop/:category/:id' element={<ProductDetails />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={user ? <Cart /> : null} />
        <Route path='/address-form' element={user ? <AddressForm /> : null} />
        <Route path='/my-orders' element={user ? <MyOrders /> : null} />
        <Route path='/loader' element={<Loading />} />
        <Route path='/admin' element={isAdmin ? <Sidebar /> : <AdminLogin />}>
          <Route index element={isAdmin ? <AddProduct /> : null} />
          <Route path='list' element={<ProductList />} />
          <Route path='orders' element={<Orders />} />
        </Route>
      </Routes>
      {!isAdminPath && <Footer />}
    </main>
  );
};
export default App;
