import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/bookings');
                const initialOrders = response.data.map(booking => ({
                    tableId: booking.tableId,
                    bookingId: booking._id,
                    name: booking.name,
                    members: booking.members,
                    orderedItems: booking.orderedItems
                }));
                setOrders(initialOrders);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/menuitems');
                const items = response.data.reduce((acc, item) => {
                    acc[item._id] = item; // Store menu items by ID
                    return acc;
                }, {});
                setMenuItems(items);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchBookings();
        fetchMenuItems();
    }, []);

    const handleAddMenu = (tableId) => {
        // Redirect to menu with the selected table ID
    };

    const handleSendToKitchen = (index) => {
        const orderDetails = orders[index];
        navigate('/kitchen', { state: { orderDetails } }); // Send order to Kitchen
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
                                    {order.orderedItems.map((orderedItem, idx) => {
                                        const menuItem = menuItems[orderedItem.itemId]; // Fetch item details
                                        return (
                                            <li key={idx}>
                                                {menuItem ? `${menuItem.name} (Quantity: ${orderedItem.quantity})` : 'Unknown Item'}
                                            </li>
                                        );
                                    })}
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
