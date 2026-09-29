# 🌶️ Spice Route — Modern Restaurant Website

> **"Authentic Flavours. Modern Experience."**  
> A premium, responsive restaurant web application built with **React**, **Vite**, and modern **CSS3**. Perfect for restaurant showcases, client demos, and portfolio presentations.

---

## 🌟 Features Overview

- **Sticky Luxury Navbar:** Glassmorphism backdrop blur, live section tracking, mobile slide-out navigation, and animated Cart badge.
- **Cinematic Hero Section:** High-resolution food visuals with ambient glow, trust stats (4.9★ rating, 15+ years), and direct action buttons.
- **Story & Heritage Section:** Highlights royal Nizami & North Indian culinary roots, chef pedigree, and 3 core value cards (*Fresh Ingredients*, *Authentic Recipes*, *Master Chefs*).
- **Interactive Handcrafted Menu:**
  - Category filtering (*Starters, Biryani, Main Course, Desserts, Beverages*).
  - Dietary toggles (*All Dishes, Pure Veg, Non-Veg*).
  - Live instant search for dishes.
  - Interactive cards with Veg/Non-Veg indicators, spice level badges, prices, and one-click *Add to Order*.
- **Functional Online Order & Slide-Out Cart:**
  - Item counter, increment/decrement controls, item removal, and clear cart.
  - Order type selection (*Dine-in, Takeaway, Delivery*).
  - Promo code discounts (e.g. `SPICE15` for 15% off).
  - Automatic GST and delivery fee calculation.
  - **"Order on WhatsApp" Generator:** Formats selected dishes, quantities, customer details, and total into a ready-to-send WhatsApp message.
- **Table Reservation System:**
  - Booking form with date picker (min today), time slots, party size selector, and seating area preferences.
  - Real-time form validation.
  - Interactive Confirmation Card with a unique Reservation ID and celebratory confetti.
  - LocalStorage persistence.
- **Visual Photo Gallery & Lightbox:**
  - Ambiance, signature dishes, and kitchen photography.
  - Full-screen Lightbox modal with Next/Previous navigation and keyboard controls.
- **Guest Reviews & Ratings:**
  - 4.9★ aggregate scorecard banner.
  - Customer review cards with avatars, verified badges, and dish recommendations.
  - "Share Your Experience" modal allowing guests to submit reviews live.
- **Location & Contact:**
  - Banjara Hills, Hyderabad address with Google Maps preview.
  - Operating hours (11:00 AM – 11:00 PM).
  - Quick inquiry form with instant submission confirmation.
- **Modern Footer:** Quick navigation, VIP Club newsletter signup, social media links, and scroll-to-top button.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser and visit: `http://localhost:5173/`

### 3. Build for Production
```bash
npm run build
```
Production-ready files will be generated in the `dist/` directory.

---

## 📂 Project Structure

```
spice-route-restaurant/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky navigation & mobile drawer
│   │   ├── Hero.jsx            # Hero banner, stats & signature card
│   │   ├── About.jsx           # Brand story & key highlights
│   │   ├── Menu.jsx            # Menu controls, categories & search
│   │   ├── MenuCard.jsx        # Individual dish card
│   │   ├── Cart.jsx            # Slide-out cart & WhatsApp order engine
│   │   ├── Booking.jsx         # Table reservation & confirmation modal
│   │   ├── Gallery.jsx         # Photo gallery & fullscreen lightbox
│   │   ├── Reviews.jsx         # Guest testimonials & write review modal
│   │   ├── Contact.jsx         # Address, map, hours & inquiry form
│   │   ├── Footer.jsx          # Links, newsletter & copyright
│   │   └── Toast.jsx           # Floating notification toasts
│   ├── data/
│   │   ├── menuData.js         # Menu dishes, reviews & gallery photos
│   │   └── restaurantData.js   # Global restaurant configuration & details
│   ├── styles/
│   │   ├── index.css           # Global design system & theme variables
│   │   ├── Navbar.css
│   │   ├── Hero.css
│   │   ├── About.css
│   │   ├── Menu.css
│   │   ├── MenuCard.css
│   │   ├── Cart.css
│   │   ├── Booking.css
│   │   ├── Gallery.css
│   │   ├── Reviews.css
│   │   ├── Contact.css
│   │   └── Footer.css
│   ├── App.jsx                 # Main application component
│   └── main.jsx                # React root entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Customization Guide

### 1. Updating Menu Items, Prices & Images
All food items are stored in:
👉 [`src/data/menuData.js`](file:///c:/movies/myproject/src/data/menuData.js)

To add or update a dish:
```javascript
{
  id: "biryani-5",
  name: "Peshawari Chicken Biryani",
  category: "biryani", // 'starters' | 'biryani' | 'mains' | 'desserts' | 'beverages'
  price: 320,
  description: "Aromatic basmati rice cooked with saffron and spices.",
  isVeg: false,
  spiciness: "medium", // 'mild' | 'medium' | 'hot' | 'sweet'
  rating: 4.9,
  reviewCount: 85,
  isChefSpecial: true,
  isBestseller: false,
  image: "https://your-image-url.com/dish.jpg"
}
```

### 2. Changing Restaurant Details (Name, Phone, Address, Timings)
All global restaurant settings are centralized in:
👉 [`src/data/restaurantData.js`](file:///c:/movies/myproject/src/data/restaurantData.js)

Simply edit the fields:
- `name`: "Your Restaurant Name"
- `tagline`: "Your Tagline"
- `contact.phone`: Your phone number
- `contact.whatsapp`: WhatsApp number without '+' or spaces (e.g. `919876543210`)
- `contact.address`: Your physical address
- `timings.hours`: Your opening hours
- `discountPromo.code`: Custom promo code

---

## 🌐 How to Deploy to Vercel

Deploying this Vite React project to Vercel takes under 2 minutes:

1. Push your repository to **GitHub** / **GitLab** / **Bitbucket**.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**. Your website will be live with a free SSL certificate!

---

## 📸 Best Screenshots for Upwork / Freelance Portfolio

When showcasing this project to prospective restaurant clients on Upwork, Fiverr, or LinkedIn, capture these 5 high-converting screenshots:

1. **Hero + Navigation (Full Desktop):**
   - Shows the dark luxury aesthetic, typography, trust badges (4.9★ rating), and floating signature dish card.
2. **Interactive Menu Grid with Category Filters & Search:**
   - Highlights the food photography, Veg/Non-Veg indicators, spice level pills, and prices.
3. **Slide-Out Cart with WhatsApp Order Button:**
   - Demonstrates the interactive ordering workflow, discount calculation, and WhatsApp integration.
4. **Table Reservation Modal with Confirmation Code:**
   - Shows the booking form and the celebratory confirmation card with Reservation ID.
5. **Mobile Responsive View (Side-by-Side iPhone mockup):**
   - Highlights mobile responsiveness with the floating order button, mobile drawer menu, and clean touch-friendly layout.