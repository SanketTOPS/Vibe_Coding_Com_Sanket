import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Wrench, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.full_name}!`);
      const from = location.state?.from?.pathname;
      const dashboardMap = {
        super_admin: '/admin',
        customer: '/customer',
        provider: '/provider',
        technician: '/technician',
      };
      navigate(from || dashboardMap[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demos = {
      admin: { email: 'admin@homeserve.com', password: 'Admin@123' },
      customer: { email: 'customer@homeserve.com', password: 'Customer@123' },
      provider: { email: 'provider@homeserve.com', password: 'Provider@123' },
      technician: { email: 'technician@homeserve.com', password: 'Tech@12345' },
    };
    setForm(demos[role]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white">
              <Wrench className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              HomeServe
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="text-xs text-gray-500 mt-1">Access bookings, service tracking & dashboards</p>
        </div>

        <div className="card">
          <div className="mb-5 p-3 bg-primary-50/60 rounded-xl border border-primary-100">
            <p className="text-xs font-semibold text-primary-900 mb-2">Quick 1-Click Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('customer')}
                className="text-xs py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 font-medium text-left"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('provider')}
                className="text-xs py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 font-medium text-left"
              >
                🏢 Provider
              </button>
              <button
                type="button"
                onClick={() => fillDemo('technician')}
                className="text-xs py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 font-medium text-left"
              >
                🔧 Technician
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="text-xs py-1.5 px-2 bg-white rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 font-medium text-left"
              >
                ⚡ Super Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="input-field text-sm"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field text-sm pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm"
            >
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

