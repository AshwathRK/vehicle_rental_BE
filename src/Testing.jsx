import React, { useState } from 'react';
import axios from 'axios';

const PaymentButton = ({ bookingPrice }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1️⃣ Create order on backend with dynamic amount
      const { data: order } = await axios.post(
        'http://localhost:3000/api/payment/order',
        { amount: bookingPrice }, // dynamic from props or state
        { withCredentials: true }
      );

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Vehicle Rent Zone',
        description: `Payment for booking worth ₹${bookingPrice}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            'http://localhost:3000/api/payment/verify',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          if (verifyRes.data.success) {
            alert('✅ Payment successful!');
          } else {
            alert('❌ Payment verification failed!');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9876543210',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${bookingPrice}`}
    </button>
  );
};

export default PaymentButton;
