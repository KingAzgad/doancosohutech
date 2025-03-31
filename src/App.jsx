import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/Global.css';
import './styles/ProductCard.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import ProductCard from './components/ProductCard';
import Login from './components/Login';
import Register from './components/Register';
import BrandLogin from './components/BrandLogin';
import BrandRegister from './components/BrandRegister';
import BrandManagement from './components/BrandManagement';
import ProductManagement from './components/ProductManagement';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBrandLoggedIn, setIsBrandLoggedIn] = useState(false);

  const fetchProducts = () => {
    fetch('https://localhost:7258/api/Product')
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách sản phẩm');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      });
  };

  useEffect(() => {
    const userLoginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(userLoginStatus === 'true');
    const brandLoginStatus = localStorage.getItem('isBrandLoggedIn');
    setIsBrandLoggedIn(brandLoginStatus === 'true');
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLoginToggle = () => {
    const newLoginStatus = !isLoggedIn;
    setIsLoggedIn(newLoginStatus);
    localStorage.setItem('isLoggedIn', newLoginStatus);
    if (!newLoginStatus) {
      setIsBrandLoggedIn(false);
      localStorage.removeItem('isBrandLoggedIn');
      localStorage.removeItem('brandToken');
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const brandId = product.brandId;
    const brandName = product.brand?.name || 'Thương hiệu không xác định';
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return acc;
    if (!acc[brandId]) {
      acc[brandId] = {
        brandId,
        brandName,
        products: [],
      };
    }
    acc[brandId].products.push(product);
    return acc;
  }, {});

  const groupedProductsArray = Object.values(groupedProducts).filter(brand => brand.products.length > 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="app">
      <Routes>
        {/* Route cho trang đăng nhập khách hàng */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Route cho trang đăng ký khách hàng */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Route cho trang đăng nhập thương hiệu */}
        <Route
          path="/brand-login"
          element={
            isBrandLoggedIn ? (
              <Navigate to="/" replace /> // Chuyển hướng về Homepage
            ) : (
              <BrandLogin setIsBrandLoggedIn={setIsBrandLoggedIn} />
            )
          }
        />

        {/* Route cho trang đăng ký thương hiệu */}
        <Route
          path="/brand-register"
          element={
            isBrandLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <BrandRegister />
            )
          }
        />

        {/* Route cho trang quản lý thương hiệu */}
        <Route
          path="/brand-management"
          element={
            isBrandLoggedIn ? (
              <BrandManagement fetchProducts={fetchProducts} />
            ) : (
              <Navigate to="/brand-login" replace />
            )
          }
        />

        {/* Route cho trang quản lý sản phẩm */}
        <Route
          path="/product-management"
          element={
            isBrandLoggedIn ? (
              <ProductManagement fetchProducts={fetchProducts} />
            ) : (
              <Navigate to="/brand-login" replace />
            )
          }
        />

        {/* Route cho trang chính */}
        <Route
          path="/"
          element={
            <>
              <Header
                isLoggedIn={isLoggedIn}
                handleLoginToggle={handleLoginToggle}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                isBrandLoggedIn={isBrandLoggedIn}
              />
              <Banner />
              <main className="main-content">
                <div className="brands-container">
                  {groupedProductsArray.length > 0 ? (
                    groupedProductsArray.map(brand => (
                      <section key={brand.brandId} className="brand-section">
                        <div className="brand-header">
                          <h2 className="brand-title">{brand.brandName}</h2>
                          <a href={`/brand/${brand.brandId}`} className="view-all">Xem tất cả</a>
                        </div>
                        <div className="products-grid">
                          {brand.products.map(product => (
                            <ProductCard
                              key={product.productId}
                              product={product}
                              formatPrice={formatPrice}
                            />
                          ))}
                        </div>
                      </section>
                    ))
                  ) : (
                    <div className="empty-state">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <h3>Không tìm thấy sản phẩm</h3>
                      <p>Vui lòng thử lại với từ khóa khác</p>
                    </div>
                  )}
                </div>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;