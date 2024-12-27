import {
  Heart,
  Clock,
  Shield,
  Users,
  CheckCircle,
  Phone,
  Award,
  Star,
  MessageCircle,
  ArrowRight,
  Activity,
  Calendar,
  Bell,
  FileText,
  Settings,
  HelpCircle,
} from 'lucide-react';
import './AboutPage.scss';

const AboutPage = () => {
  const statistics = [
    { number: '10k+', label: 'Active Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
    { number: '50+', label: 'Healthcare Partners' },
  ];

  const testimonials = [
    {
      quote:
        "ElderlyCare has transformed how we manage our parents' care. The reminders and health tracking features are invaluable.",
      author: 'Sarah Thompson',
      role: 'Family Caregiver',
      rating: 5,
    },
    {
      quote:
        'As a healthcare provider, the platform helps me stay connected with families and maintain accurate care records.',
      author: 'Dr. Michael Chen',
      role: 'Geriatric Specialist',
      rating: 5,
    },
    {
      quote:
        'The emergency alert system gives us peace of mind knowing we can get help quickly when needed.',
      author: 'Robert Williams',
      role: 'Elder Care Facility Manager',
      rating: 5,
    },
  ];

  const services = [
    {
      icon: <Calendar />,
      title: 'Appointment Management',
      description:
        'Schedule and track medical appointments, therapy sessions, and social activities.',
    },
    {
      icon: <Bell />,
      title: 'Medication Reminders',
      description:
        'Timely alerts for medications with dosage tracking and refill notifications.',
    },
    {
      icon: <Activity />,
      title: 'Health Monitoring',
      description:
        'Track vital signs, symptoms, and general wellness indicators.',
    },
    {
      icon: <FileText />,
      title: 'Care Documentation',
      description:
        'Maintain detailed care logs and health records in one secure location.',
    },
    {
      icon: <Settings />,
      title: 'Customizable Care Plans',
      description: 'Create and adjust care routines based on individual needs.',
    },
    {
      icon: <HelpCircle />,
      title: '24/7 Support',
      description:
        'Round-the-clock assistance for emergency situations and technical help.',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              About <span className="highlight">ElderlyCare</span>
            </h1>
            <p className="hero-subtitle">
              Empowering caregivers and enhancing the quality of life for our
              elderly community through reliable, accessible care management.
            </p>
          </div>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="container">
          <div className="statistics-grid">
            {statistics.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To provide a straightforward, reliable platform that connects
              caregivers, healthcare providers, and elderly individuals,
              ensuring quality care through simple, effective solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <div className="value-card">
              <div className="icon-wrapper">
                <Heart />
              </div>
              <h3>Compassionate Care</h3>
              <p>
                We believe in providing care that treats every elderly
                individual with dignity, respect, and understanding.
              </p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper">
                <Shield />
              </div>
              <h3>Reliability</h3>
              <p>
                Our platform ensures dependable access to care management tools
                and information when you need them most.
              </p>
            </div>
            <div className="value-card">
              <div className="icon-wrapper">
                <Users />
              </div>
              <h3>Connected Care</h3>
              <p>
                We facilitate seamless communication between caregivers,
                healthcare providers, and family members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What People Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-marks">{`"`}</div>
                <p className="quote">{testimonial.quote}</p>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <div className="author">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="awards-section">
        <div className="container">
          <h2>Recognition & Awards</h2>
          <div className="awards-grid">
            <div className="award-card">
              <Award className="award-icon" />
              <h3>Best Healthcare Platform 2024</h3>
              <p>HealthTech Innovation Awards</p>
            </div>
            <div className="award-card">
              <Award className="award-icon" />
              <h3>Excellence in Elder Care</h3>
              <p>Senior Care Association</p>
            </div>
            <div className="award-card">
              <Award className="award-icon" />
              <h3>Top Rated Care Solution</h3>
              <p>Digital Health Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Better Care Management?</h2>
            <p>
              Join thousands of families who trust ElderlyCare for their elderly
              care needs.
            </p>
            <div className="cta-buttons">
              <button className="primary-button">
                Get Started
                <ArrowRight className="button-icon" />
              </button>
              <button className="secondary-button">
                <Phone className="button-icon" />
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
