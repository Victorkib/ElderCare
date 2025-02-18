import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import {
  Calendar,
  Clock,
  Heart,
  Bell,
  Clipboard,
  Shield,
  Phone,
  ArrowUpCircle,
  PlayCircle,
  Loader2,
  X,
} from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ElderlyCareLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVideoOpen) {
      const timer = setTimeout(() => setIsVideoLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isVideoOpen]);

  const features = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Medication Reminders',
      description:
        'Simple and clear medication reminders to ensure proper dosage and timing.',
    },
    {
      icon: <Clipboard className="w-8 h-8" />,
      title: 'Health Logs',
      description:
        'Easy-to-use logs for tracking daily activities, meals, and health observations.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Appointment Management',
      description:
        'Keep track of medical appointments and important dates in one place.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Emergency Contacts',
      description:
        'Quick access to important contact information for emergencies.',
    },
  ];

  const benefits = [
    {
      title: 'For Caregivers',
      points: [
        'Simple interface requiring minimal training',
        'Consolidated view of all care responsibilities',
        'Easy communication with healthcare providers',
        'Peace of mind through organized care management',
      ],
    },
    {
      title: 'For Healthcare Providers',
      points: [
        'Clear patient health history',
        'Efficient care coordination',
        'Better informed decision making',
        'Improved patient outcomes tracking',
      ],
    },
  ];

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-[#f5f7fa] to-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-[#2c3e50] leading-tight">
              Simplifying Elderly Care Management
            </h1>
            <p className="text-xl text-[#647380]">
              A straightforward platform that helps caregivers provide better
              support for elderly individuals through easy-to-use tools and
              reliable features.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#4a90e2] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#357abd] transition-all hover:-translate-y-1">
                Start Free Trial
              </button>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center gap-2 border-2 border-[#2c3e50] px-8 py-4 rounded-xl font-semibold hover:bg-[#2c3e50]/10 transition-all hover:-translate-y-1"
              >
                <PlayCircle className="w-6 h-6" />
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-[#4a90e2] rounded-2xl transform rotate-2 scale-105 transition-transform duration-300 group-hover:rotate-1 group-hover:scale-110"></div>
            <img
              src="/ElderlyHands.jpg"
              alt="Caregiver using ElderlyCare system"
              className="relative rounded-2xl transform transition-transform duration-300 group-hover:scale-102 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#2c3e50] mb-4">
            Simple Tools for Better Care
          </h2>
          <p className="text-xl text-[#647380] text-center mb-16">
            Everything you need to provide quality care, all in one place
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-[#4a90e2] mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#647380]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#f5f7fa]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#2c3e50] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[#647380] text-center mb-16">
            Three simple steps to better care management
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#4a90e2] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
                Set Up Profile
              </h3>
              <p className="text-[#647380] mb-6">
                Create profiles for elderly individuals with essential health
                information and preferences.
              </p>
              <Link
                to="/profile-setup"
                className="text-[#4a90e2] font-semibold hover:underline"
              >
                Learn More
              </Link>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#4a90e2] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
                Add Care Details
              </h3>
              <p className="text-[#647380] mb-6">
                Input medications, appointments, and daily care routines into
                the simple scheduler.
              </p>
              <Link
                to="/Scheduler"
                className="text-[#4a90e2] font-semibold hover:underline"
              >
                Learn More
              </Link>
            </div>
            {/* Repeat for  3 */}
            <div className="bg-white p-8 rounded-2xl text-center">
              <div className="w-12 h-12 bg-[#4a90e2] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>

              <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">
                Manage Care
              </h3>
              <p className="text-[#647380] mb-6">
                Receive reminders, log activities, and coordinate care with
                other caregivers.
              </p>
              <Link
                to="/CareAnalytics"
                className="text-[#4a90e2] font-semibold hover:underline"
              >
                Learn More
              </Link>
            </div>

            {/* Repeat for steps 2 and 3 */}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#2c3e50] mb-16">
            Benefits for Everyone
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-[#f5f7fa] p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-[#4a90e2] mb-6">
                  {benefit.title}
                </h3>
                <ul className="space-y-4">
                  {benefit.points.map((point, i) => (
                    <li key={i} className="flex items-start text-[#647380]">
                      <span className="text-[#4a90e2] mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-gradient-to-b from-[#f5f7fa] to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-lg text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md">
              <FaHeart className="w-12 h-12 text-[#e86d6d]" />
            </div>
            <h2 className="text-4xl font-bold text-[#2c3e50] mb-6">
              Trusted by Caregivers
            </h2>
            <p className="text-xl text-[#647380] mb-8">
              Join hundreds of caregivers who use ElderlyCare to provide better
              support for their loved ones.
            </p>
            <button className="bg-[#4a90e2] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#357abd] transition-all">
              Join Today
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#f5f7fa]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-12 rounded-3xl shadow-lg text-center">
            <h2 className="text-4xl font-bold text-[#2c3e50] mb-6">
              Need Help?
            </h2>
            <p className="text-xl text-[#647380] mb-8">
              Our support team is here to assist you with any questions about
              ElderlyCare.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <div className="flex items-center gap-2 text-[#4a90e2]">
                <Phone className="w-6 h-6" />
                <span className="text-xl font-medium">1-800-ELDERLY</span>
              </div>
              <div className="flex items-center gap-2 text-[#4a90e2]">
                <Clock className="w-6 h-6" />
                <span className="text-xl font-medium">Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2c3e50] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-[#e86d6d]" />
              <h3 className="text-2xl font-semibold">ElderlyCare</h3>
            </div>
            <p className="text-[#ffffffcc]">
              Simplifying elderly care management for everyone.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <a
              href="#features"
              className="block text-[#ffffffcc] hover:text-white mb-2"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="block text-[#ffffffcc] hover:text-white mb-2"
            >
              Benefits
            </a>
            <a
              href="#contact"
              className="block text-[#ffffffcc] hover:text-white"
            >
              Contact
            </a>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Support</h4>
            <a
              href="#help"
              className="block text-[#ffffffcc] hover:text-white mb-2"
            >
              Help Center
            </a>
            <a
              href="#privacy"
              className="block text-[#ffffffcc] hover:text-white mb-2"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="block text-[#ffffffcc] hover:text-white"
            >
              Terms of Service
            </a>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <p className="text-[#ffffffcc] mb-2">1-800-ELDERLY</p>
            <p className="text-[#ffffffcc]">support@elderlycare.com</p>
          </div>
        </div>
        <div className="border-t border-[#ffffff1a] mt-8 pt-8 text-center text-[#ffffffcc]">
          &copy; 2024 ElderlyCare. All rights reserved.
        </div>
      </footer>

      {/* Video Modal */}
      <Dialog
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center mt-16"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="relative bg-white rounded-3xl max-w-4xl w-full mx-4 p-1 shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute -right-4 -top-4 z-10 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-8 h-8 text-[#2c3e50]" />
          </button>

          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f5f7fa] rounded-2xl">
              <Loader2 className="w-12 h-12 text-[#4a90e2] animate-spin" />
              <div className="absolute inset-0 border-4 border-[#4a90e2]/20 rounded-2xl animate-ping"></div>
            </div>
          )}

          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
            <iframe
              className={`w-full h-full ${
                isVideoLoading ? 'opacity-0' : 'opacity-100'
              } transition-opacity duration-500`}
              src="https://www.youtube.com/embed/e4KAFXztwgo?si=eG9pBWLShliHwOc4"
              title="Elderly Care Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setIsVideoLoading(false)}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ElderlyCareLanding;
