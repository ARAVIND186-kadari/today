import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/menuData';
import '../styles/Gallery.css';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'ambiance', label: 'Ambiance & Dining' },
    { id: 'food', label: 'Signature Delicacies' },
    { id: 'kitchen', label: 'Kitchen & Chefs' }
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) =>
    activeFilter === 'all' ? true : item.category === activeFilter
  );

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, filteredItems.length]);

  const handlePrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredItems.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredItems.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Camera size={14} />
            Visual Experience
          </span>
          <h2 className="section-title">A Glimpse into Spice Route</h2>
          <p className="section-desc">
            Immerse yourself in our ambient architecture, open kitchen craft, and
            royal presentations designed to delight your senses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="gallery-filters">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`gallery-filter-btn ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => setSelectedImageIndex(index)}
              title="Click to view fullscreen"
            >
              <img src={item.image} alt={item.title} className="gallery-item-img" loading="lazy" />

              <div className="gallery-expand-icon">
                <Maximize2 size={16} />
              </div>

              <div className="gallery-item-overlay">
                <span className="gallery-item-tag">{item.categoryLabel}</span>
                <h4 className="gallery-item-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
        <div className="lightbox-modal" onClick={() => setSelectedImageIndex(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedImageIndex(null)}
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>

            {/* Prev & Next Buttons */}
            <button
              className="lightbox-nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="lightbox-nav-btn next"
              onClick={handleNext}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>

            <div className="lightbox-img-wrapper">
              <img
                src={filteredItems[selectedImageIndex].image}
                alt={filteredItems[selectedImageIndex].title}
                className="lightbox-img"
              />
            </div>

            <div className="lightbox-caption">
              <h3 className="lightbox-title">{filteredItems[selectedImageIndex].title}</h3>
              <p className="lightbox-desc">{filteredItems[selectedImageIndex].description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
