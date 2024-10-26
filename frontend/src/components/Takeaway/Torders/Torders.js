import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Torders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

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

    const handlePayment = (orderId) => {
        navigate('/tpayment', { state: { orderId } });
    };

    return (
        <div>
            <h2>Current Orders</h2>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <ul>
                    {orders.map(order => {
                        const totalBill = order.orderedItems.reduce((total, item) => {
                            return total + (item.itemId.price * item.quantity);
                        }, 0);

                        return (
                            <li key={order._id}>
                                <h3>Order ID: {order._id}</h3>
                                <ul>
                                    {order.orderedItems.map(item => (
                                        <li key={item.itemId._id}>
                                            Item: {item.itemId.name} - 
                                            Quantity: {item.quantity} - 
                                            Price: ${item.itemId.price.toFixed(2)} - 
                                            Total: ${(item.itemId.price * item.quantity).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                                <h4>Total Bill: ${totalBill.toFixed(2)}</h4>
                                <button onClick={() => handlePayment(order._id)}>
                                    Continue to Payment
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Torders;
