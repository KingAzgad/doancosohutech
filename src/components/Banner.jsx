import React from 'react';
import '../styles/Banner.css';

const Banner = () => {
  return (
    <section className="banner-ad">
      <div className="banner-container">
        <div className="banner-content">
          <h2>Bộ sưu tập mùa xuân 2025</h2>
          <p>Khám phá xu hướng thời trang Nhật Bản mới nhất với các thiết kế độc quyền từ các nhà thiết kế hàng đầu.</p>
          <button className="banner-button">Khám phá ngay</button>
        </div>
      </div>
    </section>
  );
};

export default Banner;