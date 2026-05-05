import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (items) => Array.isArray(items) && items.length > 0,
      message: 'Order must contain at least one item.',
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  amountInPaise: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'shipped', 'delivered'],
    default: 'placed',
    required: true,
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['placed', 'confirmed', 'shipped', 'delivered'],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  address: {
    type: addressSchema,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    trim: true,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    trim: true,
    default: null,
  },
  paymentMethod: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  trackingId: {
    type: String,
    trim: true,
    default: null,
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
