import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

// ✅ UPDATED: now points to /api/auth
const API_URL = 'http://localhost:5000/api/auth';

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

// Initials avatar — same green circle style used in Header
const Avatar = ({ name = '', size = 9 }) => {
    const parts = name.trim().split(' ');
    const initials = parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    return (
        <div
            className={`w-${size} h-${size} rounded-full bg-agri-green text-white flex items-center justify-center font-bold text-sm select-none shrink-0`}
        >
            {initials}
        </div>
    );
};

// Saved google accounts (simulates browser-stored accounts like real Google picker)
const GOOGLE_ACCOUNTS = [
    { id: 'g1', name: 'Sakshi Gawande', email: 'sakshig1606@gmail.com', provider: 'google' },
    { id: 'g2', name: 'Gawande Admin', email: 'admin@gawandekrushi.com', provider: 'google' },
];

// ─── Client-side validation ───────────────────────────────────────────────────
const validateForm = (view, formData) => {
    const { name, email, password } = formData;
    if (view === 'register' && (!name || name.trim().length < 2)) {
        return 'Name must be at least 2 characters.';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address.';
    }
    if (view !== 'forgot' && (!password || password.length < 6)) {
        return 'Password must be at least 6 characters.';
    }
    return null;
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    // view: 'login' | 'register' | 'forgot' | 'google_picker'
    const [view, setView] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pickerLoading, setPickerLoading] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    if (!isOpen) return null;

    /* ── helpers ── */
    const switchView = (next) => {
        setView(next);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    const finishLogin = (user) => {
        setSuccessMsg(`Welcome${user.name ? ', ' + user.name.split(' ')[0] : ''}!`);
        setSuccess(true);
        setTimeout(() => {
            onLoginSuccess(user);
            onClose();
            // reset
            setSuccess(false); setSuccessMsg('');
            setIsLoading(false); setPickerLoading(null);
            setError(''); setView('login');
            setFormData({ name: '', email: '', password: '' });
        }, 1400);
    };

    /* ── Email / password form submit ── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm(view, formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const epMap = { login: '/login', register: '/register', forgot: '/forgot-password' };
            const plMap = {
                login: { email: formData.email, password: formData.password },
                register: { name: formData.name.trim(), email: formData.email, password: formData.password },
                forgot: { email: formData.email },
            };
            const res = await axios.post(`${API_URL}${epMap[view]}`, plMap[view]);

            if (view === 'forgot') {
                setSuccessMsg(res.data.message || 'A reset link has been sent to your email address.');
                setSuccess(true);
                setTimeout(() => { setSuccess(false); setIsLoading(false); setView('login'); }, 3000);
                return;
            }

            // ✅ UPDATED: response is now inside res.data.data
            const { accessToken, user } = res.data.data;
            localStorage.setItem('agri_token', accessToken);
            localStorage.setItem('agri_user', JSON.stringify(user));
            finishLogin(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    /* ── Google account picker: select an account ── */
    const handleSelectAccount = (account) => {
        setPickerLoading(account.id);
        setTimeout(() => {
            const user = { ...account };
            localStorage.setItem('agri_token', 'google_token_' + Date.now());
            localStorage.setItem('agri_user', JSON.stringify(user));
            finishLogin(user);
        }, 900);
    };

    /* ── derived ── */
    const headerMap = {
        login: { title: 'Welcome Back!', sub: 'Sign in to Gawande Krushi' },
        register: { title: 'Create Account', sub: 'Join the Krushi community' },
        forgot: { title: 'Reset Password', sub: "We'll send a reset link to your email" },
        google_picker: { title: 'Choose an account', sub: 'to continue to Gawande Krushi' },
    };
    const { title, sub } = headerMap[view];
    const isGoogle = view === 'google_picker';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ══ HEADER BANNER ══ */}
                <div className={`relative flex flex-col items-center justify-center py-8 px-6 ${isGoogle ? 'bg-white border-b border-gray-100' : 'bg-agri-green'}`}>
                    {!isGoogle && !success && (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10 pointer-events-none" />
                    )}

                    {/* Success animation */}
                    {success && !isGoogle && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <CheckCircle2 size={52} className="text-white animate-bounce" />
                            <p className="text-white text-xl font-bold">{successMsg}</p>
                        </div>
                    )}

                    {/* Logo / Google G */}
                    {!success && (
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            {isGoogle ? (
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </div>
                            ) : (
                                <img src="/logo.png.jpeg" alt="Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1 shadow" />
                            )}
                            <h2 className={`text-xl font-bold ${isGoogle ? 'text-gray-800' : 'text-white'}`}>{title}</h2>
                            <p className={`text-sm ${isGoogle ? 'text-gray-500' : 'text-white/80'}`}>{sub}</p>
                        </div>
                    )}

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all ${isGoogle ? 'text-gray-400 hover:bg-gray-100' : 'text-white/70 hover:bg-white/15'}`}
                    >
                        <X size={18} />
                    </button>

                    {/* Back arrow (google_picker) */}
                    {isGoogle && (
                        <button
                            onClick={() => switchView('login')}
                            className="absolute top-3 left-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                </div>

                {/* ══ BODY ══ */}
                {!success && (
                    <div className="px-7 py-6">
                        {isGoogle ? (
                            /* ── Google account picker ── */
                            <div className="space-y-3">
                                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                                    {GOOGLE_ACCOUNTS.map((account) => (
                                        <button
                                            key={account.id}
                                            onClick={() => handleSelectAccount(account)}
                                            disabled={!!pickerLoading}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left disabled:opacity-60"
                                        >
                                            <Avatar name={account.name} size={9} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{account.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{account.email}</p>
                                            </div>
                                            {pickerLoading === account.id
                                                ? <Loader2 size={16} className="text-agri-green animate-spin shrink-0" />
                                                : <ChevronRight size={16} className="text-gray-300 shrink-0" />
                                            }
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => switchView('login')}
                                        disabled={!!pickerLoading}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left disabled:opacity-60"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-600">Use another account</p>
                                        <ChevronRight size={16} className="text-gray-300 ml-auto shrink-0" />
                                    </button>
                                </div>

                                <p className="text-[11px] text-gray-400 leading-relaxed px-1">
                                    To continue, Google will share your name, email address, language preference, and profile picture with Gawande Krushi Kendra. See Google's{' '}
                                    <span className="underline cursor-pointer">Privacy Policy</span> and{' '}
                                    <span className="underline cursor-pointer">Terms of Service</span>.
                                </p>
                            </div>

                        ) : (
                            /* ── Main form ── */
                            <div className="space-y-4">
                                <form onSubmit={handleSubmit} className="space-y-4">

                                    {/* Name — register only */}
                                    {view === 'register' && (
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text" name="name" required autoComplete="name"
                                                    placeholder="Your full name"
                                                    value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setError(''); }}
                                                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green/25 focus:border-agri-green outline-none transition-all placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="email" name="email" required autoComplete="email"
                                                placeholder="Enter email"
                                                value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(''); }}
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green/25 focus:border-agri-green outline-none transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    {view !== 'forgot' && (
                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-[13px] font-semibold text-gray-700">Password</label>
                                                {view === 'login' && (
                                                    <button type="button" onClick={() => switchView('forgot')}
                                                        className="text-[12px] font-semibold text-agri-green hover:underline">
                                                        Forgot password?
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'} name="password" required
                                                    autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                                                    placeholder="Enter password (min. 6 characters)"
                                                    value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
                                                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green/25 focus:border-agri-green outline-none transition-all placeholder:text-gray-400"
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">{error}</p>
                                    )}

                                    {/* CTA */}
                                    <button
                                        type="submit" disabled={isLoading}
                                        className="w-full py-2.5 bg-agri-orange hover:bg-orange-500 active:bg-orange-600 text-white text-sm font-bold rounded-lg shadow-sm shadow-orange-300 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {isLoading
                                            ? <Loader2 className="animate-spin" size={18} />
                                            : view === 'login' ? 'Sign In'
                                                : view === 'register' ? 'Create your account'
                                                    : 'Send reset link'
                                        }
                                    </button>

                                    {/* Terms notice — register only */}
                                    {view === 'register' && (
                                        <p className="text-[11px] text-gray-400 leading-relaxed">
                                            By creating an account, you agree to Gawande Krushi Kendra's{' '}
                                            <span className="text-agri-green underline cursor-pointer">Conditions of Use</span> and{' '}
                                            <span className="text-agri-green underline cursor-pointer">Privacy Notice</span>.
                                        </p>
                                    )}
                                </form>

                                {/* Divider */}
                                {view !== 'forgot' && (
                                    <>
                                        <div className="flex items-center gap-3 py-1">
                                            <div className="flex-1 border-t border-gray-200" />
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">or</span>
                                            <div className="flex-1 border-t border-gray-200" />
                                        </div>

                                        {/* Google button */}
                                        <button
                                            onClick={() => switchView('google_picker')}
                                            className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2.5 shadow-sm"
                                        >
                                            <GoogleIcon />
                                            Continue with Google
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ══ FOOTER ══ */}
                {!success && !isGoogle && (
                    <div className="px-7 pb-6 border-t border-gray-100 pt-4 text-center">
                        <p className="text-[12px] text-gray-500">
                            {view === 'login' ? (
                                <>New to Gawande Krushi?{' '}
                                    <button onClick={() => switchView('register')} className="text-agri-green font-bold hover:underline">
                                        Create an account
                                    </button>
                                </>
                            ) : view === 'register' ? (
                                <>Already have an account?{' '}
                                    <button onClick={() => switchView('login')} className="text-agri-green font-bold hover:underline">
                                        Sign in
                                    </button>
                                </>
                            ) : (
                                <>Remember your password?{' '}
                                    <button onClick={() => switchView('login')} className="text-agri-green font-bold hover:underline">
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginModal;