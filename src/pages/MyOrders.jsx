import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const STATUS_FLOW = ['placed', 'confirmed', 'shipped', 'delivered'];

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const isAdmin = user?.role === 'admin';

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/update-status/${orderId}`, { status });
      const updated = res.data?.data?.order;
      if (updated?._id) {
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const emptyState = useMemo(
    () => !loading && !error && Array.isArray(orders) && orders.length === 0,
    [loading, error, orders]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track shipping and delivery status.</p>
        </div>
        <Link to="/" className="text-agri-green font-bold hover:underline">Back to Home</Link>
      </div>

      {loading && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">
          Loading orders...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-semibold">
          {error}
        </div>
      )}

      {emptyState && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">
          You have no orders yet.
        </div>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const historyMap = new Map(
            (order.statusHistory || []).map((h) => [h.status, h.date])
          );
          const currentIndex = Math.max(0, STATUS_FLOW.indexOf(order.orderStatus));

          return (
            <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: <span className="font-bold text-gray-900">{order.orderId}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed: {formatDateTime(order.createdAt)}
                  </p>
                  {order.trackingId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tracking ID: <span className="font-bold">{order.trackingId}</span>
                    </p>
                  )}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Status: <span className="text-agri-green">{order.orderStatus}</span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Status Timeline
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {STATUS_FLOW.map((status, idx) => {
                    const done = idx <= currentIndex;
                    const date = historyMap.get(status);
                    return (
                      <div
                        key={status}
                        className={`rounded-2xl border p-3 ${
                          done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <p className={`text-sm font-black ${done ? 'text-green-700' : 'text-gray-600'}`}>
                          {status}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {date ? formatDateTime(date) : done ? 'Updated' : 'Pending'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isAdmin && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Admin Actions
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, 'confirmed')}
                      className="px-4 py-2 rounded-xl font-black bg-agri-green text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, 'shipped')}
                      className="px-4 py-2 rounded-xl font-black bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                    >
                      Ship
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, 'delivered')}
                      className="px-4 py-2 rounded-xl font-black bg-agri-orange text-white hover:bg-orange-500 disabled:opacity-60"
                    >
                      Deliver
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Items
                </p>
                <div className="space-y-2">
                  {(order.items || []).map((item, idx) => (
                    <div key={`${order._id}-${idx}`} className="flex justify-between text-sm text-gray-700">
                      <span className="font-semibold">{item.name} × {item.quantity}</span>
                      <span className="font-black">₹ {Number(item.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between text-sm">
                  <span className="font-bold text-gray-500">Total</span>
                  <span className="font-black text-gray-900">₹ {Number(order.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
