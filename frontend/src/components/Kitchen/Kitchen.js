import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Kitchen = () => {
    const location = useLocation();
    const { orderDetails } = location.state || {};
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState({}); // To store menu items by ID

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/menuitems');
                const items = await response.json();
                const itemMap = items.reduce((acc, item) => {
                    acc[item._id] = item; // Store items by ID for easy access
                    return acc;
                }, {});
                setMenuItems(itemMap);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        const savedOrders = JSON.parse(localStorage.getItem('kitchenOrders')) || [];

        if (orderDetails) {
            const orderExists = savedOrders.some(order => order.bookingId === orderDetails.bookingId);
            if (!orderExists) {
                savedOrders.push(orderDetails);
                localStorage.setItem('kitchenOrders', JSON.stringify(savedOrders));
            }
        }

        setOrders(savedOrders);
        fetchMenuItems(); // Fetch menu items when the component mounts
    }, [orderDetails]);

    const handleRemoveOrder = (index) => {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
        localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));
    };

    return (
        <div className="kitchen-container">
            <h2>Kitchen Orders</h2>
            {orders.length > 0 ? (
                <div>
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
                                        {order.orderedItems.map((item, idx) => {
                                            const menuItem = menuItems[item.itemId]; // Get menu item details
                                            return (
                                                <li key={idx}>
                                                    {menuItem ? `${menuItem.name} (Quantity: ${item.quantity})` : 'Unknown Item'}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No items ordered.</p>
                                )}
                            </div>
                            <button onClick={() => handleRemoveOrder(index)}>Remove Order</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders in the kitchen.</p>
            )}
        </div>
    );
};

export default Kitchen;
