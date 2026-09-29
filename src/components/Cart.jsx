import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  Sparkles,
  Utensils,
  Bike,
  PackageCheck,
  CheckCircle2,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESTAURANT_INFO } from '../data/restaurantData';
import '../styles/Cart.css';

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}) => {
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in', 'takeaway', 'delivery'
  const [customerName, setCustomerName] = useState('');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [promoMessage, setPromoMessage] = useState('');

  // Subtotal Calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  // Discount Calculation
  const discountAmount = useMemo(() => {
    if (appliedDiscount > 0) {
      return Math.round((subtotal * appliedDiscount) / 100);
    }
    return 0;
  }, [subtotal, appliedDiscount]);

  // Taxes (5% GST for restaurants in India)
  const gstAmount = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    return Math.round(taxableAmount * 0.05);
  }, [subtotal, discountAmount]);

  // Delivery / Packaging fee
  const deliveryFee = useMemo(() => {
    if (orderType === 'delivery') {
      return subtotal > 600 ? 0 : 40;
    }
    if (orderType === 'takeaway') {
      return 20; // Packaging charge
    }
    return 0; // Dine-in has no extra fee
  }, [orderType, subtotal]);

  // Grand Total
  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + gstAmount + deliveryFee);
  }, [subtotal, discountAmount, gstAmount, deliveryFee]);

  // Apply Promo Code
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (code === RESTAURANT_INFO.discountPromo.code || code === 'SPICE10' || code === 'SPICE15') {
      const discountVal = code === 'SPICE15' ? 15 : 10;
      if (subtotal < 300) {
        setPromoMessage('Minimum order value of ₹300 required for this coupon');
        setAppliedDiscount(0);
      } else {
        setAppliedDiscount(discountVal);
        setPromoMessage(`🎉 ${discountVal}% Discount applied successfully!`);
      }
    } else {
      setPromoMessage('Invalid promo code. Try "SPICE15"');
      setAppliedDiscount(0);
    }
  };

  // Trigger WhatsApp Order
  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // Build WhatsApp message
    let message = `🍽️ *NEW ORDER - SPICE ROUTE RESTAURANT*\n`;
    message += `───────────────────────\n`;
    message += `📍 *Order Type:* ${orderType.toUpperCase()}\n`;
    if (customerName.trim()) {
      message += `👤 *Customer Name:* ${customerName.trim()}\n`;
    }
    if (tableOrAddress.trim()) {
      message += `📌 *${orderType === 'dine-in' ? 'Table No.' : 'Delivery/Pickup Address'}:* ${tableOrAddress.trim()}\n`;
    }
    message += `───────────────────────\n`;
    message += `*ORDER ITEMS:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    message += `───────────────────────\n`;
    message += `*Subtotal:* ₹${subtotal}\n`;
    if (discountAmount > 0) {
      message += `*Discount:* -₹${discountAmount} (${appliedDiscount}% OFF)\n`;
    }
    message += `*GST (5%):* ₹${gstAmount}\n`;
    if (deliveryFee > 0) {
      message += `*Packaging / Delivery:* ₹${deliveryFee}\n`;
    }
    message += `*GRAND TOTAL:* ₹${grandTotal}\n`;
    message += `───────────────────────\n`;

    if (specialInstructions.trim()) {
      message += `📝 *Notes:* ${specialInstructions.trim()}\n\n`;
    }

    message += `Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.contact.whatsapp}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={22} color="var(--gold-light)" />
            <span>Your Order</span>
            <span className="cart-header-count">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <button
            id="close-cart-btn"
            className="btn-icon btn-secondary"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        {cartItems.length > 0 ? (
          <>
            {/* Scrollable Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">₹{item.price * item.quantity}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '6px' }}>
                      (₹{item.price} each)
                    </span>
                  </div>

                  {/* Qty Controls */}
                  <div className="cart-qty-ctrls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="cart-qty-count">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    className="cart-item-remove"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Type & Additional Info */}
            <div className="cart-options-section">
              <div className="cart-order-type-tabs">
                <button
                  className={`order-type-btn ${orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => setOrderType('dine-in')}
                >
                  <Utensils size={14} />
                  <span>Dine-In</span>
                </button>
                <button
                  className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                  onClick={() => setOrderType('takeaway')}
                >
                  <PackageCheck size={14} />
                  <span>Takeaway</span>
                </button>
                <button
                  className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                  onClick={() => setOrderType('delivery')}
                >
                  <Bike size={14} />
                  <span>Delivery</span>
                </button>
              </div>

              {/* Optional Fields for WhatsApp text */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Your Name (optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="cart-promo-input"
                />
                <input
                  type="text"
                  placeholder={orderType === 'dine-in' ? 'Table No. (e.g. 12)' : 'Address / Area'}
                  value={tableOrAddress}
                  onChange={(e) => setTableOrAddress(e.target.value)}
                  className="cart-promo-input"
                />
              </div>

              {/* Promo code input */}
              <div className="cart-promo-box">
                <input
                  type="text"
                  placeholder="Coupon: SPICE15"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="cart-promo-input"
                />
                <button className="btn btn-outline-gold btn-sm" onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>
              {promoMessage && (
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: appliedDiscount > 0 ? 'var(--veg)' : 'var(--nonveg)'
                  }}
                >
                  {promoMessage}
                </span>
              )}
            </div>

            {/* Bill Summary & WhatsApp Action */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="cart-summary-row discount">
                  <span>Coupon Discount ({appliedDiscount}%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="cart-summary-row">
                <span>GST (5%)</span>
                <span>₹{gstAmount}</span>
              </div>

              {orderType !== 'dine-in' && (
                <div className="cart-summary-row">
                  <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Packaging'}</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
              )}

              <div className="cart-summary-row total">
                <span>Total Amount</span>
                <span className="cart-summary-total-price">₹{grandTotal}</span>
              </div>

              {/* WhatsApp Order Action */}
              <button
                id="cart-whatsapp-order-btn"
                className="btn-whatsapp-order"
                onClick={handleWhatsAppOrder}
              >
                <Send size={18} />
                <span>Order on WhatsApp</span>
              </button>

              <button className="cart-clear-btn" onClick={onClearCart}>
                Clear entire order
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingBag size={34} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>
              Your Plate is Empty
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Looks like you haven't added any authentic delicacies yet.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Sparkles size={16} />
              <span>Explore Delicious Menu</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
