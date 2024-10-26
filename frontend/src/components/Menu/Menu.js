// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './Menu.css';

// const Menu = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [menuItems, setMenuItems] = useState([]);
//     const [quantities, setQuantities] = useState({});

//     useEffect(() => {
//         fetchMenuItems();
//     }, []);

//     const fetchMenuItems = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/menuitems');
//             setMenuItems(response.data);
//         } catch (error) {
//             console.error('Error fetching menu items:', error);
//         }
//     };

//     const handleQuantityChange = (itemId, value) => {
//         setQuantities(prev => ({ ...prev, [itemId]: value }));
//     };

//     const handleSendOrder = async (item) => {
//         const quantity = quantities[item._id] || 0;
//         if (quantity > 0) {
//             try {
//                 await axios.post('http://localhost:5000/api/orders', {
//                     itemId: item._id,
//                     quantity,
//                     tableId: location.state.tableId, // Pass tableId
//                 });
//                 alert(`Order for ${quantity} ${item.name}(s) sent!`);
//                 setQuantities(prev => ({ ...prev, [item._id]: 0 }));

//                 // Navigate back to Orders
//                 navigate('/orders', {
//                     state: {
//                         tableId: location.state.tableId // Pass tableId back
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error sending order:', error);
//             }
//         } else {
//             alert('Please enter a quantity greater than 0');
//         }
//     };

//     return (
//         <div className="menu-panel">
//             <h2>Menu</h2>
//             <div className="menu-items">
//                 {menuItems.map(item => (
//                     <div key={item._id} className="menu-item">
//                         <h3>{item.name}</h3>
//                         <p>Price: ${item.price}</p>
//                         <p>{item.description}</p>
//                         <label>
//                             Quantity:
//                             <input
//                                 type="number"
//                                 value={quantities[item._id] || 0}
//                                 onChange={(e) => handleQuantityChange(item._id, e.target.value)}
//                                 min="0"
//                             />
//                         </label>
//                         <button onClick={() => handleSendOrder(item)}>Send to Orders</button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Menu;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });

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
                itemId: item._id, // Store the item ID
                quantity: quantities[item._id], // Store the quantity ordered
            }));

        if (orders.length > 0) {
            try {
                await axios.post('http://localhost:5000/api/bookings', {
                    orders,
                    tableId: location.state.tableId,
                });

                alert('Orders sent successfully!');
                setQuantities({});
                navigate('/orders', {
                    state: { tableId: location.state.tableId },
                });
            } catch (error) {
                console.error('Error sending orders:', error);
                alert('There was an error sending your orders. Please try again.');
            }
        } else {
            alert('Please select at least one item before adding to orders.');
        }
    };

    const handleAddMenuItem = async () => {
        try {
            await axios.post('http://localhost:5000/api/menuitems', newItem);
            setShowModal(false);
            setNewItem({ name: '', price: '', description: '' });
            fetchMenuItems();
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    return (
        <div className="menu-panel">
            <h2>Menu</h2>
            <button onClick={() => setShowModal(true)}>Add Menu Item</button>

            {showModal && (
                <div className="modal">
                    <h3>Add New Menu Item</h3>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </label>
                    <button onClick={handleAddMenuItem}>Add Item</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            )}

            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item._id} className="menu-item">
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
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

export default Menu;

