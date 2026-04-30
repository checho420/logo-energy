import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

import Checkout from './pages/Checkout';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Rutas de Administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
          </Route>

          <Route path="/cart" element={<div className="p-20 text-center dark:text-white">El carrito llegará pronto...</div>} />
          <Route path="/login" element={<div className="p-20 text-center dark:text-white">Página de Inicio de Sesión</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;

