import { useState, useEffect } from 'react';
import { BarChart2, Calendar, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { bookingsAPI } from '../../api/bookings';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const techNav = [
  { path: '/technician', label: 'Dashboard & Jobs', icon: BarChart2 },
];

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = () => {
    setIsLoading(true);
    bookingsAPI.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, { status });
      toast.success(`Job ${status.replace('_', ' ')}!`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    }
  };

  const active = bookings.filter(b => ['assigned', 'in_progress'].includes(b.status));
  const completed = bookings.filter(b => b.status === 'completed');

  return (
    <DashboardLayout navItems={techNav} title="Technician Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome, {user?.full_name}! 🔧</h2>
          <p className="text-xs text-gray-500 mt-0.5">Your assigned field jobs and completion tracking</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4"><span className="text-xs text-gray-500">Total Assigned</span><p className="text-2xl font-bold mt-1">{bookings.length}</p></div>
          <div className="card p-4"><span className="text-xs text-orange-600">Active Jobs</span><p className="text-2xl font-bold text-orange-600 mt-1">{active.length}</p></div>
          <div className="card p-4"><span className="text-xs text-emerald-600">Completed</span><p className="text-2xl font-bold text-emerald-600 mt-1">{completed.length}</p></div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-sm text-gray-900">Assigned Jobs</h3></div>
          {isLoading ? (
            <div className="p-12 flex justify-center"><LoadingSpinner /></div>
          ) : bookings.length === 0 ? (
            <div className="p-6"><EmptyState title="No jobs assigned" description="Your provider will assign you jobs when bookings come in." /></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map(b => (
                <div key={b.id} className="p-4 hover:bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-900">{b.booking_number}</p>
                        <Badge status={b.status} />
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(b.scheduled_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(b.scheduled_date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.address}, {b.city} - {b.pincode}</span>
                      </div>
                      {b.notes && <p className="mt-1.5 text-xs text-gray-400 italic">Note: {b.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-gray-900">₹{Number(b.amount).toLocaleString('en-IN')}</span>
                      {b.status === 'assigned' && (
                        <button onClick={() => handleStatus(b.id, 'in_progress')} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-semibold cursor-pointer">Start</button>
                      )}
                      {b.status === 'in_progress' && (
                        <button onClick={() => handleStatus(b.id, 'completed')} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold cursor-pointer flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

