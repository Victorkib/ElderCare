import { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, CheckCircle, ArrowUpCircle } from 'lucide-react';
import './LandingPage.scss';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      title: 'Advanced Analytics',
      description:
        'Get deep insights into your business performance with our powerful analytics tools.',
    },
    {
      title: 'Cloud Integration',
      description:
        'Seamlessly connect with your favorite cloud services and tools.',
    },
    {
      title: 'Real-time Collaboration',
      description:
        'Work together with your team in real-time, anywhere in the world.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO at TechCorp',
      content:
        'This platform has transformed how we operate. Highly recommended!',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: `The best solution we've found for our team's needs.`,
    },
  ];

  return (
    <div className="landing-page">
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <h1>CompanyName</h1>
          </div>

          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
            <button className="cta-button">
              Get Started <ArrowRight size={16} />
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Transform Your Business with Our Solution</h1>
            <p>Empower your team with cutting-edge tools and insights</p>
            <button className="primary-button">
              Start Free Trial <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-image">
            <img src="/api/placeholder/600/400" alt="Platform Preview" />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Features that Drive Success</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <CheckCircle className="feature-icon" size={32} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p>
                  {`"`}
                  {testimonial.content}
                  {`"`}
                </p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing">
        <div className="container">
          <h2>Simple, Transparent Pricing</h2>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">
                $29<span>/month</span>
              </div>
              <ul>
                <li>Basic Features</li>
                <li>5 Team Members</li>
                <li>10GB Storage</li>
                <li>Basic Support</li>
              </ul>
              <button className="secondary-button">Choose Plan</button>
            </div>
            <div className="pricing-card featured">
              <h3>Professional</h3>
              <div className="price">
                $99<span>/month</span>
              </div>
              <ul>
                <li>Advanced Features</li>
                <li>Unlimited Team Members</li>
                <li>100GB Storage</li>
                <li>Priority Support</li>
              </ul>
              <button className="primary-button">Choose Plan</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CompanyName</h3>
              <p>Transforming businesses through innovation</p>
            </div>
            <div className="footer-section">
              <h4>Links</h4>
              <a href="#features">Features</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>contact@company.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CompanyName. All rights reserved.</p>
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

export default LandingPage;
