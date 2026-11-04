export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({
  orderId,
  amount,
  currency = 'INR',
  name = 'HomeServe SaaS',
  description = 'Home Service Booking Payment',
  user,
  onSuccess,
  onError,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError('Failed to load Razorpay SDK. Please check your internet connection.');
    return;
  }

  const key = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_homeserve_demo';

  const options = {
    key: key,
    amount: Math.round(Number(amount) * 100), // amount in paise
    currency: currency,
    name: name,
    description: description,
    order_id: orderId,
    prefill: {
      name: user?.full_name || '',
      email: user?.email || '',
      contact: (user?.phone || '9999999999').replace(/[^0-9]/g, '').slice(-10),
    },
    theme: {
      color: '#e11d48', // red-rose theme
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onError) onError('Payment cancelled by user');
      },
      escape: true,
      backdropclose: false
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onError) {
        onError(response.error.description || 'Payment failed');
      }
    });
    rzp.open();
  } catch (err) {
    if (onError) onError(err.message || 'Error opening payment checkout');
  }
};

