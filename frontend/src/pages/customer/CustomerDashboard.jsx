import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plus, IndianRupee, CreditCard, Star, CheckCircle2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { bookingsAPI } from '../../api/bookings';
import { paymentsAPI } from '../../api/payments';
import { reviewsAPI } from '../../api/reviews';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { openRazorpayCheckout } from '../../utils/razorpay';
import toast from 'react-hot-toast';

const customerNav = [
  { path: '/customer', label: 'My Bookings & Overview', icon: Calendar },
  { path: '/services', label: 'Book New Service', icon: Plus },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Payment Mock/Test State
  const [payingBookingId, setPayingBookingId] = useState(null);

  const fetchBookings = () => {
    setIsLoading(true);
    bookingsAPI.getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePay = async (booking) => {
    setPayingBookingId(booking.id);
    try {
      const orderRes = await paymentsAPI.createOrder({ booking_id: booking.id });
      const { order_id, amount, currency } = orderRes.data;

      await openRazorpayCheckout({
        orderId: order_id,
        amount: amount / 100, // paise to rupees
        currency: currency || 'INR',
        name: 'HomeServe',
        description: `Booking payment #${booking.booking_number}`,
        user: user,
        onSuccess: async (paymentData) => {
          try {
            await paymentsAPI.verify({
              razorpay_order_id: paymentData.razorpay_order_id,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_signature: paymentData.razorpay_signature,
            });
            toast.success('Payment completed & verified!');
            fetchBookings();
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.detail || 'Payment verification failed');
          } finally {
            setPayingBookingId(null);
          }
        },
        onError: async (errMsg) => {
          console.warn('Payment failed/dismissed:', errMsg);
          toast.error(typeof errMsg === 'string' ? errMsg : 'Payment could not be completed.');
          setPayingBookingId(null);
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to initiate payment.');
      setPayingBookingId(null);
    }
  };

  const handleOpenReview = (booking) => {
    setReviewBooking(booking);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setIsSubmittingReview(true);
    try {
      await reviewsAPI.create({
        booking_id: reviewBooking.id,
        rating,
        comment: comment || undefined,
      });
      toast.success('Thank you for rating your service!');
      setReviewBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const completed = bookings.filter(b => b.status === 'completed').length;
  const inProgress = bookings.filter(b => b.status === 'in_progress').length;
  const pending = bookings.filter(b => b.status === 'pending').length;

  return (
    <DashboardLayout navItems={customerNav} title="Customer Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome, {user?.full_name}! 👋</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your service appointments, invoices and ratings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <span className="text-xs text-gray-500 font-medium">Total Bookings</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">{bookings.length}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-yellow-600 font-medium">Pending Acceptance</span>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{pending}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-orange-600 font-medium">In Progress</span>
            <p className="text-2xl font-bold text-orange-600 mt-1">{inProgress}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs text-emerald-600 font-medium">Completed</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{completed}</p>
          </div>
        </div>

        {/* Bookings Table / List */}
        <div className="card p-0 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">All Bookings</h3>
            <Link to="/services" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Book Another
            </Link>
          </div>

          {isLoading ? (
            <div className="p-12 flex justify-center"><LoadingSpinner /></div>
          ) : bookings.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No service bookings found"
                description="Browse our verified home service technicians to get started."
                action={<Link to="/services" className="btn-primary text-xs">Browse Services</Link>}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Booking #</th>
                    <th className="p-3.5">Schedule</th>
                    <th className="p-3.5">Address</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 pl-5 font-semibold text-gray-900">{b.booking_number}</td>
                      <td className="p-3.5">
                        {new Date(b.scheduled_date).toLocaleDateString()} {new Date(b.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 max-w-xs truncate" title={b.address}>
                        {b.address}, {b.city}
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        ₹{Number(b.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <Badge status={b.status} />
                      </td>
                      <td className="p-3.5">
                        <Badge status={b.is_paid ? 'paid' : 'pending'}>
                          {b.is_paid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </td>
                      <td className="p-3.5 pr-5 text-right space-x-2">
                        {!b.is_paid && b.status !== 'cancelled' && (
                          <button
                            onClick={() => handlePay(b)}
                            disabled={payingBookingId === b.id}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold hover:bg-emerald-100 cursor-pointer"
                          >
                            Pay Online
                          </button>
                        )}
                        {b.status === 'completed' && (
                          <button
                            onClick={() => handleOpenReview(b)}
                            className="px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded text-[11px] font-semibold hover:bg-yellow-100 cursor-pointer"
                          >
                            ★ Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        title={`Review Service (${reviewBooking?.booking_number})`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Service Quality Rating</label>
            <StarRating
              rating={rating}
              size="lg"
              interactive={true}
              onChange={(newRating) => setRating(newRating)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Feedback Comments</label>
            <textarea
              rows={3}
              className="input-field text-sm"
              placeholder="Tell us about the technician's punctuality, work quality, and behavior..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="btn-primary w-full py-2 text-xs font-semibold"
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

