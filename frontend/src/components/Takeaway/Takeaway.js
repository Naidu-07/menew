import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Takeaway.css';

const Takeaway = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menuitems');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleQuantityChange = (itemId, value) => {
        setQuantities(prev => ({ ...prev, [itemId]: value }));
    };

    const handleAddToOrders = async () => {
        const orders = menuItems
            .filter(item => quantities[item._id] > 0)
            .map(item => ({
                itemId: item._id,
                quantity: quantities[item._id],
            }));

        if (orders.length > 0) {
            try {
                // Assuming you want to send orders to a different endpoint
                await axios.post('http://localhost:5000/api/orders', {
                    orderedItems: orders,
                });

                alert('Orders sent successfully!');
                
                // Reset quantities
                setQuantities({});
                // Navigate to the Torders page after sending the order
                navigate('/torders');
            } catch (error) {
                console.error('Error sending orders:', error);
                alert('There was an error sending your orders. Please try again.');
            }
        } else {
            alert('Please select at least one item before adding to orders.');
        }
    };

    return (
        <div className="menu-panel">
            <h2>Takeaway Menu</h2>

            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item._id} className="menu-item">
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        
                        {/* Quantity Label and Input */}
                        <label className="quantity-label">Quantity:</label>
                        <div className="quantity-controls">
                            <button onClick={() => handleQuantityChange(item._id, (quantities[item._id] || 0) + 1)}>+</button>
                            <input
                                type="number"
                                value={quantities[item._id] || 0}
                                readOnly
                                min="0"
                            />
                            <button onClick={() => handleQuantityChange(item._id, Math.max((quantities[item._id] || 0) - 1, 0))}>-</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add to Orders Button */}
            <div className="button-container">
                <button 
                    onClick={handleAddToOrders} 
                    disabled={!Object.values(quantities).some(q => q > 0)}
                >
                    Add to Orders
                </button>
            </div>
        </div>
    );
};

export default Takeaway;
