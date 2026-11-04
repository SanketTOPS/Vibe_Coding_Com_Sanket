import { useState, useEffect } from 'react';
import { Users, ShoppingBag, TrendingUp, Clock, BarChart2, List, CheckCircle2, ShieldCheck, XCircle, UserCheck } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { adminAPI } from '../../api/admin';
import { categoriesAPI } from '../../api/services';
import { bookingsAPI } from '../../api/bookings';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const adminNav = [
  { path: '/admin', label: 'Analytics', icon: BarChart2 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/bookings', label: 'Bookings', icon: ShoppingBag },
  { path: '/admin/categories', label: 'Categories', icon: List },
];

const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [sRes, uRes, bRes, cRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.listUsers(),
        bookingsAPI.getAll(),
        categoriesAPI.list(),
      ]);
      if (sRes.status === 'fulfilled') setStats(sRes.value.data);
      if (uRes.status === 'fulfilled') setUsers(uRes.value.data);
      if (bRes.status === 'fulfilled') setAllBookings(bRes.value.data);
      if (cRes.status === 'fulfilled') setCategories(cRes.value.data);
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggleUser = async (userId) => {
    try {
      const res = await adminAPI.toggleUserStatus(userId);
      toast.success(res.data.message);
      fetchAll();
    } catch { toast.error('Failed to toggle user status'); }
  };

  const handleVerifyProvider = async (providerId) => {
    try {
      await adminAPI.verifyProvider(providerId);
      toast.success('Provider verified!');
      fetchAll();
    } catch { toast.error('Failed to verify'); }
  };

  if (isLoading) return (
    <DashboardLayout navItems={adminNav} title="Super Admin">
      <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
    </DashboardLayout>
  );

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Bookings', value: stats?.total_bookings || 0, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending', value: stats?.pending_bookings || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const barData = [
    { name: 'Customers', count: stats?.total_customers || 0 },
    { name: 'Providers', count: stats?.total_providers || 0 },
    { name: 'Completed', count: stats?.completed_bookings || 0 },
    { name: 'Pending', count: stats?.pending_bookings || 0 },
  ];

  const pieData = [
    { name: 'Customers', value: stats?.total_customers || 0 },
    { name: 'Providers', value: stats?.total_providers || 0 },
  ];

  return (
    <DashboardLayout navItems={adminNav} title="Super Admin Dashboard">
      <div className="space-y-6">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200">
          {['overview', 'users', 'bookings', 'categories'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-semibold capitalize cursor-pointer ${activeTab === tab ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map(c => (
                <div key={c.label} className="card">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                      <c.icon className={`h-5 w-5 ${c.color}`} />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-gray-900">{c.value}</p>
                      <p className="text-xs text-gray-500">{c.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-bold text-sm text-gray-900 mb-4">Platform Metrics</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 className="font-bold text-sm text-gray-900 mb-4">User Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-sm">All Platform Users ({users.length})</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 border-b text-[10px] uppercase tracking-wider">
                  <tr><th className="p-3 pl-5">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3 pr-5 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="p-3 pl-5 font-semibold text-gray-900">{u.full_name}</td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3"><Badge status={u.role === 'super_admin' ? 'info' : u.role === 'provider' ? 'assigned' : 'completed'}>{u.role.replace('_',' ')}</Badge></td>
                      <td className="p-3"><Badge status={u.is_active ? 'completed' : 'cancelled'}>{u.is_active ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="p-3 pr-5 text-right">
                        <button onClick={() => handleToggleUser(u.id)} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-semibold hover:bg-gray-200 cursor-pointer">
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-sm">All Bookings ({allBookings.length})</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 border-b text-[10px] uppercase tracking-wider">
                  <tr><th className="p-3 pl-5">Booking #</th><th className="p-3">Scheduled</th><th className="p-3">City</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3 pr-5">Paid</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allBookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3 pl-5 font-semibold text-gray-900">{b.booking_number}</td>
                      <td className="p-3">{new Date(b.scheduled_date).toLocaleDateString()}</td>
                      <td className="p-3">{b.city}</td>
                      <td className="p-3 font-bold">₹{Number(b.amount).toLocaleString('en-IN')}</td>
                      <td className="p-3"><Badge status={b.status} /></td>
                      <td className="p-3 pr-5"><Badge status={b.is_paid ? 'paid' : 'pending'}>{b.is_paid ? 'Yes' : 'No'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-sm">Service Categories ({categories.length})</h3></div>
            <div className="divide-y divide-gray-100">
              {categories.map(c => (
                <div key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.description}</p>
                  </div>
                  <Badge status={c.is_active ? 'completed' : 'cancelled'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

