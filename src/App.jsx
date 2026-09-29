import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Booking from './components/Booking';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ToastContainer from './components/Toast';
import { ShoppingBag, Calendar } from 'lucide-react';
import './styles/index.css';

function App() {
  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('spice_route_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Save cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spice_route_cart', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  // Toast Helper
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added "${item.name}" to your order!`);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveItem = (itemId) => {
    const itemToRemove = cartItems.find((i) => i.id === itemId);
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.name}" from order.`);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart has been cleared.');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Sticky Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onAddToCart={handleAddToCart} />
        <About />
        <Menu onAddToCart={handleAddToCart} cartItems={cartItems} />
        <Booking />
        <Gallery />
        <Reviews />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Action Button for Mobile/Tablet */}
      {totalCartCount > 0 && (
        <button
          className="floating-order-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Cart"
        >
          <ShoppingBag size={20} />
          <span>Order ({totalCartCount})</span>
        </button>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
