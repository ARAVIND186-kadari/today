// Menu items data for Spice Route Restaurant
// Each item includes: id, name, category, price, description, isVeg, spiciness, rating, reviews, image, tags, prepTime

export const MENU_CATEGORIES = [
  { id: "all", label: "All Delicacies", icon: "UtensilsCrossed" },
  { id: "starters", label: "Starters & Tandoor", icon: "Flame" },
  { id: "biryani", label: "Royal Biryani", icon: "Crown" },
  { id: "mains", label: "Main Course", icon: "CookingPot" },
  { id: "desserts", label: "Desserts & Sweets", icon: "CakeSlice" },
  { id: "beverages", label: "Beverages & Chai", icon: "GlassWater" }
];

export const MENU_ITEMS = [
  // --- BIRYANI ---
  {
    id: "biryani-1",
    name: "Hyderabadi Chicken Dum Biryani",
    category: "biryani",
    price: 280,
    description: "Long-grain aged basmati rice slow-cooked on 'Dum' with tender marinated chicken, saffron, caramelised onions, and fresh mint. Served with Mirchi ka Salan & Raita.",
    isVeg: false,
    spiciness: "medium", // mild, medium, hot
    rating: 4.9,
    reviewCount: 342,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "20-25 mins",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "biryani-2",
    name: "Special Mutton Dum Biryani",
    category: "biryani",
    price: 350,
    description: "Tender succulently cooked baby goat meat layered with saffron infused basmati rice, royal spices, and pure desi ghee. Signature Nizam recipe.",
    isVeg: false,
    spiciness: "hot",
    rating: 4.9,
    reviewCount: 289,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "25 mins",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "biryani-3",
    name: "Paneer Subz Dum Biryani",
    category: "biryani",
    price: 240,
    description: "Marinated cottage cheese cubes, baby carrots, French beans, and green peas simmered with fragrant whole spices and saffron rice in sealed clay pots.",
    isVeg: true,
    spiciness: "medium",
    rating: 4.7,
    reviewCount: 165,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "20 mins",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "biryani-4",
    name: "Coastal Spiced Prawns Biryani",
    category: "biryani",
    price: 360,
    description: "Fresh coastal king prawns sautéed in stone-ground spices and curry leaves, layered with aromatic basmati rice and roasted cashews.",
    isVeg: false,
    spiciness: "medium",
    rating: 4.8,
    reviewCount: 118,
    isChefSpecial: true,
    isBestseller: false,
    prepTime: "25 mins",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
  },

  // --- STARTERS ---
  {
    id: "starter-1",
    name: "Tandoori Paneer Tikka",
    category: "starters",
    price: 220,
    description: "Fresh malai paneer cubes marinated in hung curd, Kashmiri red chili, ajwain, and mustard oil, char-grilled to golden smoky perfection.",
    isVeg: true,
    spiciness: "medium",
    rating: 4.8,
    reviewCount: 210,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "15 mins",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "starter-2",
    name: "Hyderabadi Chicken 65",
    category: "starters",
    price: 260,
    description: "Legendary fiery crisp chicken morsels tossed with fresh green chillies, crushed garlic, whole curry leaves, and secret Southern spice mix.",
    isVeg: false,
    spiciness: "hot",
    rating: 4.9,
    reviewCount: 305,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "15 mins",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "starter-3",
    name: "Crispy Gobi Manchurian",
    category: "starters",
    price: 190,
    description: "Crunchy cauliflower florets wok-tossed in ginger-garlic reduction, scallions, sweet chili, and soy glaze. An irresistible Indo-fusion classic.",
    isVeg: true,
    spiciness: "medium",
    rating: 4.6,
    reviewCount: 142,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "15 mins",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "starter-4",
    name: "Tandoori Malai Murgh Tikka",
    category: "starters",
    price: 290,
    description: "Boneless chicken chunks marinated in cream, cashew paste, cardamom, and mild green chillies, cooked gently over charcoal coals.",
    isVeg: false,
    spiciness: "mild",
    rating: 4.8,
    reviewCount: 198,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "18 mins",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
  },

  // --- MAIN COURSE ---
  {
    id: "mains-1",
    name: "Old Delhi Butter Chicken",
    category: "mains",
    price: 300,
    description: "Charcoal-smoked tandoori chicken simmered in a velvety, buttery tomato & cashew gravy infused with dried fenugreek leaves (kasuri methi).",
    isVeg: false,
    spiciness: "mild",
    rating: 4.9,
    reviewCount: 420,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "20 mins",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mains-2",
    name: "Paneer Butter Masala",
    category: "mains",
    price: 250,
    description: "Cubes of farm-fresh cottage cheese folded into a luscious, mildly sweet, and spiced tomato-butter gravy with fresh churned cream.",
    isVeg: true,
    spiciness: "mild",
    rating: 4.8,
    reviewCount: 275,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "18 mins",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mains-3",
    name: "Dal Makhani (24-hr Slow Cooked)",
    category: "mains",
    price: 210,
    description: "Whole black urad lentils and kidney beans slow-simmered overnight over charcoal embers, finished with white butter and aromatic cream.",
    isVeg: true,
    spiciness: "mild",
    rating: 4.9,
    reviewCount: 310,
    isChefSpecial: true,
    isBestseller: false,
    prepTime: "15 mins",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mains-4",
    name: "Mysore Special Masala Dosa",
    category: "mains",
    price: 120,
    description: "Crispy golden fermented crepe lined with spicy red chutney, stuffed with tempered potato bhaji, served with coconut chutney & piping hot sambar.",
    isVeg: true,
    spiciness: "medium",
    rating: 4.8,
    reviewCount: 230,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "12 mins",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mains-5",
    name: "Tandoori Garlic Butter Naan",
    category: "mains",
    price: 60,
    description: "Soft, pillowy clay oven baked artisan flatbread topped with toasted minced garlic, fresh coriander leaves, and generous melting butter.",
    isVeg: true,
    spiciness: "mild",
    rating: 4.9,
    reviewCount: 380,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
  },

  // --- DESSERTS ---
  {
    id: "dessert-1",
    name: "Royal Hyderabadi Shahi Tukda",
    category: "desserts",
    price: 150,
    description: "Golden fried crisp bread slices soaked in fragrant saffron cardamom syrup, topped with thick reduced rabri, pistachio slivers & pure silver leaf.",
    isVeg: true,
    spiciness: "sweet",
    rating: 4.9,
    reviewCount: 185,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "10 mins",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "dessert-2",
    name: "Hot Gulab Jamun with Rabri",
    category: "desserts",
    price: 120,
    description: "Two melt-in-mouth warm khoya dumplings infused with rose essence, served on a bed of chilled creamy kesar rabri and almond flakes.",
    isVeg: true,
    spiciness: "sweet",
    rating: 4.9,
    reviewCount: 260,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "dessert-3",
    name: "Kesar Pista Rasmalai",
    category: "desserts",
    price: 130,
    description: "Delicate cottage cheese patties soaked in thickened saffron-cardamom flavoured milk, garnished with Iranian pistachios.",
    isVeg: true,
    spiciness: "sweet",
    rating: 4.8,
    reviewCount: 140,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
  },

  // --- BEVERAGES ---
  {
    id: "bev-1",
    name: "Alphonso Mango Lassi",
    category: "beverages",
    price: 90,
    description: "Chilled and creamy handcrafted yogurt smoothie blended with ripe Ratnagiri Alphonso mango pulp, green cardamom, and crushed pistachios.",
    isVeg: true,
    spiciness: "sweet",
    rating: 4.9,
    reviewCount: 312,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bev-2",
    name: "Royal Rose Kulfi Falooda",
    category: "beverages",
    price: 140,
    description: "A decadent layered drink with traditional rose syrup, chewy basil seeds (sabja), falooda vermicelli, chilled milk, and a scoop of rich malai kulfi.",
    isVeg: true,
    spiciness: "sweet",
    rating: 4.8,
    reviewCount: 195,
    isChefSpecial: true,
    isBestseller: false,
    prepTime: "8 mins",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bev-3",
    name: "Hyderabadi Dum Irani Chai",
    category: "beverages",
    price: 50,
    description: "Authentic slow-simmered rich condensed milk tea brewed in copper vessels, served piping hot with 2 crisp Osmania biscuits.",
    isVeg: true,
    spiciness: "mild",
    rating: 4.9,
    reviewCount: 450,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "bev-4",
    name: "Spiced Masala Chaas",
    category: "beverages",
    price: 60,
    description: "Refreshing churned buttermilk tempered with roasted cumin, rock salt, ginger, green chillies, and freshly chopped coriander.",
    isVeg: true,
    spiciness: "mild",
    rating: 4.7,
    reviewCount: 120,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "5 mins",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
  }
];

export const REVIEWS_DATA = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Food & Travel Blogger",
    location: "Hyderabad",
    rating: 5,
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    comment: "The Hyderabadi Chicken Dum Biryani here is genuinely the best I've tasted in Banjara Hills. The rice is aromatic, meat melts off the bone, and the Shahi Tukda dessert was heavenly! 10/10 dining ambiance.",
    favoriteDish: "Hyderabadi Chicken Dum Biryani",
    verified: true
  },
  {
    id: 2,
    name: "Vikramaditya Rao",
    role: "Tech Executive",
    location: "Gachibowli",
    rating: 5,
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    comment: "Hosted a private family dinner of 14 people for my parents' anniversary. The hospitality was exceptional, the Tandoori starters arrived sizzling hot, and the WhatsApp ordering feature made taking leftovers effortless!",
    favoriteDish: "Tandoori Malai Murgh & Butter Naan",
    verified: true
  },
  {
    id: 3,
    name: "Ananya Iyer",
    role: "Culinary Critic & Author",
    location: "Secunderabad",
    rating: 5,
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    comment: "As someone who is very picky about vegetarian food, their Dal Makhani and Paneer Tikka blew me away. The subtle smoke aroma and rich texture prove they respect traditional slow-cooking methods.",
    favoriteDish: "Dal Makhani & Paneer Tikka",
    verified: true
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    role: "Regular Patron",
    location: "Jubilee Hills",
    rating: 5,
    date: "3 weeks ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    comment: "Spice Route has been our weekend family dinner spot for over 2 years now. Impeccable cleanliness, soothing music, courteous staff, and the Mango Lassi is to die for. Highly recommend booking a table early on weekends!",
    favoriteDish: "Special Mutton Biryani & Mango Lassi",
    verified: true
  },
  {
    id: 5,
    name: "Sarah Jenkins",
    role: "International Traveler",
    location: "London, UK",
    rating: 5,
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    comment: "My first time visiting India and my colleagues recommended Spice Route for genuine royal flavours. The spice levels were balanced perfectly for my palate and the staff explained every dish patiently. Unforgettable evening!",
    favoriteDish: "Butter Chicken & Garlic Naan",
    verified: true
  }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Royal Dining Hall",
    category: "ambiance",
    categoryLabel: "Ambiance",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    description: "Warm golden lighting, handcrafted teak wood tables, and intimate booth seating."
  },
  {
    id: 2,
    title: "Signature Dum Biryani Platter",
    category: "food",
    categoryLabel: "Signature Dishes",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    description: "Our signature Dum Biryani served with fresh mint garnish, salan, and raita."
  },
  {
    id: 3,
    title: "Master Chefs in Kitchen",
    category: "kitchen",
    categoryLabel: "Kitchen & Chefs",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80",
    description: "Executive Chef culinary team perfecting each plate with artful precision."
  },
  {
    id: 4,
    title: "Sizzling Tandoori Skewers",
    category: "food",
    categoryLabel: "Signature Dishes",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80",
    description: "Charcoal-grilled paneer and succulent kebabs fresh out of traditional clay tandoors."
  },
  {
    id: 5,
    title: "Rooftop Starlit Lounge",
    category: "ambiance",
    categoryLabel: "Ambiance",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80",
    description: "Open-air rooftop terrace overlooking the Hyderabad skyline under twinkling fairy lights."
  },
  {
    id: 6,
    title: "Artisan Desserts & Sweets",
    category: "food",
    categoryLabel: "Signature Dishes",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
    description: "Handcrafted traditional Indian sweets prepared fresh daily with pure desi ghee."
  },
  {
    id: 7,
    title: "Private Family Dining Cabana",
    category: "ambiance",
    categoryLabel: "Ambiance",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
    description: "Exclusive sound-dampened private enclosures for celebrations and corporate gatherings."
  },
  {
    id: 8,
    title: "Traditional Spice Blending",
    category: "kitchen",
    categoryLabel: "Kitchen & Chefs",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
    description: "Stone grinding whole spices every morning to preserve raw aromas and medicinal benefits."
  }
];
