import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProductsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/products', { replace: true });
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default AdminProductsRedirect;
