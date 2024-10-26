import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Torders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <h2>Current Orders</h2>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <h3>Order ID: {order._id}</h3>
                            <ul>
                                {order.orderedItems.map(item => (
                                    <li key={item.itemId._id}>
                                        Item: {item.itemId.name} - Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Torders;
