import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const location = useLocation();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bookings');
                const initialOrders = response.data.map(booking => ({
                    tableId: booking.tableId,
                    bookingId: booking._id,
                    name: booking.name,
                    members: booking.members,
                    orderedItems: booking.orderedItems // Get ordered items directly from booking
                }));
                setOrders(initialOrders);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const handleAddMenu = (tableId) => {
        // Redirect to menu with the selected table ID
        // Assuming you want to handle this navigation separately
    };

    const handleSendToKitchen = (index) => {
        // Handle sending orders to kitchen
        alert(`Order for Table ID ${orders[index].tableId} sent to the kitchen!`);

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
                        <div>
                            <strong>Ordered Items:</strong>
                            {order.orderedItems.length > 0 ? (
                                <ul>
                                    {order.orderedItems.map((orderedItem, idx) => (
                                        <li key={idx}>
                                            {/* Fetch item details by ID or maintain item reference in orderedItems */}
                                            Item ID: {orderedItem.itemId} (Quantity: {orderedItem.quantity})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No items ordered yet.</p>
                            )}
                        </div>

                        <div className="order-actions">
                            <Link to='/menu' state={{ tableId: order.tableId }}>
                                <button onClick={() => handleAddMenu(order.tableId)}>
                                    View Menu
                                </button>
                            </Link>
                            <button onClick={() => handleSendToKitchen(index)}>
                                Send to Kitchen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;