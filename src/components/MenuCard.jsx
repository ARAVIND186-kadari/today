import React, { useState } from 'react';
import { Plus, Check, Star, Clock, Flame } from 'lucide-react';
import '../styles/MenuCard.css';

const MenuCard = ({ item, onAddToCart, inCartCount }) => {
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Fallback high-res image if direct URL fails
  const fallbackImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80";

  const handleAdd = () => {
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <article className="menu-card" id={`menu-item-${item.id}`}>
      {/* Image Container with Badges */}
      <div className="menu-card-img-wrapper">
        <img
          src={imgError ? fallbackImage : item.image}
          alt={item.name}
          className="menu-card-img"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Top Badges */}
        <div className="menu-card-badges-top">
          {/* Veg / Non-Veg Indicator */}
          <div className="menu-card-diet-tag" title={item.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}>
            <span className={`badge-diet ${item.isVeg ? 'veg' : 'nonveg'}`}></span>
          </div>

          {/* Chef Special or Bestseller Ribbon */}
          {item.isChefSpecial ? (
            <span className="menu-card-ribbon">Chef's Special</span>
          ) : item.isBestseller ? (
            <span className="menu-card-ribbon bestseller">Bestseller</span>
          ) : null}
        </div>
      </div>

      {/* Body Content */}
      <div className="menu-card-body">
        <div className="menu-card-header">
          <h3 className="menu-card-title">{item.name}</h3>
          <div className="menu-card-rating">
            <Star size={13} fill="currentColor" />
            <span>{item.rating}</span>
          </div>
        </div>

        <p className="menu-card-desc">{item.description}</p>

        {/* Meta: Spiciness & Prep Time */}
        <div className="menu-card-meta">
          <span className={`spice-pill ${item.spiciness}`}>
            <Flame size={12} />
            {item.spiciness}
          </span>
          {item.prepTime && (
            <span className="menu-card-time">
              <Clock size={13} />
              {item.prepTime}
            </span>
          )}
        </div>

        {/* Footer: Price & Add to Cart Button */}
        <div className="menu-card-footer">
          <div className="menu-card-price-container">
            <span className="menu-card-price-label">Price</span>
            <span className="menu-card-price">₹{item.price}</span>
          </div>

          <button
            id={`add-btn-${item.id}`}
            className={`btn-add-order ${justAdded ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${item.name} to order`}
          >
            {justAdded ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : inCartCount > 0 ? (
              <>
                <Plus size={16} />
                <span>Add More ({inCartCount})</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
