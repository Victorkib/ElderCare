import React, { useState } from 'react';
import {
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Receipt,
  Activity,
  Users,
  Heart,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Basic Care',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      features: [
        'Basic health logging',
        'Medication reminders',
        'Emergency contacts management',
        'Single caregiver account',
        'Basic reporting',
      ],
      icon: Heart,
    },
    {
      name: 'Family Care',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      popular: true,
      features: [
        'All Basic Care features',
        'Multiple caregiver accounts (up to 3)',
        'Advanced health tracking',
        'Healthcare provider access',
        'Priority support',
        'Detailed analytics',
      ],
      icon: Users,
    },
    {
      name: 'Professional Care',
      monthlyPrice: 99.99,
      yearlyPrice: 999.99,
      features: [
        'All Family Care features',
        'Unlimited caregiver accounts',
        'Custom reporting',
        'API access',
        'Dedicated support',
        'Advanced security features',
        'Custom branding',
      ],
      icon: Shield,
    },
  ];

  const recentTransactions = [
    {
      date: '2025-02-14',
      amount: 49.99,
      status: 'Paid',
      description: 'Family Care Plan - Monthly',
    },
    {
      date: '2025-01-14',
      amount: 49.99,
      status: 'Paid',
      description: 'Family Care Plan - Monthly',
    },
    {
      date: '2024-12-14',
      amount: 49.99,
      status: 'Paid',
      description: 'Family Care Plan - Monthly',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billing & Subscription
          </h1>
          <p className="text-gray-600">
            Manage your ECS subscription and billing information
          </p>
        </div>

        {/* Current Plan Alert */}
        <Alert className="mb-8">
          <Activity className="h-4 w-4" />
          <AlertTitle>Current Plan: Family Care</AlertTitle>
          <AlertDescription>
            Your next billing date is March 14, 2025. You're saving 20% with
            annual billing!
          </AlertDescription>
        </Alert>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <div className="flex space-x-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const price =
              billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-lg shadow-md p-6 ${
                  plan.popular ? 'border-2 border-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <PlanIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'mo' : 'year'}
                  </span>
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    selectedPlan === plan.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Method
          </h2>
          <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-md mr-4">
                <img
                  src="/api/placeholder/40/25"
                  alt="Credit card"
                  className="h-4"
                />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Update
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Billing History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">${transaction.amount}</td>
                    <td
                      className={`py-3 px-4 ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-700">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
