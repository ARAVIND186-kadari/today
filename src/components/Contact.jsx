import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  Navigation,
  MessageCircle
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => setIsSent(false), 5000);
    }, 600);
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <MapPin size={14} />
            Find & Connect With Us
          </span>
          <h2 className="section-title">Visit Spice Route Hyderabad</h2>
          <p className="section-desc">
            Conveniently located in Banjara Hills with dedicated valet parking and
            handicapped-accessible entrances.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Details, Hours & Map */}
          <div className="contact-info-wrapper">
            {/* Address */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="contact-card-title">Our Location</h3>
                <p className="contact-card-desc">{RESTAURANT_INFO.contact.address}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>
                  Landmark: {RESTAURANT_INFO.contact.landmark}
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="contact-card-title">Opening Hours</h3>
                <p className="contact-card-desc">
                  <strong>{RESTAURANT_INFO.timings.days}:</strong> {RESTAURANT_INFO.timings.hours}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Lunch Service: {RESTAURANT_INFO.timings.lunch} • Dinner Service: {RESTAURANT_INFO.timings.dinner}
                </p>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="contact-card-item">
              <div className="contact-icon-box">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="contact-card-title">Direct Reservations & Inquiries</h3>
                <p className="contact-card-desc">
                  Phone: <a href={`tel:${RESTAURANT_INFO.contact.phone}`} style={{ color: 'var(--gold-light)' }}>{RESTAURANT_INFO.contact.phone}</a>
                </p>
                <p className="contact-card-desc">
                  Email: <a href={`mailto:${RESTAURANT_INFO.contact.email}`} style={{ color: 'var(--gold-light)' }}>{RESTAURANT_INFO.contact.email}</a>
                </p>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="contact-quick-actions">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_INFO.contact.address)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Navigation size={15} />
                <span>Get Driving Directions</span>
              </a>

              <a
                href={`https://wa.me/${RESTAURANT_INFO.contact.whatsapp}?text=Hi%20Spice%20Route,%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-gold btn-sm"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Embedded Google Map Preview */}
            <div className="contact-map-container">
              <iframe
                title="Spice Route Restaurant Location"
                src={RESTAURANT_INFO.contact.mapEmbedUrl}
                className="contact-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="contact-form-card">
            <h3 className="contact-form-title">Send a Quick Message</h3>
            <p className="contact-form-desc">
              Have a special catering inquiry, event booking question, or feedback?
              Drop us a line and our manager will respond within 2 hours.
            </p>

            {isSent && (
              <div className="contact-success-banner">
                <CheckCircle2 size={20} />
                <span>Message sent successfully! Our team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form-inputs">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Private Dining / Catering / Feedback"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea
                  placeholder="How can we assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                  rows={4}
                  required
                ></textarea>
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.95rem' }}
                disabled={loading}
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Inquiry Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
