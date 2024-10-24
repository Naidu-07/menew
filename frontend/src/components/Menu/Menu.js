import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleSendOrder = async (item) => {
        const quantity = quantities[item._id] || 0;
        if (quantity > 0) {
            try {
                await axios.post('http://localhost:5000/api/orders', {
                    itemId: item._id,
                    quantity,
                    tableId: location.state.tableId, // Pass tableId
                });
                alert(`Order for ${quantity} ${item.name}(s) sent!`);
                setQuantities(prev => ({ ...prev, [item._id]: 0 }));

                // Navigate back to Orders
                navigate('/orders', {
                    state: {
                        tableId: location.state.tableId // Pass tableId back
                    }
                });
            } catch (error) {
                console.error('Error sending order:', error);
            }
        } else {
            alert('Please enter a quantity greater than 0');
        }
    };

    return (
        <div className="menu-panel">
            <h2>Menu</h2>
            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item._id} className="menu-item">
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        <p>{item.description}</p>
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={quantities[item._id] || 0}
                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                min="0"
                            />
                        </label>
                        <button onClick={() => handleSendOrder(item)}>Send to Orders</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;