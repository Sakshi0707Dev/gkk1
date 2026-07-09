import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminOrdersRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/orders', { replace: true });
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default AdminOrdersRedirect;
