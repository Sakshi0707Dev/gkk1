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
      select: false,          // never returned by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,           // allows multiple null values
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

    // ── Password Reset ────────────────────────────────────────────────────────
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    // ── OTP ───────────────────────────────────────────────────────────────────
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },

    // ── Refresh Tokens (rotation with family tracking) ─────────────────────
    refreshTokens: {
      type: [String],
      select: false,
      default: [],
    },
  },
  { timestamps: true }
);

// ─── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: compare passwords ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ─── Safe public projection ───────────────────────────────────────────────────
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
