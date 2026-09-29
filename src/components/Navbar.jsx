import React, { useState, useEffect } from 'react';
import { Utensils, ShoppingBag, Menu as MenuIcon, X, Phone, Calendar, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Navbar.css';

const Navbar = ({ cartCount, onOpenCart, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section
      const sections = ['home', 'about', 'menu', 'booking', 'gallery', 'reviews', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reservations', href: '#booking' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Logo */}
          <a href="#home" className="nav-logo" onClick={(e) => handleNavClick(e, '#home')}>
            <div className="nav-logo-icon">
              <Utensils size={22} />
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-title">{RESTAURANT_INFO.name}</span>
              <span className="nav-logo-subtitle">Hyderabad</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav>
            <ul className="nav-links">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions: Cart, Book Table, Mobile Toggle */}
          <div className="nav-actions">
            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              className="nav-cart-btn"
              onClick={onOpenCart}
              aria-label="View Cart"
              title="View Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </button>

            {/* Book a Table Button */}
            <button
              id="navbar-book-btn"
              className="btn btn-primary"
              onClick={() => {
                const el = document.getElementById('booking');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calendar size={17} />
              <span>Book a Table</span>
            </button>

            {/* Hamburger Toggle */}
            <button
              id="navbar-mobile-toggle"
              className="nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <Utensils size={20} />
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-title">{RESTAURANT_INFO.name}</span>
              <span className="nav-logo-subtitle">Hyderabad</span>
            </div>
          </div>
          <button
            className="btn-icon btn-secondary"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="mobile-menu-links">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <span>{link.name}</span>
                  <ArrowRight size={18} style={{ opacity: 0.6 }} />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mobile-menu-footer">
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Calendar size={18} />
            <span>Book a Table Now</span>
          </button>

          <a
            href={`tel:${RESTAURANT_INFO.contact.phone.replace(/\s+/g, '')}`}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Phone size={18} />
            <span>Call Us: {RESTAURANT_INFO.contact.phone}</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
