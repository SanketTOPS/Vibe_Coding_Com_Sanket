import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Star, ShieldCheck, CheckCircle2,
  AlertCircle, ChevronRight, Share2, Tag, ArrowLeft, PhoneCall
} from 'lucide-react';
import { servicesAPI } from '../../api/services';
import { reviewsAPI } from '../../api/reviews';
import { bookingsAPI } from '../../api/bookings';
import { StarRating } from '../../components/ui/StarRating';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    scheduled_date: '',
    address: user?.address || '',
    city: user?.city || 'Mumbai',
    pincode: user?.pincode || '400001',
    notes: '',
  });

  useEffect(() => {
    setIsLoading(true);
    servicesAPI.getById(id)
      .then(async (res) => {
        setService(res.data);
        if (res.data.provider_id) {
          try {
            const revRes = await reviewsAPI.getByProvider(res.data.provider_id);
            setReviews(revRes.data);
          } catch {
            setReviews([]);
          }
        }
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load service details');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in as a customer to book this service');
      navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only customer accounts can place bookings');
      return;
    }

    if (!bookingForm.scheduled_date) {
      toast.error('Please select an appointment date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingsAPI.create({
        service_id: Number(id),
        scheduled_date: new Date(bookingForm.scheduled_date).toISOString(),
        address: bookingForm.address,
        city: bookingForm.city,
        pincode: bookingForm.pincode,
        notes: bookingForm.notes || undefined,
      });

      toast.success('Service booked successfully!');
      setIsBookingOpen(false);
      navigate('/customer');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-600 text-sm mb-6">{error || "The service you requested could not be located."}</p>
        <Link to="/services" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to All Services
        </Link>
      </div>
    );
  }

  const tagsList = service.tags ? service.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/services" className="hover:text-primary-600">Services</Link>
        <ChevronRight className="h-3 w-3" />
        {service.category && (
          <>
            <span className="text-gray-700 font-medium">{service.category.name}</span>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-gray-900 font-semibold truncate max-w-xs">{service.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {service.category && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
                  {service.category.name}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Professional
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {service.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1 border-t border-gray-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-primary-600" /> Approx. {service.duration_hours} hour{service.duration_hours > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <StarRating rating={service.provider?.rating || 4.8} size="sm" />
                <span className="text-gray-800 font-semibold">{service.provider?.rating || 4.8}</span>
                <span className="text-gray-400">({service.provider?.total_reviews || reviews.length || 0} reviews)</span>
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Description & Scope</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {service.description || "Comprehensive on-site home service provided by licensed, background-checked professionals using standard tools and industry safety standards."}
              </p>
            </div>

            {/* Highlights */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm mb-3">What's Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Free 30-day post-service warranty
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Background-verified technician
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Transparent rate without hidden fees
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Secure online or cash payment
                </li>
              </ul>
            </div>

            {tagsList.length > 0 && (
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gray-400 mr-1" />
                {tagsList.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">Customer Feedback</h3>
              <span className="text-xs text-gray-500">{reviews.length} total rating{reviews.length !== 1 ? 's' : ''}</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4">No reviews yet for this provider. Be the first customer to book and leave feedback!</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <StarRating rating={rev.rating} size="sm" />
                      <span className="text-[11px] text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-gray-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div className="space-y-6">
          <div className="card p-6 space-y-5 sticky top-20 border-primary-100 shadow-md">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Standard Rate</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{Number(service.base_price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500">/ {service.price_unit}</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Includes all service inspection charges</p>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn-primary w-full py-3 text-sm font-semibold tracking-wide shadow-sm"
            >
              Book This Service
            </button>

            {/* Provider Info Card */}
            {service.provider && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Service Provider</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    {service.provider.business_name}
                    {service.provider.is_verified && (
                      <ShieldCheck className="h-4 w-4 text-primary-600" title="Verified Provider" />
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {service.provider.business_description || "Professional service vendor registered on HomeServe."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <span className="text-gray-400 block">Experience</span>
                    <span className="font-semibold text-gray-800">{service.provider.years_experience} years</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Service Area</span>
                    <span className="font-semibold text-gray-800 truncate block">{service.provider.service_area || "Citywide"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title={`Book Appointment: ${service.name}`}
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Preferred Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              className="input-field text-xs"
              value={bookingForm.scheduled_date}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduled_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Apartment, building, street, landmark..."
              className="input-field text-xs"
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
                className="input-field text-xs"
                value={bookingForm.city}
                onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                className="input-field text-xs"
                value={bookingForm.pincode}
                onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Special Instructions / Notes</label>
            <input
              type="text"
              placeholder="e.g. Please bring extra 15A fuses or ladder"
              className="input-field text-xs"
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
            />
          </div>

          {/* Pricing Summary */}
          <div className="bg-primary-50/50 p-3 rounded-lg border border-primary-100 flex justify-between items-center text-xs">
            <div>
              <span className="font-semibold text-gray-800">Total Payable</span>
              <span className="text-[10px] text-gray-500 block">Pay online or on completion</span>
            </div>
            <span className="text-base font-extrabold text-primary-700">
              ₹{Number(service.base_price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-xs font-semibold"
          >
            {isSubmitting ? 'Confirming Appointment...' : 'Confirm Booking'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
