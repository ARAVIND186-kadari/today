import React from 'react';
import { ArrowRight, Calendar, Star, Sparkles, Flame, Clock, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Hero.css';

const Hero = ({ onAddToCart }) => {
  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>

      <div className="container" style={{ position: 'relative' }}>
        <div className="hero-content">
          {/* Top Badge */}
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Welcome to Spice Route Hyderabad</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            A Journey Through <span>Authentic Indian</span> Flavours
          </h1>

          {/* Subtitle / Description */}
          <p className="hero-description">
            Experience the true essence of Hyderabadi royal heritage and rich North Indian
            culinary traditions. Prepared with slow-simmered hand-ground spices, clay tandoors,
            and pure passion.
          </p>

          {/* Action Buttons */}
          <div className="hero-buttons">
            <button
              id="hero-explore-menu-btn"
              className="btn btn-primary"
              onClick={scrollToMenu}
            >
              <span>Explore Our Menu</span>
              <ArrowRight size={18} />
            </button>

            <button
              id="hero-book-table-btn"
              className="btn btn-secondary"
              onClick={scrollToBooking}
            >
              <Calendar size={18} />
              <span>Book a Table</span>
            </button>
          </div>

          {/* Highlights & Trust Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">4.9 ★</span>
              <span className="stat-label">1,840+ Verified Reviews</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">15+</span>
              <span className="stat-label">Years of Culinary Heritage</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Fresh Hand-Ground Spices</span>
            </div>
          </div>
        </div>

        {/* Floating Dish Showcase Card (Desktop) */}
        <div className="hero-float-container">
          <div className="hero-floating-card">
            <div className="hero-float-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
                alt="Hyderabadi Chicken Dum Biryani"
                className="hero-float-img"
              />
              <span className="hero-float-tag">Chef's Signature</span>
            </div>

            <h3 className="hero-float-title">Hyderabadi Dum Biryani</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Aged basmati rice, saffron & marinated meat slow-cooked in clay handi.
            </p>

            <div className="hero-float-meta">
              <span className="hero-float-price">₹280</span>
              <button
                className="btn btn-outline-gold btn-sm"
                onClick={() => {
                  onAddToCart({
                    id: "biryani-1",
                    name: "Hyderabadi Chicken Dum Biryani",
                    category: "biryani",
                    price: 280,
                    description: "Long-grain aged basmati rice slow-cooked on 'Dum' with tender marinated chicken.",
                    isVeg: false,
                    spiciness: "medium",
                    rating: 4.9,
                    reviewCount: 342,
                    isChefSpecial: true,
                    isBestseller: true,
                    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  });
                }}
              >
                + Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
