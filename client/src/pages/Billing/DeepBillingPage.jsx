import { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  FileText,
  Gift,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Stripe Publishable Key (replace with your own)
const stripePromise = loadStripe('your-publishable-key-here');

// Mock data for packages
const packages = [
  {
    id: 1,
    name: 'Basic Plan',
    price: '$19/month',
    features: [
      'Up to 3 elderly profiles',
      'Medication reminders',
      'Health logs',
      'Basic support',
    ],
    bestValue: false,
  },
  {
    id: 2,
    name: 'Premium Plan',
    price: '$49/month',
    features: [
      'Unlimited elderly profiles',
      'Advanced health tracking',
      'Emergency alerts',
      'Priority support',
      'Customizable reminders',
    ],
    bestValue: true,
  },
  {
    id: 3,
    name: 'Family Plan',
    price: '$99/month',
    features: [
      'Up to 10 elderly profiles',
      'Family sharing',
      'Advanced analytics',
      '24/7 support',
      'Custom reports',
    ],
    bestValue: false,
  },
];

// Mock data for invoices
const invoices = [
  { id: 1, date: '2023-10-01', amount: '$49.00', status: 'Paid' },
  { id: 2, date: '2023-09-01', amount: '$49.00', status: 'Paid' },
  { id: 3, date: '2023-08-01', amount: '$49.00', status: 'Paid' },
];

// Payment Form Component
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setPaymentError(error.message);
      setPaymentSuccess(false);
    } else {
      setPaymentError(null);
      setPaymentSuccess(true);
      console.log('Payment Method:', paymentMethod);
      // Handle payment success (e.g., send to backend)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <CardElement className="p-4 border rounded-lg" />
      </div>
      {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
      {paymentSuccess && (
        <p className="text-green-500 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Payment successful!
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-[#4a90e2] text-white py-3 rounded-lg font-semibold hover:bg-[#357abd] transition-all"
      >
        Pay Now
      </button>
    </form>
  );
};

// Billing Page Component
const DeepBillingPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(packages[1].id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white p-8 mt-14">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2c3e50] mb-8">
          Billing & Payments
        </h1>

        {/* Packages Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white p-6 rounded-xl shadow-lg border-2 ${
                  selectedPackage === pkg.id
                    ? 'border-[#4a90e2]'
                    : 'border-transparent'
                } transition-all`}
              >
                {pkg.bestValue && (
                  <div className="bg-[#e86d6d] text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Best Value
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#2c3e50] mb-4">
                  {pkg.name}
                </h3>
                <p className="text-3xl font-bold text-[#4a90e2] mb-6">
                  {pkg.price}
                </p>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-[#647380]"
                    >
                      <CheckCircle className="w-5 h-5 text-[#4a90e2] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className="w-full bg-[#4a90e2] text-white py-3 rounded-lg font-semibold hover:bg-[#357abd] transition-all"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Payment Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">
            Payment Details
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </div>
        </section>

        {/* Invoice History Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#2c3e50] mb-6">
            Invoice History
          </h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-4 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-[#4a90e2]" />
                    <span className="text-[#2c3e50]">{invoice.date}</span>
                  </div>
                  <div className="text-[#2c3e50]">{invoice.amount}</div>
                  <div className="text-[#2c3e50]">{invoice.status}</div>
                  <button className="text-[#4a90e2] hover:underline">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeepBillingPage;
