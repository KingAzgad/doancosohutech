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

function App() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(userLoginStatus === 'true');

    const mockBrands = [
      {
        brand_id: 1,
        name: "Murakami",
        products: [
          { product_id: 1, name: "Áo Thun Minimalist", price_sell: 550000, description: "Áo thun thiết kế tối giản, chất liệu cotton cao cấp" },
          { product_id: 2, name: "Quần Jogger Unisex", price_sell: 780000, description: "Quần jogger phong cách đường phố, thoải mái" },
          { product_id: 3, name: "Túi Tote Canvas", price_sell: 450000, description: "Túi tote đa năng với họa tiết truyền thống" },
        ]
      },
      {
        brand_id: 2,
        name: "Sakura",
        products: [
          { product_id: 4, name: "Váy Linen Pastel", price_sell: 890000, description: "Váy linen nhẹ nhàng với tông màu pastel" },
          { product_id: 5, name: "Áo Sơ Mi Oversize", price_sell: 650000, description: "Áo sơ mi rộng phong cách Nhật Bản hiện đại" },
          { product_id: 6, name: "Mũ Bucket Thêu Hoa", price_sell: 320000, description: "Mũ bucket với hoa thêu tay tinh tế" },
        ]
      },
      {
        brand_id: 3,
        name: "Kintsugi",
        products: [
          { product_id: 7, name: "Áo Khoác Denim Vintage", price_sell: 1250000, description: "Áo khoác denim phong cách retro" },
          { product_id: 8, name: "Quần Vải Linen Rộng", price_sell: 790000, description: "Quần linen ống rộng thoáng mát" },
          { product_id: 9, name: "Túi Đeo Chéo Mini", price_sell: 580000, description: "Túi đeo chéo nhỏ gọn, tiện lợi" },
        ]
      },
      {
        brand_id: 4,
        name: "Ikigai",
        products: [
          { product_id: 10, name: "Áo Polo Premium", price_sell: 680000, description: "Áo polo chất liệu pima cotton cao cấp" },
          { product_id: 11, name: "Quần Short Linen", price_sell: 520000, description: "Quần short linen thoáng mát cho mùa hè" },
          { product_id: 12, name: "Áo Khoác Bomber", price_sell: 1450000, description: "Áo khoác bomber với chi tiết thêu tinh tế" },
        ]
      }
    ];

    setBrands(mockBrands);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLoginToggle = () => {
    const newLoginStatus = !isLoggedIn;
    setIsLoggedIn(newLoginStatus);
    localStorage.setItem('isLoggedIn', newLoginStatus);
  };

  const filteredBrands = brands.map(brand => {
    const filteredProducts = brand.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      ...brand,
      products: filteredProducts
    };
  }).filter(brand => brand.products.length > 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="app">
      <Routes>
        {/* Route cho trang đăng nhập */}
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

        {/* Route cho trang đăng ký */}
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
              />
              <Banner />
              <main className="main-content">
                <div className="brands-container">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map(brand => (
                      <section key={brand.brand_id} className="brand-section">
                        <div className="brand-header">
                          <h2 className="brand-title">{brand.name}</h2>
                          <a href={`/brand/${brand.brand_id}`} className="view-all">Xem tất cả</a>
                        </div>
                        <div className="products-grid">
                          {brand.products.map(product => (
                            <ProductCard key={product.product_id} product={product} formatPrice={formatPrice} />
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