import React from 'react';
import '../styles/ProductCard.css';

const ProductCard = ({ product, formatPrice }) => {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">
        <div className="img-ratio-container">
          <div className="placeholder-image"></div>
        </div>
        <button className="wishlist-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price_sell)}</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-button">Thêm vào giỏ</button>
      </div>
    </div>
  );
};

export default ProductCard;