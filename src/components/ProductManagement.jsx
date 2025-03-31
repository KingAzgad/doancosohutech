import React, { useState, useEffect } from 'react';
import '../styles/Management.css';

const ProductManagement = ({ fetchProducts }) => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brandId: '',
    name: '',
    description: '',
    priceSell: '',
    priceCost: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductsLocal();
    fetchBrandsLocal();
  }, []);

  const fetchProductsLocal = () => {
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
        setError('Lỗi khi lấy danh sách sản phẩm: ' + error.message);
      });
  };

  const fetchBrandsLocal = () => {
    fetch('https://localhost:7258/api/Brand')
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách thương hiệu');
        }
        return response.json();
      })
      .then(data => {
        setBrands(data);
      })
      .catch(error => {
        setError('Lỗi khi lấy danh sách thương hiệu: ' + error.message);
      });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.brandId || !newProduct.name || !newProduct.priceSell) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    fetch('https://localhost:7258/api/Product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || 'Không thể thêm sản phẩm');
          });
        }
        return response.json();
      })
      .then(data => {
        setProducts([...products, data]);
        setNewProduct({ brandId: '', name: '', description: '', priceSell: '', priceCost: '' });
        setError('');
        fetchProducts(); // Làm mới danh sách sản phẩm trên Homepage
      })
      .catch(error => {
        setError('Lỗi khi thêm sản phẩm: ' + error.message);
      });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    fetch(`https://localhost:7258/api/Product/${editingProduct.productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandId: editingProduct.brandId,
        name: editingProduct.name,
        description: editingProduct.description,
        priceSell: editingProduct.priceSell,
        priceCost: editingProduct.priceCost,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể cập nhật sản phẩm');
        }
        setProducts(products.map(p => (p.productId === editingProduct.productId ? editingProduct : p)));
        setEditingProduct(null);
        setError('');
        fetchProducts(); // Làm mới danh sách sản phẩm trên Homepage
      })
      .catch(error => {
        setError('Lỗi khi cập nhật sản phẩm: ' + error.message);
      });
  };

  const handleDeleteProduct = (id) => {
    fetch(`https://localhost:7258/api/Product/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể xóa sản phẩm');
        }
        setProducts(products.filter(p => p.productId !== id));
        setError('');
        fetchProducts(); // Làm mới danh sách sản phẩm trên Homepage
      })
      .catch(error => {
        setError('Lỗi khi xóa sản phẩm: ' + error.message);
      });
  };

  return (
    <div className="management-page">
      <h1>Quản lý sản phẩm</h1>

      {error && <div className="management-error">{error}</div>}

      {/* Form thêm sản phẩm */}
      <form onSubmit={handleAddProduct} className="management-form">
        <h2>Thêm sản phẩm mới</h2>
        <div className="form-group">
          <label>Thương hiệu</label>
          <select
            value={newProduct.brandId}
            onChange={(e) => setNewProduct({ ...newProduct, brandId: e.target.value })}
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <input
            type="text"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Nhập mô tả sản phẩm"
          />
        </div>
        <div className="form-group">
          <label>Giá bán</label>
          <input
            type="number"
            value={newProduct.priceSell}
            onChange={(e) => setNewProduct({ ...newProduct, priceSell: e.target.value })}
            placeholder="Nhập giá bán"
          />
        </div>
        <div className="form-group">
          <label>Giá nhập (không bắt buộc)</label>
          <input
            type="number"
            value={newProduct.priceCost}
            onChange={(e) => setNewProduct({ ...newProduct, priceCost: e.target.value })}
            placeholder="Nhập giá nhập"
          />
        </div>
        <button type="submit" className="management-button">Thêm sản phẩm</button>
      </form>

      {/* Form sửa sản phẩm */}
      {editingProduct && (
        <form onSubmit={handleUpdateProduct} className="management-form">
          <h2>Sửa sản phẩm</h2>
          <div className="form-group">
            <label>Thương hiệu</label>
            <select
              value={editingProduct.brandId}
              onChange={(e) => setEditingProduct({ ...editingProduct, brandId: e.target.value })}
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map(brand => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input
              type="text"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>
          <div className="form-group">
            <label>Giá bán</label>
            <input
              type="number"
              value={editingProduct.priceSell}
              onChange={(e) => setEditingProduct({ ...editingProduct, priceSell: e.target.value })}
              placeholder="Nhập giá bán"
            />
          </div>
          <div className="form-group">
            <label>Giá nhập (không bắt buộc)</label>
            <input
              type="number"
              value={editingProduct.priceCost}
              onChange={(e) => setEditingProduct({ ...editingProduct, priceCost: e.target.value })}
              placeholder="Nhập giá nhập"
            />
          </div>
          <button type="submit" className="management-button">Cập nhật</button>
          <button
            type="button"
            className="management-button cancel"
            onClick={() => setEditingProduct(null)}
          >
            Hủy
          </button>
        </form>
      )}

      {/* Danh sách sản phẩm */}
      <div className="management-list">
        <h2>Danh sách sản phẩm</h2>
        {products.length > 0 ? (
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Mô tả</th>
                <th>Giá bán</th>
                <th>Giá nhập</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.name}</td>
                  <td>{product.brand?.name || 'Không xác định'}</td>
                  <td>{product.description || 'Không có'}</td>
                  <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.priceSell)}</td>
                  <td>{product.priceCost ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.priceCost) : 'Không có'}</td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="management-button edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className="management-button delete"
                      onClick={() => handleDeleteProduct(product.productId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;