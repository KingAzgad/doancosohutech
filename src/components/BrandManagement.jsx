import React, { useState, useEffect } from 'react';
import '../styles/Management.css';

const BrandManagement = ({ fetchProducts }) => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: '', ownerId: '' });
  const [editingBrand, setEditingBrand] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBrandsLocal();
  }, []);

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

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.ownerId) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    fetch('https://localhost:7258/api/Brand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBrand),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể thêm thương hiệu');
        }
        return response.json();
      })
      .then(data => {
        setBrands([...brands, data]);
        setNewBrand({ name: '', ownerId: '' });
        setError('');
        fetchProducts();
      })
      .catch(error => {
        setError('Lỗi khi thêm thương hiệu: ' + error.message);
      });
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
  };

  const handleUpdateBrand = (e) => {
    e.preventDefault();
    fetch(`https://localhost:7258/api/Brand/${editingBrand.brandId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editingBrand.name,
        ownerId: editingBrand.ownerId,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể cập nhật thương hiệu');
        }
        setBrands(brands.map(b => (b.brandId === editingBrand.brandId ? editingBrand : b)));
        setEditingBrand(null);
        setError('');
        fetchProducts();
      })
      .catch(error => {
        setError('Lỗi khi cập nhật thương hiệu: ' + error.message);
      });
  };

  const handleDeleteBrand = (id) => {
    fetch(`https://localhost:7258/api/Brand/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Không thể xóa thương hiệu');
        }
        setBrands(brands.filter(b => b.brandId !== id));
        setError('');
        fetchProducts();
      })
      .catch(error => {
        setError('Lỗi khi xóa thương hiệu: ' + error.message);
      });
  };

  return (
    <div className="management-page">
      <h1>Quản lý thương hiệu</h1>

      {error && <div className="management-error">{error}</div>}
      <form onSubmit={handleAddBrand} className="management-form">
        <h2>Thêm thương hiệu mới</h2>
        <div className="form-group">
          <label>Tên thương hiệu</label>
          <input
            type="text"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            placeholder="Nhập tên thương hiệu"
          />
        </div>
        <div className="form-group">
          <label>ID chủ sở hữu</label>
          <input
            type="number"
            value={newBrand.ownerId}
            onChange={(e) => setNewBrand({ ...newBrand, ownerId: e.target.value })}
            placeholder="Nhập ID chủ sở hữu"
          />
        </div>
        <button type="submit" className="management-button">Thêm thương hiệu</button>
      </form>


      {editingBrand && (
        <form onSubmit={handleUpdateBrand} className="management-form">
          <h2>Sửa thương hiệu</h2>
          <div className="form-group">
            <label>Tên thương hiệu</label>
            <input
              type="text"
              value={editingBrand.name}
              onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
              placeholder="Nhập tên thương hiệu"
            />
          </div>
          <div className="form-group">
            <label>ID chủ sở hữu</label>
            <input
              type="number"
              value={editingBrand.ownerId}
              onChange={(e) => setEditingBrand({ ...editingBrand, ownerId: e.target.value })}
              placeholder="Nhập ID chủ sở hữu"
            />
          </div>
          <button type="submit" className="management-button">Cập nhật</button>
          <button
            type="button"
            className="management-button cancel"
            onClick={() => setEditingBrand(null)}
          >
            Hủy
          </button>
        </form>
      )}


      <div className="management-list">
        <h2>Danh sách thương hiệu</h2>
        {brands.length > 0 ? (
          <table className="management-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên thương hiệu</th>
                <th>ID chủ sở hữu</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>{brand.name}</td>
                  <td>{brand.ownerId}</td>
                  <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="management-button edit"
                      onClick={() => handleEditBrand(brand)}
                    >
                      Sửa
                    </button>
                    <button
                      className="management-button delete"
                      onClick={() => handleDeleteBrand(brand.brandId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có thương hiệu nào.</p>
        )}
      </div>
    </div>
  );
};

export default BrandManagement;