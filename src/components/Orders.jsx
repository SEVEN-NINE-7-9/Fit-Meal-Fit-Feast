import { useState, useEffect } from "react";
import { Package, X } from "lucide-react"; // ✅ added X icon

// Get orders from localStorage
const getOrders = () => {
  const ordersData = localStorage.getItem('healthEatsOrders');
  return ordersData ? JSON.parse(ordersData) : [];
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);

  // Load orders on mount and when localStorage changes
  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    const handleOrdersUpdate = () => {
      loadOrders();
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    window.addEventListener('storage', loadOrders);

    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  // ✅ Remove order function
  const removeOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    localStorage.setItem('healthEatsOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const activeOrders = orders.filter(order => order.status !== "Delivered");
  const historyOrders = orders.filter(order => order.status === "Delivered");

  const displayOrders = activeTab === "active" ? activeOrders : historyOrders;

  return (
    <div className="min-h-screen bg-green-50 py-10 flex flex-col items-center">
      <br></br>
      <br></br>
      <h2 className="text-3xl font-bold text-gray-800">
        Your <span className="text-green-600">Food Orders</span>
      </h2>
      <p className="text-gray-600 mt-2">
        Track your healthy meals and nutrition progress
      </p>

      {/* Tabs */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-2 rounded-md font-medium ${
            activeTab === "active"
              ? "bg-green-600 text-white"
              : "bg-white border text-gray-700"
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2 rounded-md font-medium ${
            activeTab === "history"
              ? "bg-green-600 text-white"
              : "bg-white border text-gray-700"
          }`}
        >
          Order History ({historyOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="w-full max-w-4xl mt-8 space-y-6 px-4">
        {displayOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {activeTab === "active" 
                ? "No active orders. Start ordering from Restaurants!" 
                : "No order history yet"}
            </p>
          </div>
        ) : (
          displayOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-100 relative"
            >
              {/* ✅ Cross button */}
              <button
                onClick={() => removeOrder(order.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                title="Remove Order"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {order.restaurant}
                </h3>
                <span
                  className={`inline-block mt-2 text-sm px-3 py-1 rounded-full ${
                    
                    order.status === "Preparing"
                      ? "bg-blue-100 text-blue-600"
                      : order.status === "Ready for Pickup"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 flex items-center gap-2">
                Order #{order.id} • {order.date}
              </p>

              {/* Items */}
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-md p-2 text-sm text-gray-700 mb-2 flex justify-between"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium">× {item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-3 text-center mt-4">
                <div>
                  <h4 className="text-green-700 font-semibold text-lg">
                    ₹{order.amount}
                  </h4>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>
                <div>
                  <h4 className="text-green-700 font-semibold text-lg">
                    {order.calories}
                  </h4>
                  <p className="text-sm text-gray-500">Total Calories</p>
                </div>
                <div>
                  <h4 className="text-green-700 font-semibold text-lg">
                    {order.match}%
                  </h4>
                  <p className="text-sm text-gray-500">Diet Plan Match</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5">
                <p className="text-sm mb-1 text-gray-600">Order Progress</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Order Placed</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 mt-5">
                <button className="text-sm px-4 py-2 rounded-md border hover:bg-gray-50">
                  📞 Call
                </button>
                <button className="text-sm px-4 py-2 rounded-md border hover:bg-gray-50">
                  💬 Support
                </button>
                <button className="text-sm px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                  📍 Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
