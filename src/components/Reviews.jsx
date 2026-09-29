import React, { useState } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  PenLine,
  Sparkles,
  Utensils,
  X,
  MessageSquare
} from 'lucide-react';
import { REVIEWS_DATA } from '../data/menuData';
import confetti from 'canvas-confetti';
import '../styles/Reviews.css';

const Reviews = () => {
  const [reviewsList, setReviewsList] = useState(REVIEWS_DATA);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    role: 'Food Enthusiast',
    favoriteDish: 'Hyderabadi Dum Biryani',
    comment: ''
  });

  const handleRatingHover = (val) => {
    setNewRating(val);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewForm.name.trim() || !newReviewForm.comment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newReviewForm.name.trim(),
      role: newReviewForm.role.trim() || 'Verified Guest',
      location: 'Hyderabad',
      rating: newRating,
      date: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: newReviewForm.comment.trim(),
      favoriteDish: newReviewForm.favoriteDish.trim() || 'Chef Special',
      verified: true
    };

    setReviewsList([newReview, ...reviewsList]);
    setIsWriteModalOpen(false);
    setNewReviewForm({
      name: '',
      role: 'Food Enthusiast',
      favoriteDish: 'Hyderabadi Dum Biryani',
      comment: ''
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="reviews" className="reviews-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Star size={14} fill="currentColor" />
            Guest Experiences
          </span>
          <h2 className="section-title">Words from Our Diners</h2>
          <p className="section-desc">
            Discover why food lovers, families, and critics rate Spice Route as Hyderabad's
            premier authentic destination.
          </p>
        </div>

        {/* Rating Scorecard Banner */}
        <div className="reviews-scorecard">
          <div className="scorecard-main">
            <span className="scorecard-number">4.9</span>
            <div className="scorecard-meta">
              <div className="scorecard-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} fill="currentColor" />
                ))}
              </div>
              <span className="scorecard-label">
                Based on <strong>1,840+ Verified Reviews</strong> on Google & TripAdvisor
              </span>
            </div>
          </div>

          <button
            id="write-review-btn"
            className="btn btn-outline-gold"
            onClick={() => setIsWriteModalOpen(true)}
          >
            <PenLine size={16} />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="reviews-grid">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-card-header">
                <img src={rev.avatar} alt={rev.name} className="review-avatar" />
                <div className="review-author-info">
                  <div className="review-author-name">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <CheckCircle2
                        size={15}
                        color="var(--veg)"
                        title="Verified Diner"
                      />
                    )}
                  </div>
                  <span className="review-author-role">
                    {rev.role} • {rev.location}
                  </span>
                </div>
              </div>

              <div className="review-stars-row">
                <div className="review-stars">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="review-date">{rev.date}</span>
              </div>

              <p className="review-comment">"{rev.comment}"</p>

              {rev.favoriteDish && (
                <div className="review-fav-dish">
                  <Utensils size={14} />
                  <span>Favorite: {rev.favoriteDish}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWriteModalOpen(false)}>
          <div
            className="modal-content write-review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Write a Review</h3>
              <button
                className="btn-icon btn-secondary"
                onClick={() => setIsWriteModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Rate Your Experience</label>
                <div className="rating-select-row">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`star-select-btn ${num <= newRating ? 'active' : ''}`}
                      onClick={() => setNewRating(num)}
                    >
                      <Star
                        size={28}
                        fill={num <= newRating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sravanthi Reddy"
                  value={newReviewForm.name}
                  onChange={(e) =>
                    setNewReviewForm({ ...newReviewForm, name: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Favorite Dish Ordered</label>
                <input
                  type="text"
                  placeholder="e.g. Special Mutton Dum Biryani"
                  value={newReviewForm.favoriteDish}
                  onChange={(e) =>
                    setNewReviewForm({
                      ...newReviewForm,
                      favoriteDish: e.target.value
                    })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Your Review *</label>
                <textarea
                  placeholder="Tell us about the flavour, service, and ambiance..."
                  value={newReviewForm.comment}
                  onChange={(e) =>
                    setNewReviewForm({
                      ...newReviewForm,
                      comment: e.target.value
                    })
                  }
                  className="form-textarea"
                  rows={4}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem' }}
              >
                <span>Publish Review</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
