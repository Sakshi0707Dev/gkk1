import { useEffect, useMemo, useState } from 'react';
import adminApi from '../../utils/adminApi';

const STATUS_LIST = ['placed', 'confirmed', 'packed', 'shipped', 'outfordelivery', 'delivered', 'cancelled'];

const STATUS_LABELS = {
  placed: 'Placed', confirmed: 'Confirmed', packed: 'Packed',
  shipped: 'Shipped', outfordelivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

const STATUS_BADGE_COLORS = {
  placed: 'bg-blue-100 text-blue-800', confirmed: 'bg-indigo-100 text-indigo-800',
  packed: 'bg-purple-100 text-purple-800', shipped: 'bg-orange-100 text-orange-800',
  outfordelivery: 'bg-yellow-100 text-yellow-800', delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_FLOW = ['placed', 'confirmed', 'packed', 'shipped', 'outfordelivery', 'delivered'];

const VALID_TRANSITIONS = {
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

const PAYMENT_BADGE_COLORS = {
  paid: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', failed: 'bg-red-100 text-red-800',
};

const formatDateTime = (value) => {
  try { return new Date(value).toLocaleString(); } catch { return ''; }
};

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return ''; }
};

const CancelModal = ({ order, onConfirm, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
      <h3 className="text-lg font-black text-gray-900">Cancel Order</h3>
      <p className="text-sm text-gray-600">
        Are you sure you want to cancel order <strong>{order.orderId}</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose}
          className="px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Keep Order</button>
        <button onClick={onConfirm}
          className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">Yes, Cancel</button>
      </div>
    </div>
  </div>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('orderId');
  const [updatingId, setUpdatingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.get('/orders');
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await adminApi.put(`/orders/${orderId}/status`, { status });
      const updated = res.data?.data?.order;
      if (updated?._id) {
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      }
      setCancelTarget(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelConfirm = () => {
    if (cancelTarget) {
      updateStatus(cancelTarget._id, 'cancelled');
    }
  };

  const handleAction = (order, action) => {
    if (action.status === 'cancelled') {
      setCancelTarget(order);
      return;
    }
    updateStatus(order._id, action.status);
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (filter !== 'all') {
      result = result.filter((o) => o.orderStatus === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((o) => {
        if (searchBy === 'orderId') return o.orderId?.toLowerCase().includes(q);
        if (searchBy === 'name') return o.address?.name?.toLowerCase().includes(q);
        if (searchBy === 'phone') return o.address?.phone?.includes(q);
        return true;
      });
    }
    return result;
  }, [orders, filter, search, searchBy]);

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

  return (
    <div className="p-8">
      {cancelTarget && (
        <CancelModal order={cancelTarget} onConfirm={handleCancelConfirm} onClose={() => setCancelTarget(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all customer orders.</p>
        </div>
        <button onClick={loadOrders} className="text-sm font-bold text-agri-green hover:underline">Refresh</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filter === 'all' ? 'bg-agri-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>All ({orders.length})</button>
          {STATUS_LIST.map((s) => {
            const count = orders.filter((o) => o.orderStatus === s).length;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filter === s ? 'bg-agri-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{STATUS_LABELS[s]} ({count})</button>
            );
          })}
        </div>

        <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-700 outline-none focus:border-agri-green">
            <option value="orderId">Order ID</option>
            <option value="name">Customer Name</option>
            <option value="phone">Phone</option>
          </select>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 sm:w-52 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-agri-green placeholder:text-gray-400" />
        </div>
      </div>

      {loading && <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">Loading orders...</div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-semibold">{error}</div>}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">
          {filter !== 'all' || search.trim() ? 'No orders match the current filter or search.' : 'No orders found.'}
        </div>
      )}

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const historyMap = new Map(
            (order.statusHistory || []).map((h) => [h.status, h.date || h.changedAt])
          );
          const currentIndex = getCurrentFlowIndex(order);
          const isCancelled = order.orderStatus === 'cancelled';
          const badgeColor = STATUS_BADGE_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-800';
          const paymentBadge = PAYMENT_BADGE_COLORS[order.paymentStatus] || 'bg-gray-100 text-gray-800';
          const actions = VALID_TRANSITIONS[order.orderStatus] || [];

          return (
            <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{order.orderId}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                      {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${paymentBadge}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Placed: {formatDateTime(order.createdAt)}</p>
                  <p className="text-xs text-gray-500">
                    Customer: <span className="font-semibold text-gray-700">{order.address?.name}</span>
                    {' | '}Phone: <span className="font-semibold text-gray-700">{order.address?.phone}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-gray-900">
                    ₹ {Number(order.total || order.totalAmount || 0).toLocaleString()}
                  </p>
                  {order.estimatedDelivery && !isCancelled && (
                    <p className="text-xs text-agri-green font-semibold mt-0.5">
                      Est. Delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {order.address?.name}<br />
                    {order.address?.addressLine}
                    {order.address?.addressLine2 ? `, ${order.address.addressLine2}` : ''}
                    {order.address?.landmark ? ` (${order.address.landmark})` : ''}<br />
                    {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                  <p className="text-xs text-gray-700">
                    Status: <span className="font-semibold capitalize">{order.paymentStatus}</span>
                    {order.paymentMethod && <> | Method: {order.paymentMethod}</>}
                  </p>
                  {order.trackingId && <p className="text-xs text-gray-500 mt-1">Tracking ID: {order.trackingId}</p>}
                  {order.courier && <p className="text-xs text-gray-500 mt-1">Courier: {order.courier}</p>}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Items</p>
                <div className="space-y-1">
                  {(order.items || []).map((item, idx) => (
                    <div key={`${order._id}-${idx}`} className="flex justify-between text-sm text-gray-700">
                      <span className="font-semibold">{item.name} × {item.quantity}</span>
                      <span className="font-black">₹ {Number(item.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2 space-y-0.5">
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
                        {order.shippingCost === 0 ? <span className="text-agri-green">FREE</span> : `₹ ${Number(order.shippingCost).toLocaleString()}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1 mt-1">
                    <span className="text-gray-700">Total</span>
                    <span className="font-black text-gray-900">₹ {Number(order.total || order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status History</p>
                {(!isCancelled && currentIndex >= 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {STATUS_FLOW.map((status, idx) => {
                      const done = idx <= currentIndex;
                      const date = historyMap.get(status);
                      return (
                        <div key={status}
                          className={`rounded-xl border p-2.5 text-center ${done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
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
                ) : null}

                {isCancelled && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {STATUS_FLOW.map((status, idx) => {
                      const done = idx <= currentIndex;
                      const date = historyMap.get(status);
                      if (!done && !date) return null;
                      return (
                        <div key={status}
                          className={`rounded-xl border p-2.5 text-center ${done ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                          <p className={`text-xs font-black leading-tight ${done ? 'text-green-700' : 'text-gray-400'}`}>
                            {STATUS_LABELS[status] || status}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 leading-tight">{date ? formatDateTime(date) : ''}</p>
                        </div>
                      );
                    })}
                    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-2.5 text-center col-span-2 sm:col-span-3 md:col-span-6">
                      <p className="text-xs font-black text-red-700">Cancelled</p>
                      <p className="text-[10px] text-red-500 mt-1">{historyMap.get('cancelled') ? formatDateTime(historyMap.get('cancelled')) : ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {actions.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button key={action.status} type="button" disabled={updatingId === order._id}
                        onClick={() => handleAction(order, action)}
                        className={`px-4 py-2 rounded-xl font-black text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.97] ${action.color}`}>
                        {updatingId === order._id ? 'Updating...' : action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
