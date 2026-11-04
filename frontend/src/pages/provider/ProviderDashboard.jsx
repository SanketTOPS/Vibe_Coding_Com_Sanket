import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Package, Calendar, Star, Users, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { bookingsAPI } from '../../api/bookings';
import { providersAPI } from '../../api/providers';
import { servicesAPI } from '../../api/services';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const providerNav = [
  { path: '/provider', label: 'Dashboard', icon: BarChart2 },
  { path: '/provider/services', label: 'My Services', icon: Package },
  { path: '/provider/bookings', label: 'Bookings', icon: Calendar },
  { path: '/provider/technicians', label: 'Technicians', icon: Users },
];

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Add Service Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', base_price: '', duration_hours: 1 });
  const [isSubmittingSvc, setIsSubmittingSvc] = useState(false);

  // Add Technician Modal
  const [isAddTechOpen, setIsAddTechOpen] = useState(false);
  const [techForm, setTechForm] = useState({ email: '', full_name: '', password: 'Tech@12345', specialization: '' });
  const [isSubmittingTech, setIsSubmittingTech] = useState(false);

  // Create provider profile modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ business_name: '', business_description: '', years_experience: 1, service_area: '' });
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [bookRes, profRes] = await Promise.allSettled([
        bookingsAPI.getMyBookings(),
        providersAPI.getMyProfile(),
      ]);
      if (bookRes.status === 'fulfilled') setBookings(bookRes.value.data);
      if (profRes.status === 'fulfilled') {
        setProfile(profRes.value.data);
        // Fetch services and technicians only if profile exists
        const [svcRes, techRes] = await Promise.allSettled([
          servicesAPI.list({}),
          providersAPI.getMyTechnicians(),
        ]);
        if (svcRes.status === 'fulfilled') {
          setMyServices(svcRes.value.data.filter(s => s.provider_id === profRes.value.data.id));
        }
        if (techRes.status === 'fulfilled') setTechnicians(techRes.value.data);
      } else {
        setProfile(null);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setIsCreatingProfile(true);
    try {
      const res = await providersAPI.createProfile(profileForm);
      setProfile(res.data);
      setIsProfileModalOpen(false);
      toast.success('Provider profile created!');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create profile');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsSubmittingSvc(true);
    try {
      await servicesAPI.create({ ...serviceForm, base_price: parseFloat(serviceForm.base_price) });
      toast.success('Service added!');
      setIsAddServiceOpen(false);
      setServiceForm({ name: '', description: '', base_price: '', duration_hours: 1 });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add service');
    } finally {
      setIsSubmittingSvc(false);
    }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    setIsSubmittingTech(true);
    try {
      await providersAPI.addTechnician(techForm);
      toast.success('Technician added!');
      setIsAddTechOpen(false);
      setTechForm({ email: '', full_name: '', password: 'Tech@12345', specialization: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add technician');
    } finally {
      setIsSubmittingTech(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, { status });
      toast.success(`Booking ${status}!`);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update');
    }
  };

  if (isLoading) return (
    <DashboardLayout navItems={providerNav} title="Provider Dashboard">
      <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
    </DashboardLayout>
  );

  // If no provider profile, prompt creation
  if (!profile) return (
    <DashboardLayout navItems={providerNav} title="Provider Dashboard">
      <div className="max-w-lg mx-auto mt-12">
        <EmptyState
          title="Create Your Provider Profile"
          description="Set up your business profile to start listing services and receiving bookings."
          action={<button onClick={() => setIsProfileModalOpen(true)} className="btn-primary text-xs">Create Provider Profile</button>}
        />
      </div>
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Create Provider Profile">
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Business Name</label>
            <input required className="input-field text-sm" value={profileForm.business_name} onChange={e => setProfileForm({...profileForm, business_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea className="input-field text-sm" rows={2} value={profileForm.business_description} onChange={e => setProfileForm({...profileForm, business_description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Years Experience</label>
              <input type="number" min={0} className="input-field text-sm" value={profileForm.years_experience} onChange={e => setProfileForm({...profileForm, years_experience: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Service Area</label>
              <input className="input-field text-sm" placeholder="e.g. Mumbai, Thane" value={profileForm.service_area} onChange={e => setProfileForm({...profileForm, service_area: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={isCreatingProfile} className="btn-primary w-full py-2 text-xs">{isCreatingProfile ? 'Creating...' : 'Create Profile'}</button>
        </form>
      </Modal>
    </DashboardLayout>
  );

  const completed = bookings.filter(b => b.status === 'completed').length;

  return (
    <DashboardLayout navItems={providerNav} title="Provider Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile.business_name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">⭐ {profile.rating.toFixed(1)} ({profile.total_reviews} reviews)</span>
              {profile.is_verified && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4"><span className="text-xs text-gray-500">Total Bookings</span><p className="text-2xl font-bold mt-1">{bookings.length}</p></div>
          <div className="card p-4"><span className="text-xs text-gray-500">Completed</span><p className="text-2xl font-bold text-emerald-600 mt-1">{completed}</p></div>
          <div className="card p-4"><span className="text-xs text-gray-500">Services Listed</span><p className="text-2xl font-bold text-primary-600 mt-1">{myServices.length}</p></div>
          <div className="card p-4"><span className="text-xs text-gray-500">Technicians</span><p className="text-2xl font-bold text-purple-600 mt-1">{technicians.length}</p></div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 border-b border-gray-200">
          {['overview', 'services', 'bookings', 'technicians'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-xs font-semibold capitalize transition-colors cursor-pointer ${activeTab === tab ? 'text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-sm text-gray-900">Incoming Bookings</h3></div>
            {bookings.length === 0 ? (
              <div className="p-6"><EmptyState title="No bookings yet" description="Add services to start receiving customer requests." /></div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookings.map(b => (
                  <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between hover:bg-gray-50/50">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{b.booking_number}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(b.scheduled_date).toLocaleDateString()} • {b.city} • ₹{Number(b.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge status={b.status} />
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold cursor-pointer">Accept</button>
                          <button onClick={() => handleUpdateBookingStatus(b.id, 'rejected')} className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-semibold cursor-pointer">Reject</button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'in_progress')} className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-semibold cursor-pointer">Start Work</button>
                      )}
                      {b.status === 'in_progress' && (
                        <button onClick={() => handleUpdateBookingStatus(b.id, 'completed')} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold cursor-pointer">Complete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {(activeTab === 'services') && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setIsAddServiceOpen(true)} className="btn-primary text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add Service</button>
            </div>
            {myServices.length === 0 ? (
              <EmptyState title="No services listed" description="Add your first service offering." action={<button onClick={() => setIsAddServiceOpen(true)} className="btn-primary text-xs">Add Service</button>} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {myServices.map(s => (
                  <div key={s.id} className="card">
                    <h4 className="font-bold text-sm text-gray-900">{s.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-primary-700">₹{Number(s.base_price).toLocaleString('en-IN')}</span>
                      <Badge status={s.is_active ? 'completed' : 'cancelled'}>{s.is_active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Technicians Tab */}
        {(activeTab === 'technicians') && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setIsAddTechOpen(true)} className="btn-primary text-xs flex items-center gap-1"><Plus className="h-3.5 w-3.5" /> Add Technician</button>
            </div>
            {technicians.length === 0 ? (
              <EmptyState title="No technicians yet" description="Add field technicians to assign bookings." action={<button onClick={() => setIsAddTechOpen(true)} className="btn-primary text-xs">Add Technician</button>} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {technicians.map(t => (
                  <div key={t.id} className="card flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                      {t.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{t.full_name}</p>
                      <p className="text-xs text-gray-500">{t.specialization || 'General'} • ⭐ {t.rating?.toFixed(1)} • {t.total_jobs} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isAddServiceOpen} onClose={() => setIsAddServiceOpen(false)} title="Add a New Service">
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name</label>
            <input required className="input-field text-sm" placeholder="e.g. AC Gas Refilling" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea className="input-field text-sm" rows={2} value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input type="number" required min={1} className="input-field text-sm" value={serviceForm.base_price} onChange={e => setServiceForm({...serviceForm, base_price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (hrs)</label>
              <input type="number" min={0.5} step={0.5} className="input-field text-sm" value={serviceForm.duration_hours} onChange={e => setServiceForm({...serviceForm, duration_hours: parseFloat(e.target.value)})} />
            </div>
          </div>
          <button type="submit" disabled={isSubmittingSvc} className="btn-primary w-full py-2 text-xs">{isSubmittingSvc ? 'Adding...' : 'Add Service'}</button>
        </form>
      </Modal>

      {/* Add Technician Modal */}
      <Modal isOpen={isAddTechOpen} onClose={() => setIsAddTechOpen(false)} title="Add a Technician">
        <form onSubmit={handleAddTech} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input required className="input-field text-sm" value={techForm.full_name} onChange={e => setTechForm({...techForm, full_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input type="email" required className="input-field text-sm" value={techForm.email} onChange={e => setTechForm({...techForm, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
            <input className="input-field text-sm" placeholder="e.g. AC Repair, Plumbing" value={techForm.specialization} onChange={e => setTechForm({...techForm, specialization: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Default Password</label>
            <input className="input-field text-sm" value={techForm.password} onChange={e => setTechForm({...techForm, password: e.target.value})} />
          </div>
          <button type="submit" disabled={isSubmittingTech} className="btn-primary w-full py-2 text-xs">{isSubmittingTech ? 'Adding...' : 'Add Technician'}</button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

