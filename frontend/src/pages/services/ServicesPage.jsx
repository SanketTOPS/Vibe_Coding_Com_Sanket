import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, IndianRupee, Clock, ShieldCheck, Calendar, MapPin, CheckCircle2, Loader2, Info } from 'lucide-react';
import { servicesAPI, categoriesAPI } from '../../api/services';
import { bookingsAPI } from '../../api/bookings';
import { paymentsAPI } from '../../api/payments';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  // Booking Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    scheduled_date: '',
    address: '',
    city: 'Mumbai',
    pincode: '400001',
    notes: '',
  });

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    categoriesAPI.list()
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const params = { search: search || undefined };
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) params.category_id = cat.id;
    }
    servicesAPI.list(params)
      .then(r => setServices(r.data))
      .catch(() => setError('Unable to load services from backend.'))
      .finally(() => setIsLoading(false));
  }, [search, selectedCategory, categories]);

  const handleBookClick = (service) => {
    if (!user) {
      toast('Please log in to book a service', { icon: '🔒' });
      navigate('/login', { state: { from: { pathname: '/services' } } });
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only customers can book services.');
      return;
    }
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.scheduled_date || !bookingForm.address) {
      toast.error('Please fill in schedule date and service address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create Booking in Backend
      const bookingRes = await bookingsAPI.create({
        service_id: selectedService.id,
        scheduled_date: new Date(bookingForm.scheduled_date).toISOString(),
        address: bookingForm.address,
        city: bookingForm.city,
        pincode: bookingForm.pincode,
        notes: bookingForm.notes || undefined,
      });

      const booking = bookingRes.data;
      toast.success(`Booking ${booking.booking_number} created!`);
      setIsBookingOpen(false);

      // 2. Redirect to customer bookings to view status & trigger payment
      navigate('/customer');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 flex-1">
      <div className="bg-white border-b border-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Explore Home Services</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Book upfront priced, guaranteed repairs & maintenance</p>

          <div className="mt-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services (e.g. AC, wiring, cleaning)..."
                className="input-field pl-10 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Pill Scroller */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSearchParams({})}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                !selectedCategory ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.slug })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.slug ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {isLoading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : services.length === 0 ? (
          <EmptyState
            title="No services match your search"
            description="Try choosing another category or clearing search terms."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{service.name}</h3>
                    <span className="inline-flex items-center gap-1 text-primary-700 font-extrabold text-base whitespace-nowrap">
                      <IndianRupee className="h-4 w-4" />
                      {Number(service.base_price).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3">{service.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-gray-400" /> ~{service.duration_hours} Hour(s)</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium"><ShieldCheck className="h-3.5 w-3.5" /> Guaranteed</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/services/${service.id}`}
                      className="btn-secondary flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Info className="h-3.5 w-3.5" /> Details
                    </Link>
                    <button
                      onClick={() => handleBookClick(service)}
                      className="btn-primary flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title={`Book ${selectedService?.name || 'Service'}`}
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div className="p-3 bg-primary-50 rounded-lg flex items-center justify-between text-sm">
            <span className="text-gray-700">Estimated Total:</span>
            <span className="font-extrabold text-primary-700 flex items-center">
              <IndianRupee className="h-4 w-4" />
              {Number(selectedService?.base_price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Service Schedule Date & Time</label>
            <input
              type="datetime-local"
              required
              className="input-field text-sm"
              value={bookingForm.scheduled_date}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduled_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">House / Flat Address</label>
            <textarea
              required
              rows={2}
              className="input-field text-sm"
              placeholder="Flat 302, Palm Residency, Near Link Road..."
              value={bookingForm.address}
              onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                className="input-field text-sm"
                value={bookingForm.city}
                onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                className="input-field text-sm"
                value={bookingForm.pincode}
                onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Instructions for Technician (Optional)</label>
            <input
              type="text"
              className="input-field text-sm"
              placeholder="e.g. Please bring an extension cord or ladder"
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
          >
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming Booking...</> : 'Confirm & Proceed'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

