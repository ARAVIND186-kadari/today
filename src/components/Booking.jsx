import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Share2,
  Utensils,
  MapPin,
  ShieldCheck,
  Music,
  Wine
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Booking.css';

const Booking = () => {
  // Today's date in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: todayStr,
    time: '19:30',
    guests: '2 Guests',
    seating: 'Main AC Dining Hall',
    specialRequest: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const timeSlots = [
    { label: 'Lunch - 12:00 PM', value: '12:00' },
    { label: 'Lunch - 12:45 PM', value: '12:45' },
    { label: 'Lunch - 01:30 PM', value: '13:30' },
    { label: 'Lunch - 02:15 PM', value: '14:15' },
    { label: 'Dinner - 07:00 PM', value: '19:00' },
    { label: 'Dinner - 07:45 PM', value: '19:45' },
    { label: 'Dinner - 08:30 PM (Peak)', value: '20:30' },
    { label: 'Dinner - 09:15 PM', value: '21:15' },
    { label: 'Dinner - 10:00 PM', value: '22:00' }
  ];

  const guestOptions = [
    '1 Guest',
    '2 Guests',
    '3 Guests',
    '4 Guests',
    '5 Guests',
    '6 Guests',
    '8 Guests',
    '10+ Guests (Large Party)'
  ];

  const seatingOptions = [
    'Main AC Dining Hall',
    'Rooftop Starlit Terrace',
    'Royal Nizami Private Cabana',
    'Window View Corner'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please choose a time slot';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const reservationId = 'SR-' + Math.floor(1000 + Math.random() * 9000);
      const bookingRecord = {
        id: reservationId,
        ...formData,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage for demo persistence
      try {
        const existing = JSON.parse(localStorage.getItem('spice_route_bookings') || '[]');
        existing.push(bookingRecord);
        localStorage.setItem('spice_route_bookings', JSON.stringify(existing));
      } catch (err) {
        // ignore
      }

      setConfirmedBooking(bookingRecord);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (err) {
        // ignore
      }
    }, 600);
  };

  const shareBookingWhatsApp = () => {
    if (!confirmedBooking) return;
    const msg = `🎉 *Table Reservation Confirmed!*\nRestaurant: Spice Route Hyderabad\nBooking ID: ${confirmedBooking.id}\nName: ${confirmedBooking.name}\nDate: ${confirmedBooking.date}\nTime: ${confirmedBooking.time}\nGuests: ${confirmedBooking.guests}\nSeating: ${confirmedBooking.seating}\n\nAddress: ${RESTAURANT_INFO.contact.address}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="booking" className="booking-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Calendar size={14} />
            Reserve Your Experience
          </span>
          <h2 className="section-title">Book a Table at Spice Route</h2>
          <p className="section-desc">
            Reserve your table in advance for an exquisite fine dining journey.
            Instant confirmation with no reservation fee.
          </p>
        </div>

        <div className="booking-wrapper">
          {/* Left Info Column */}
          <div className="booking-info-col">
            <div className="booking-info-overlay"></div>

            <div className="booking-info-content">
              <h3 className="booking-info-title">
                An Unforgettable <span>Dining Affair</span>
              </h3>

              <ul className="booking-perks-list">
                <li className="booking-perk-item">
                  <div className="booking-perk-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="booking-perk-title">Instant Table Confirmation</h4>
                    <p className="booking-perk-desc">
                      Guaranteed table reserved ready for your arrival. Zero wait times.
                    </p>
                  </div>
                </li>

                <li className="booking-perk-item">
                  <div className="booking-perk-icon">
                    <Music size={18} />
                  </div>
                  <div>
                    <h4 className="booking-perk-title">Ambient Live Acoustics</h4>
                    <p className="booking-perk-desc">
                      Enjoy soulful traditional sitar and mild instrumental evenings.
                    </p>
                  </div>
                </li>

                <li className="booking-perk-item">
                  <div className="booking-perk-icon">
                    <Wine size={18} />
                  </div>
                  <div>
                    <h4 className="booking-perk-title">Custom Celebrations & Cakes</h4>
                    <p className="booking-perk-desc">
                      Mention birthday or anniversary in notes for complimentary table decor.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Contact snippet */}
            <div className="booking-support-box">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Planning a large corporate banquet (20+ guests)?
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                Call our events concierge: {RESTAURANT_INFO.contact.phone}
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="booking-form-col">
            <form onSubmit={handleSubmit} noValidate>
              <div className="booking-form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="booking-name" className="form-label">
                    <User size={14} />
                    <span>Full Name *</span>
                  </label>
                  <input
                    id="booking-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Ramesh Varma"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    required
                  />
                  {errors.name && <span className="form-error-msg">{errors.name}</span>}
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="booking-phone" className="form-label">
                    <Phone size={14} />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    required
                  />
                  {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                </div>

                {/* Email Address */}
                <div className="form-group booking-field-full">
                  <label htmlFor="booking-email" className="form-label">
                    <Mail size={14} />
                    <span>Email Address *</span>
                  </label>
                  <input
                    id="booking-email"
                    name="email"
                    type="email"
                    placeholder="ramesh@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                  />
                  {errors.email && <span className="form-error-msg">{errors.email}</span>}
                </div>

                {/* Date */}
                <div className="form-group">
                  <label htmlFor="booking-date" className="form-label">
                    <Calendar size={14} />
                    <span>Date *</span>
                  </label>
                  <input
                    id="booking-date"
                    name="date"
                    type="date"
                    min={todayStr}
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input ${errors.date ? 'error' : ''}`}
                    required
                  />
                  {errors.date && <span className="form-error-msg">{errors.date}</span>}
                </div>

                {/* Time Slot */}
                <div className="form-group">
                  <label htmlFor="booking-time" className="form-label">
                    <Clock size={14} />
                    <span>Time Slot *</span>
                  </label>
                  <select
                    id="booking-time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests */}
                <div className="form-group">
                  <label htmlFor="booking-guests" className="form-label">
                    <Users size={14} />
                    <span>Number of Guests</span>
                  </label>
                  <select
                    id="booking-guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {guestOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seating Preference */}
                <div className="form-group">
                  <label htmlFor="booking-seating" className="form-label">
                    <Utensils size={14} />
                    <span>Seating Area</span>
                  </label>
                  <select
                    id="booking-seating"
                    name="seating"
                    value={formData.seating}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {seatingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Request */}
                <div className="form-group booking-field-full">
                  <label htmlFor="booking-requests" className="form-label">
                    <MessageSquare size={14} />
                    <span>Special Request / Occasion (Optional)</span>
                  </label>
                  <textarea
                    id="booking-requests"
                    name="specialRequest"
                    placeholder="E.g. Celebrating our anniversary, quiet corner table, high chair for toddler..."
                    value={formData.specialRequest}
                    onChange={handleChange}
                    className="form-textarea"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="booking-field-full" style={{ marginTop: '0.5rem' }}>
                  <button
                    id="submit-booking-btn"
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Confirming Reservation...</span>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Confirm Table Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="modal-overlay" onClick={() => setConfirmedBooking(null)}>
          <div className="booking-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="booking-success-icon">
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: '#fff' }}>
              Reservation Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We are delighted to host you at Spice Route. A confirmation SMS has been dispatched.
            </p>

            <div className="booking-code-badge">
              <span>Reservation ID: {confirmedBooking.id}</span>
            </div>

            <div className="booking-details-box">
              <div className="booking-detail-row">
                <span>Guest Name:</span>
                <strong>{confirmedBooking.name}</strong>
              </div>
              <div className="booking-detail-row">
                <span>Date & Time:</span>
                <strong>
                  {confirmedBooking.date} at {confirmedBooking.time}
                </strong>
              </div>
              <div className="booking-detail-row">
                <span>Party Size:</span>
                <strong>{confirmedBooking.guests}</strong>
              </div>
              <div className="booking-detail-row">
                <span>Seating Area:</span>
                <strong>{confirmedBooking.seating}</strong>
              </div>
              {confirmedBooking.specialRequest && (
                <div className="booking-detail-row">
                  <span>Special Note:</span>
                  <strong>{confirmedBooking.specialRequest}</strong>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={shareBookingWhatsApp}>
                <Share2 size={16} />
                <span>Share Details</span>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setConfirmedBooking(null)}
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Booking;
