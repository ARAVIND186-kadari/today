import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Flame,
  Crown,
  CookingPot,
  CakeSlice,
  GlassWater,
  Search,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import MenuCard from './MenuCard';
import '../styles/Menu.css';

// Icon map for dynamic category tab icons
const categoryIconMap = {
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Flame: <Flame size={18} />,
  Crown: <Crown size={18} />,
  CookingPot: <CookingPot size={18} />,
  CakeSlice: <CakeSlice size={18} />,
  GlassWater: <GlassWater size={18} />
};

const Menu = ({ onAddToCart, cartItems }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'nonveg'
  const [searchQuery, setSearchQuery] = useState('');

  // Cart item count map for instant lookup
  const cartCounts = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.id] = (map[item.id] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  // Filtered dishes
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

      // Dietary filter
      const matchesDiet =
        dietFilter === 'all' ||
        (dietFilter === 'veg' && item.isVeg) ||
        (dietFilter === 'nonveg' && !item.isVeg);

      // Search query filter (matches name or description)
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDiet && matchesSearch;
    });
  }, [activeCategory, dietFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setDietFilter('all');
    setSearchQuery('');
  };

  return (
    <section id="menu" className="menu-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-subtitle">
            <Sparkles size={14} />
            Handcrafted Menu
          </span>
          <h2 className="section-title">Explore Our Royal Delicacies</h2>
          <p className="section-desc">
            Each recipe is prepared to order using slow-simmered aromatic masalas,
            farm-fresh produce, and age-old culinary secrets from Hyderabad Nizams.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="menu-controls">
          {/* Top Row: Search Box & Diet Filter Toggles */}
          <div className="menu-search-and-diet-row">
            {/* Search Bar */}
            <div className="menu-search-box">
              <Search className="menu-search-icon" size={18} />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search dishes (e.g. Biryani, Butter Chicken, Paneer...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
              {searchQuery && (
                <button
                  className="menu-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Diet Filter Buttons */}
            <div className="menu-diet-toggles">
              <button
                className={`diet-toggle-btn ${dietFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDietFilter('all')}
              >
                All Dishes
              </button>
              <button
                className={`diet-toggle-btn ${dietFilter === 'veg' ? 'active veg-active' : ''}`}
                onClick={() => setDietFilter('veg')}
              >
                <span className="badge-diet veg"></span>
                <span>Pure Veg</span>
              </button>
              <button
                className={`diet-toggle-btn ${dietFilter === 'nonveg' ? 'active nonveg-active' : ''}`}
                onClick={() => setDietFilter('nonveg')}
              >
                <span className="badge-diet nonveg"></span>
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="menu-category-tabs">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {categoryIconMap[cat.icon]}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Meta Info */}
        <div className="menu-results-count">
          Showing <strong>{filteredItems.length}</strong> delicacies
          {activeCategory !== 'all' && ` in ${MENU_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          {dietFilter !== 'all' && ` (${dietFilter === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'})`}
        </div>

        {/* Menu Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                inCartCount={cartCounts[item.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="menu-empty-state">
            <div className="menu-empty-icon">
              <Search size={32} />
            </div>
            <h3 className="menu-empty-title">No Delicacies Found</h3>
            <p className="menu-empty-desc">
              We couldn't find any dishes matching your search query "<strong>{searchQuery}</strong>".
              Try checking the spelling or resetting your filters.
            </p>
            <button className="btn btn-outline-gold" onClick={handleResetFilters}>
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
