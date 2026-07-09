import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const STATUS_FLOW = ['placed', 'confirmed', 'packed', 'shipped', 'outfordelivery', 'delivered'];

const STATUS_LABELS = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  outfordelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_BADGE_COLORS = {
  placed: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-orange-100 text-orange-800',
  outfordelivery: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const PAYMENT_STATUS_LABELS = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
};

const PAYMENT_STATUS_COLORS = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const ADMIN_ACTIONS = {
  placed: [
    { label: 'Confirm', status: 'confirmed', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-red-500 hover:bg-red-600' },
  ],
  confirmed: [
    { label: 'Pack', status: 'packed', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-red-500 hover:bg-red-600' },
  ],
  packed: [
    { label: 'Ship', status: 'shipped', color: 'bg-gray-900 hover:bg-black' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-red-500 hover:bg-red-600' },
  ],
  shipped: [
    { label: 'Out for Delivery', status: 'outfordelivery', color: 'bg-amber-600 hover:bg-amber-700' },
  ],
  outfordelivery: [
    { label: 'Deliver', status: 'delivered', color: 'bg-green-600 hover:bg-green-700' },
  ],
  delivered: [],
  cancelled: [],
};

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

  const getCurrentFlowIndex = (order) => {
    if (order.orderStatus === 'cancelled') {
      const completedStatuses = (order.statusHistory || [])
        .filter((h) => STATUS_FLOW.includes(h.status))
        .map((h) => h.status);
      const lastCompleted = completedStatuses[completedStatuses.length - 1];
      return lastCompleted ? STATUS_FLOW.indexOf(lastCompleted) : -1;
    }
    return STATUS_FLOW.indexOf(order.orderStatus);
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
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <Link to="/admin/products" className="text-sm font-bold text-agri-green hover:underline">Products</Link>
              <span className="text-gray-300">|</span>
              <Link to="/admin/orders" className="text-sm font-bold text-agri-green hover:underline">All Orders</Link>
              <span className="text-gray-300">|</span>
            </>
          )}
          <Link to="/" className="text-agri-green font-bold hover:underline">Home</Link>
        </div>
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
          const currentIndex = getCurrentFlowIndex(order);
          const isCancelled = order.orderStatus === 'cancelled';
          const badgeColor = STATUS_BADGE_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-800';
          const label = STATUS_LABELS[order.orderStatus] || order.orderStatus;
          const nextActions = ADMIN_ACTIONS[order.orderStatus] || [];

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
                  {order.estimatedDelivery && !isCancelled && (
                    <p className="text-xs text-agri-green mt-1 font-semibold">
                      Est. Delivery: {formatDateTime(order.estimatedDelivery)}
                    </p>
                  )}
                  {order.trackingId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tracking ID: <span className="font-bold">{order.trackingId}</span>
                    </p>
                  )}
                  {order.trackingNumber && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tracking #: <span className="font-bold">{order.trackingNumber}</span>
                    </p>
                  )}
                  {order.trackingUrl && (
                    <p className="text-xs text-blue-500 mt-1">
                      <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">
                        Track Package
                      </a>
                    </p>
                  )}
                  {order.courier && (
                    <p className="text-xs text-gray-500 mt-1">
                      Courier: <span className="font-bold">{order.courier}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                    {label}
                  </span>
                  {order.paymentMethod && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {order.paymentMethod}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${PAYMENT_STATUS_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                  </span>
                </div>
              </div>

              {!isCancelled && currentIndex >= 0 && (
                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Status Timeline
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {STATUS_FLOW.map((status, idx) => {
                      const done = idx <= currentIndex;
                      const date = historyMap.get(status);
                      return (
                        <div
                          key={status}
                          className={`rounded-xl border p-2.5 text-center ${
                            done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <p className={`text-xs font-black leading-tight ${done ? 'text-green-700' : 'text-gray-600'}`}>
                            {STATUS_LABELS[status] || status}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                            {date ? formatDateTime(date) : done ? 'Updated' : 'Pending'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="mt-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Order Timeline
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {STATUS_FLOW.map((status, idx) => {
                      const done = idx <= currentIndex;
                      const date = historyMap.get(status);
                      if (!done && !date) return null;
                      return (
                        <div
                          key={status}
                          className={`rounded-xl border p-2.5 text-center ${
                            done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <p className={`text-xs font-black leading-tight ${done ? 'text-green-700' : 'text-gray-400'}`}>
                            {STATUS_LABELS[status] || status}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                            {date ? formatDateTime(date) : ''}
                          </p>
                        </div>
                      );
                    })}
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-2.5 text-center col-span-2 sm:col-span-3 md:col-span-6">
                      <p className="text-xs font-black text-red-700">
                        Cancelled
                      </p>
                      <p className="text-[10px] text-red-500 mt-1">
                        {historyMap.get('cancelled') ? formatDateTime(historyMap.get('cancelled')) : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isAdmin && nextActions.length > 0 && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Admin Actions
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {nextActions.map((action) => (
                      <button
                        key={action.status}
                        type="button"
                        disabled={updatingId === order._id}
                        onClick={() => updateStatus(order._id, action.status)}
                        className={`px-4 py-2 rounded-xl font-black text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.97] ${action.color}`}
                      >
                        {updatingId === order._id ? 'Updating...' : action.label}
                      </button>
                    ))}
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
                <div className="border-t mt-3 pt-3 space-y-1">
                  {(order.subtotal || order.totalAmount) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold">₹ {Number(order.subtotal || order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                  )}
                  {order.shippingCost !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold">
                        {order.shippingCost === 0 ? (
                          <span className="text-agri-green">FREE</span>
                        ) : (
                          `₹ ${Number(order.shippingCost).toLocaleString()}`
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-700">Total</span>
                    <span className="font-black text-gray-900">₹ {Number(order.total || order.totalAmount || 0).toLocaleString()}</span>
                  </div>
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
