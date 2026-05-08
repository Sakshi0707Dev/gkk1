import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import api from '../utils/api';

const Checkout = () => {
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  const toObjectIdLike = (value) => {
    const hex = String(value)
      .split('')
      .map((char) => char.charCodeAt(0).toString(16))
      .join('')
      .replace(/[^a-f0-9]/gi, '')
      .slice(0, 24);

    return (hex + '0'.repeat(24)).slice(0, 24);
  };

  const handlePayment = async () => {
    if (cart.length === 0 || isProcessing) return;

    const token = localStorage.getItem('token') || localStorage.getItem('agri_token');
    if (!token || token.startsWith('google_token_')) {
      alert('Please login first');
      navigate('/');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment gateway failed to load. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const items = cart.map((item) => ({
        productId: toObjectIdLike(item.id),
        name: item.name,
        price: parseInt(String(item.price).replace(/[^\d]/g, ''), 10),
        quantity: item.quantity,
      }));

      const address = {
        name: user?.name || 'Customer',
        phone: user?.phone || '9999999999',
        addressLine: 'Address not provided',
        city: 'Pune',
        pincode: '411001',
      };

      const orderRes = await api.post('/orders', {
        items,
        totalAmount: totalPrice,
        address,
      });

      const dbOrder = orderRes.data?.data?.order;
      const dbOrderId = dbOrder?._id;
      if (!dbOrderId) {
        throw new Error('Unable to create order.');
      }

      const razorpayRes = await api.post('/payment/create-order', { orderId: dbOrderId });

      const { razorpayOrderId, amount, keyId } = razorpayRes.data?.data || {};
      if (!razorpayOrderId || !amount || !keyId) {
        throw new Error('Unable to initialize payment.');
      }

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Gawande Krushi Kendra',
        description: `Order ${dbOrder.orderId || dbOrderId}`,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrderId,
            });

            clearCart();
            setIsOrdered(true);
            navigate('/checkout?success=1', { replace: true });
          } catch {
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.phone || '',
        },
        theme: { color: '#2F855A' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Unable to process payment. Please try again.';
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (isOrdered || new URLSearchParams(location.search).get('success') === '1') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={48} className="text-agri-green" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Your order has been confirmed and is being processed. You will receive an update soon.
          </p>
          <Link 
            to="/" 
            className="bg-agri-green text-white font-black px-8 py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <ShoppingBag size={20} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 mb-8 text-agri-green font-bold hover:text-green-700 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <ShoppingBag className="text-agri-green" />
              Order Summary ({cartTotal})
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-6">Your cart is empty.</p>
                <Link to="/" className="text-agri-green font-bold underline">Go back to shop</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-lg" />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">{item.name}</h3>
                        <p className="text-gray-500 text-xs sm:text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-black text-gray-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Payment & Action */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="text-agri-green" />
              Payment
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹ {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-agri-green font-bold">FREE</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-black text-gray-900">
                <span>Total</span>
                <span>₹ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={cart.length === 0 || isProcessing}
              className={`w-full py-4 rounded-xl font-black shadow-lg transition-all active:scale-[0.98] ${
                cart.length === 0 || isProcessing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-agri-green text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
              Secure Checkout • Razorpay Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;