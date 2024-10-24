import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemDescription, setItemDescription] = useState('');

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

    const handleAddItemClick = () => {
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newItem = { name: itemName, price: itemPrice, description: itemDescription };

        try {
            const response = await axios.post('http://localhost:5000/api/menuitems', newItem);
            setMenuItems([...menuItems, response.data]); // Add the new item to the list
            setItemName('');
            setItemPrice('');
            setItemDescription('');
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding menu item:', error);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
    };

    return (
        <div className="menu-panel">
            <div className="menu-header">
                <h2>Menu</h2>
                <button onClick={handleAddItemClick}>Add Item</button>
            </div>
            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Item</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Item Name:
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Add</button>
                            <button type="button" onClick={handleClose}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item._id} className="menu-item">
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price}</p>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
