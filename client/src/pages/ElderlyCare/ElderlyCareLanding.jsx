import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Heart,
  Bell,
  Clipboard,
  Shield,
  Phone,
  ArrowUpCircle,
} from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import './ElderlyCareLanding.scss';
import { Link } from 'react-router-dom';

const ElderlyCareLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Bell size={32} />,
      title: 'Medication Reminders',
      description:
        'Simple and clear medication reminders to ensure proper dosage and timing.',
    },
    {
      icon: <Clipboard size={32} />,
      title: 'Health Logs',
      description:
        'Easy-to-use logs for tracking daily activities, meals, and health observations.',
    },
    {
      icon: <Calendar size={32} />,
      title: 'Appointment Management',
      description:
        'Keep track of medical appointments and important dates in one place.',
    },
    {
      icon: <Shield size={32} />,
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
    <div className="ecs-landing">
      {/* <header className={`ecs-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <Heart className="logo-icon" />
            <h1>ElderlyCare</h1>
          </div>

          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#contact">Contact</a>

            <Link className="login-button" to={'/login'}>
              Login
            </Link>
            <button className="cta-button">Get Started</button>
          </nav>
        </div>
      </header> */}

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Simplifying Elderly Care Management</h1>
            <p>
              A straightforward platform that helps caregivers provide better
              support for elderly individuals through easy-to-use tools and
              reliable features.
            </p>
            <div className="hero-buttons">
              <button className="primary-button">Start Free Trial</button>
              <button className="secondary-button">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/ElderlyHands.jpg"
              alt="Caregiver using ElderlyCare system"
            />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Simple Tools for Better Care</h2>
          <p className="section-subtitle">
            Everything you need to provide quality care, all in one place
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-subtitle">
            Three simple steps to better care management
          </p>

          <div className="steps">
            {/* Step 1 */}
            <div className="step">
              <div className="step-number">1</div>
              <h3>Set Up Profile</h3>
              <p>
                Create profiles for elderly individuals with essential health
                information and preferences.
              </p>
              <Link to="/profile-setup" className="step-link">
                Learn More
              </Link>
            </div>

            {/* Step 2 */}
            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Care Details</h3>
              <p>
                Input medications, appointments, and daily care routines into
                the simple scheduler.
              </p>
              <Link to="/Scheduler" className="step-link">
                Learn More
              </Link>
            </div>

            {/* Step 3 */}
            <div className="step">
              <div className="step-number">3</div>
              <h3>Manage Care</h3>
              <p>
                Receive reminders, log activities, and coordinate care with
                other caregivers.
              </p>
              <Link to="/CareAnalytics" className="step-link">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="benefits">
        <div className="container">
          <h2>Benefits for Everyone</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <h3>{benefit.title}</h3>
                <ul>
                  {benefit.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-banner">
        <div className="container">
          <div className="trust-content">
            <div className="icon-container">
              <FaHeart size={48} />
            </div>
            <h2>Trusted by Caregivers</h2>
            <p>
              Join hundreds of caregivers who use ElderlyCare to provide better
              support for their loved ones.
            </p>
            <button className="primary-button">Join Today</button>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Need Help?</h2>
              <p>
                Our support team is here to assist you with any questions about
                ElderlyCare.
              </p>
              <div className="contact-methods">
                <div className="contact-method">
                  <Phone size={24} />
                  <span>1-800-ELDERLY</span>
                </div>
                <div className="contact-method">
                  <Clock size={24} />
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <Heart className="logo-icon" />
                <h3>ElderlyCare</h3>
              </div>
              <p>Simplifying elderly care management for everyone.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#features">Features</a>
              <a href="#benefits">Benefits</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>1-800-ELDERLY</p>
              <p>support@elderlycare.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ElderlyCare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <button
        className={`scroll-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpCircle size={24} />
      </button>
    </div>
  );
};

export default ElderlyCareLanding;
