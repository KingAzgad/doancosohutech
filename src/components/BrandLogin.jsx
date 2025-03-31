import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BrandLogin.css';

const BrandLogin = ({ setIsBrandLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    fetch('https://localhost:7258/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Đăng nhập thương hiệu thành công với status 204');
          localStorage.setItem('isBrandLoggedIn', 'true');
          setIsBrandLoggedIn(true);
          navigate('/', { replace: true });
          return null;
        }

        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.message || `HTTP error! Status: ${response.status}`);
          });
        }

        return response.json();
      })
      .then(data => {
        if (data === null) return;

        console.log('Đăng nhập thương hiệu thành công với dữ liệu:', data);
        localStorage.setItem('isBrandLoggedIn', 'true');
        localStorage.setItem('brandToken', data.token || '');
        setIsBrandLoggedIn(true);

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      })
      .catch(err => {
        setError('Có lỗi xảy ra: ' + err.message);
        console.error('Brand login error:', err);
      });
  };

  return (
    <div className="brand-login-page">
      <div className="brand-login-wave-background"></div>

      <div className="brand-login-container">
        <div className="brand-login-brand">
          <div className="brand-login-logo">Haki</div>
          <p className="brand-login-tagline">Kênh cho người bán</p>
        </div>

        <div className="brand-login-card">
          <h2 className="brand-login-title">Đăng nhập thương hiệu</h2>

          {error && <div className="brand-login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="brand-login-input-group">
              <label htmlFor="email">Email</label>
              <div className="brand-login-input-container">
                <svg
                  className="brand-login-input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của thương hiệu"
                />
              </div>
            </div>

            <div className="brand-login-input-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="brand-login-input-container">
                <svg
                  className="brand-login-input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
            </div>

            <button type="submit" className="brand-login-button">
              Đăng nhập
              <span className="brand-login-button-effect"></span>
            </button>
          </form>

          <div className="brand-login-divider">
            <span>hoặc</span>
          </div>

          <div className="brand-login-social">
            <button className="brand-login-social-button brand-login-google">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Google
            </button>
            <button className="brand-login-social-button brand-login-facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Facebook
            </button>
          </div>

          <p className="brand-login-register">
            Chưa có tài khoản thương hiệu? <a href="/brand-register">Đăng ký ngay</a>
          </p>
        </div>

        <div className="brand-login-decoration">
          <div className="brand-login-circle brand-login-circle-1"></div>
          <div className="brand-login-circle brand-login-circle-2"></div>
        </div>
      </div>
    </div>
  );
};

export default BrandLogin;