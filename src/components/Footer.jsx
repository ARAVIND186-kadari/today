import React, { useState } from 'react';
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ChevronRight,
  Heart
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Footer.css';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Story', href: '#about' },
    { name: 'Food Menu', href: '#menu' },
    { name: 'Table Booking', href: '#booking' },
    { name: 'Photo Gallery', href: '#gallery' },
    { name: 'Guest Reviews', href: '#reviews' },
    { name: 'Contact & Map', href: '#contact' }
  ];

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="nav-logo">
              <div className="nav-logo-icon">
                <Utensils size={20} />
              </div>
              <div className="nav-logo-text">
                <span className="nav-logo-title">{RESTAURANT_INFO.name}</span>
                <span className="nav-logo-subtitle">Hyderabad</span>
              </div>
            </div>

            <p className="footer-brand-desc">{RESTAURANT_INFO.shortDescription}</p>

            {/* Social Icons */}
            <div className="footer-social-links">
              <a
                href={RESTAURANT_INFO.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={RESTAURANT_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={RESTAURANT_INFO.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={RESTAURANT_INFO.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              {quickLinks.map((item) => (
                <li key={item.name} className="footer-link-item">
                  <a href={item.href}>
                    <ChevronRight size={14} />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Contact Details</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <MapPin size={18} />
                <span>{RESTAURANT_INFO.contact.address}</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={18} />
                <span>{RESTAURANT_INFO.contact.phone}</span>
              </li>
              <li className="footer-contact-item">
                <Mail size={18} />
                <span>{RESTAURANT_INFO.contact.email}</span>
              </li>
              <li className="footer-contact-item">
                <Clock size={18} />
                <span>{RESTAURANT_INFO.timings.days}: {RESTAURANT_INFO.timings.hours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="footer-newsletter-box">
            <h4 className="footer-heading">Join VIP Club</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Subscribe for exclusive chef tasting invitations, secret weekend specials, and 15% off your next visit.
            </p>

            {subscribed ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--veg)', fontWeight: 600 }}>
                🎉 Thank you for subscribing! Check your email for the 15% voucher.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="footer-newsletter-input"
                  required
                />
                <button
                  type="submit"
                  className="footer-newsletter-btn"
                  aria-label="Subscribe to newsletter"
                >
                  <Send size={16} />
                </button>
              </form>
            )}

            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>
                ⭐ Valet Parking Available • Pure Desi Ghee Used
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} <strong>{RESTAURANT_INFO.name}</strong>. All rights reserved. Built for fine dining lovers.
          </p>

          <button
            className="footer-scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Scroll to Top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
