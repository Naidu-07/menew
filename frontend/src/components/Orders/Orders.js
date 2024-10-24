import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        // Populate orders with bookings data
        const initialOrders = response.data.map(booking => ({
          tableId: booking.tableId,
          bookingId: booking._id, // Using booking ID as order ID
          menuAdded: false,
          sentToKitchen: false,
          name: booking.name,
          members: booking.members,
        }));
        setOrders(initialOrders);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleAddMenu = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].menuAdded = true;
    setOrders(updatedOrders);
  };

  const handleSendToKitchen = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].sentToKitchen = true;
    updatedOrders[index].status = 'In Kitchen';
    setOrders(updatedOrders);
    alert(`Order for Table ID ${updatedOrders[index].tableId} sent to the kitchen!`);
  };

  return (
    <div className="order-container">
      <h2>Your Orders</h2>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            <h4>Table ID: {order.tableId}</h4>
            <p><strong>Booking ID:</strong> {order.bookingId}</p>
            <p><strong>Booked By:</strong> {order.name}</p>
            <p><strong>Members:</strong> {order.members}</p>

            <div className="order-actions">
              {!order.menuAdded ? (
                <button
                  className="add-menu-btn"
                  onClick={() => handleAddMenu(index)}
                >
                  View Menu
                </button>
              ) : (
                !order.sentToKitchen && (
                  <button
                    className="send-kitchen-btn"
                    onClick={() => handleSendToKitchen(index)}
                  >
                    Send to Kitchen
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
