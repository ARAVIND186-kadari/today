import React from 'react';
import { Leaf, Flame, ChefHat, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/About.css';

const About = () => {
  const highlights = [
    {
      icon: <Leaf size={24} />,
      title: 'Fresh & Organic Ingredients',
      desc: 'Sourced daily from certified local organic farms. We use 100% pure desi ghee and cold-pressed oils with zero artificial preservatives or colors.'
    },
    {
      icon: <Flame size={24} />,
      title: 'Authentic Royal Recipes',
      desc: 'Heritage recipes rooted in centuries-old Nizam court kitchens, slow-simmered in earthen handis and charcoal tandoors to infuse deep, smoky layers.'
    },
    {
      icon: <ChefHat size={24} />,
      title: 'Master Culinary Chefs',
      desc: 'Our culinary masters bring over 20+ years of pedigree across India’s finest gastronomic kitchens, balancing spices with fine artistic plating.'
    }
  ];

  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Visuals & Experience Badge */}
          <div className="about-image-col">
            <div className="about-main-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
                alt="Spice Route Luxury Interior & Dining"
                className="about-main-image"
              />
            </div>

            {/* Floating Experience Card */}
            <div className="about-secondary-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Award size={28} color="var(--gold-light)" />
                <span className="about-exp-number">15+</span>
              </div>
              <p className="about-exp-text">Years of Culinary Excellence in Banjara Hills, Hyderabad</p>
            </div>
          </div>

          {/* Right Column: Story & Highlights */}
          <div className="about-content-col">
            <div>
              <span className="section-subtitle">
                <Sparkles size={14} />
                Our Story & Heritage
              </span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>
                Crafting Timeless Flavours With Soul
              </h2>
            </div>

            <p className="about-story-text">
              Founded in 2010 in the cultural heart of Banjara Hills, <strong>Spice Route</strong> was
              born from a desire to revive true royal Indian cooking traditions. We believe food is not
              merely sustenance, but a sensory celebration of spices, aromas, and memories.
            </p>

            <p className="about-story-text">
              Every blend of garam masala, every pot of slow-dum biryani, and every skewered kebab
              is prepared using age-old techniques passed down through generations.
            </p>

            {/* 3 Main Highlights */}
            <div className="about-highlights-grid">
              {highlights.map((item, index) => (
                <div key={index} className="about-highlight-card">
                  <div className="about-highlight-icon">{item.icon}</div>
                  <div>
                    <h3 className="about-highlight-title">{item.title}</h3>
                    <p className="about-highlight-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chef Quote */}
            <div className="about-chef-quote">
              <p>
                “Great Indian cuisine is never rushed. When you balance patient simmering with freshly
                roasted whole spices, magic happens at the dining table.”
              </p>
              <span>— Chef Tariq Mahmood, Executive Culinary Director</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
