import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Award,
  Leaf,
  ShoppingCart,
  Plus,
  Minus,
  Heart
} from "lucide-react";

// Restaurant data
const restaurantsData = [
  {
    id: "1",
    name: "Green Garden Bistro",
    cuisine: "Healthy",
    rating: 4.8,
    deliveryTime: "25-35 min",
    distance: "2.1 km",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    isPartner: true,
    healthScore: 95,
    priceRange: "₹₹",
    menu: [
      {
        id: "1",
        name: "Quinoa Power Bowl",
        description: "Quinoa, grilled chicken, avocado, mixed greens, and tahini dressing",
        price: 350,
        calories: 450,
        category: "Fit & Fresh Bowls",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 98
      },
      {
        id: "2",
        name: "Grilled Salmon Plate",
        description: "Fresh salmon with steamed vegetables and brown rice",
        price: 450,
        calories: 400,
        category: "Lean & Clean Mains",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 95
      },
      {
        id: "3",
        name: "Rainbow Buddha Bowl",
        description: "Mixed vegetables, chickpeas, quinoa, and herb dressing",
        price: 320,
        calories: 380,
        category: "Fit & Fresh Bowls",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 92
      }
    ]
  },
  {
    id: "2",
    name: "Fit Food Co.",
    cuisine: "Continental",
    rating: 4.6,
    deliveryTime: "30-40 min",
    distance: "1.8 km",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    isPartner: true,
    healthScore: 92,
    priceRange: "₹₹₹",
    menu: [
      {
        id: "6",
        name: "Protein Smoothie Bowl",
        description: "Blended berries, protein powder, topped with nuts and seeds",
        price: 280,
        calories: 350,
        category: "Power Breakfast",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 92
      }
    ]
  },
  {
    id: "3",
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.4,
    deliveryTime: "35-45 min",
    distance: "3.2 km",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    isPartner: false,
    healthScore: 78,
    priceRange: "₹₹",
    menu: [
      {
        id: "9",
        name: "Dal Tadka with Brown Rice",
        description: "Traditional lentil curry with healthy brown rice",
        price: 220,
        calories: 380,
        category: "Wholesome Classics",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
        isRecommended: false,
        nutritionMatch: 75
      }
    ]
  },
  {
    id: "4",
    name: "Olive Branch Kitchen",
    cuisine: "Mediterranean",
    rating: 4.7,
    deliveryTime: "25-35 min",
    distance: "2.5 km",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    isPartner: true,
    healthScore: 89,
    priceRange: "₹₹₹",
    menu: [
      {
        id: "11",
        name: "Mediterranean Hummus Bowl",
        description: "Fresh hummus, vegetables, olives, and whole grain pita",
        price: 290,
        calories: 360,
        category: "Heart Healthy Classics",
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 90
      }
    ]
  },
  {
    id: "5",
    name: "Harvest Table",
    cuisine: "Farm Fresh",
    rating: 4.5,
    deliveryTime: "30-40 min",
    distance: "3.8 km",
    image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80",
    isPartner: true,
    healthScore: 93,
    priceRange: "₹₹₹",
    menu: [
      {
        id: "14",
        name: "Farm Fresh Salad",
        description: "Seasonal vegetables, organic greens, and herb vinaigrette",
        price: 350,
        calories: 260,
        category: "Garden to Table",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 96
      }
    ]
  },
  {
    id: "6",
    name: "Pure Energy Bar",
    cuisine: "Juice & Smoothies",
    rating: 4.6,
    deliveryTime: "15-25 min",
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    isPartner: true,
    healthScore: 96,
    priceRange: "₹₹",
    menu: [
      {
        id: "17",
        name: "Green Machine Smoothie",
        description: "Kale, spinach, apple, ginger, and coconut water",
        price: 200,
        calories: 180,
        category: "Detox Delights",
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&q=80",
        isRecommended: true,
        nutritionMatch: 95
      }
    ]
  }
];

// Get orders from localStorage
const getOrders = () => {
  const ordersData = localStorage.getItem('healthEatsOrders');
  return ordersData ? JSON.parse(ordersData) : [];
};

// Save orders to localStorage
const saveOrders = (orders) => {
  localStorage.setItem('healthEatsOrders', JSON.stringify(orders));
};

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();


  const cuisines = ["All Cuisines", "Healthy", "Continental", "Indian", "Mediterranean", "Farm Fresh", "Juice & Smoothies"];

  const filteredRestaurants = restaurantsData.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "all" || 
                          restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
    return matchesSearch && matchesCuisine;
  });

  const addToCart = (menuItem) => {
    setCart(prev => ({
      ...prev,
      [menuItem.id]: (prev[menuItem.id] || 0) + 1
    }));
    showToastNotification(`${menuItem.name} added to cart`);
  };

  const removeFromCart = (menuItemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[menuItemId] > 1) {
        newCart[menuItemId]--;
      } else {
        delete newCart[menuItemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const addOrder = (order) => {
  const existingOrders = getOrders(); // get current orders from localStorage
  saveOrders([order, ...existingOrders]); // save new order at top
  window.dispatchEvent(new Event("ordersUpdated")); // notify Orders page
};


  const handleCheckout = () => {
    if (!selectedRestaurant || getTotalItems() === 0) return;

    const orderedItems = selectedRestaurant.menu
      .filter(item => cart[item.id])
      .map(item => ({
        name: item.name,
        quantity: cart[item.id],
        price: item.price,
        calories: item.calories,
        nutritionMatch: item.nutritionMatch
      }));

    const totalAmount = orderedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCalories = orderedItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
    const avgMatch = Math.round(
      orderedItems.reduce((sum, item) => sum + item.nutritionMatch, 0) / orderedItems.length
    );

    const newOrder = {
      id: `ORD${String(Date.now()).slice(-6)}`,
      restaurant: selectedRestaurant.name,
      date: new Date().toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true 
      }),
      items: orderedItems,
      amount: totalAmount,
      calories: totalCalories,
      match: avgMatch,
       phone: "+919876543210",     // ✅ Add here
      status: "Preparing",
      progress: 25,
      eta: selectedRestaurant.deliveryTime
    };

    // Save to localStorage
    const existingOrders = getOrders();
    saveOrders([newOrder, ...existingOrders]);

    // Dispatch custom event to notify Orders component
    window.dispatchEvent(new Event('ordersUpdated'));

    setCart({});
    setSelectedRestaurant(null);
    showToastNotification("Order placed successfully! 🎉 Check Orders tab");
    navigate("/orders");
  };

  // Restaurant Detail View
  if (selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="relative h-64 bg-linear-to-r from-emerald-600 to-teal-600">
          <img 
            src={selectedRestaurant.image} 
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{selectedRestaurant.name}</h1>
                {selectedRestaurant.isPartner && (
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Partner
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedRestaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedRestaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedRestaurant.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  <span>Health Score: {selectedRestaurant.healthScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => setSelectedRestaurant(null)}
            className="mb-6 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
          >
            ← Back to Restaurants
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Menu */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Heart className="h-6 w-6 mr-2 text-emerald-600" />
                  <div>
                    <h2 className="text-2xl font-bold">Recommended for Your Diet Plan</h2>
                    <p className="text-gray-600">These items match your nutritional goals</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {selectedRestaurant.menu.map((item) => (
                    <div 
                      key={item.id} 
                      className={`border-2 rounded-xl p-4 ${
                        item.isRecommended 
                          ? 'border-emerald-200 bg-emerald-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                {item.isRecommended && (
                                  <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                    {item.nutritionMatch}% Match
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="font-semibold text-gray-900">₹{item.price}</span>
                                <span>{item.calories} cal</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {cart[item.id] && (
                                <>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="font-medium w-6 text-center">{cart[item.id]}</span>
                                </>
                              )}
                              <button
                                onClick={() => addToCart(item)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                    Your Order
                  </h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    {getTotalItems()} items
                  </span>
                </div>
                
                {getTotalItems() === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {selectedRestaurant.menu.map((item) => {
                      const quantity = cart[item.id];
                      if (!quantity) return null;
                      return (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">₹{item.price} × {quantity}</p>
                          </div>
                          <p className="font-semibold">₹{item.price * quantity}</p>
                        </div>
                      );
                    })}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold text-lg mb-4">
                        <span>Total:</span>
                        <span>₹{selectedRestaurant.menu.reduce((total, item) => {
                          const quantity = cart[item.id] || 0;
                          return total + (item.price * quantity);
                        }, 0)}</span>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Restaurant List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">
              <br></br>
              <span className="text-emerald-600">Healthy</span> Restaurants Near You
            </h1>
            <p className="text-xl text-gray-600">
              Discover restaurants that match your diet plan and health goals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="appearance-none w-full md:w-48 px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="all">All Cuisines</option>
                  {cuisines.slice(1).map((cuisine) => (
                    <option key={cuisine} value={cuisine.toLowerCase()}>
                      {cuisine}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {restaurant.isPartner && (
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Partner
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ml-auto">
                    <Leaf className="h-3 w-3 text-emerald-600" />
                    {restaurant.healthScore}%
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  <span className="text-gray-600 font-medium">{restaurant.priceRange}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>
                
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Restaurants;