import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
      index: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    passwordResetOtp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
      verified: { type: Boolean, default: false, select: false },
    },

    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password || !candidate) {
    return false;
  }
  try {
    return await bcrypt.compare(candidate, this.password);
  } catch (err) {
    console.error('[MODEL] Password compare error:', err.message);
    return false;
  }
};

userSchema.methods.toPublic = function () {
  return {
    id:         this._id,
    name:       this.name,
    email:      this.email,
    phone:      this.phone,
    avatar:     this.avatar,
    role:       this.role,
    isVerified: this.isVerified,
    createdAt:  this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;