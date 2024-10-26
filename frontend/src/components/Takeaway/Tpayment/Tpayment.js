import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const PaymentPage = () => {
    const location = useLocation();
    const { orderId } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${id}`);
            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                console.error('Error fetching order details:', errorText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setOrderDetails(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            alert('Could not fetch order details. Please try again.');
        }
    };
    

    const handlePrint = () => {
        window.print();
    };

    const handleSendToKitchen = () => {
        // Implement the logic to send order details to the kitchen
        alert('Order has been sent to the kitchen!');
    };

    if (!orderDetails) {
        return <p>Loading order details...</p>;
    }

    // Calculate total bill
    const totalBill = orderDetails.orderedItems.reduce((total, item) => {
        return total + (item.itemId.price * item.quantity);
    }, 0);

    return (
        <div>
            <h2>Payment for Order ID: {orderDetails._id}</h2>
            <ul>
                {orderDetails.orderedItems.map(item => (
                    <li key={item.itemId._id}>
                        Item: {item.itemId.name} - 
                        Quantity: {item.quantity} - 
                        Price: ${item.itemId.price.toFixed(2)} - 
                        Total: ${(item.itemId.price * item.quantity).toFixed(2)}
                    </li>
                ))}
            </ul>
            <h4>Total Bill: ${totalBill.toFixed(2)}</h4>
            
            <h3>QR Code for Payment:</h3>
            <QRCodeSVG value={`Payment for Order ID: ${orderDetails._id} - Total: ${totalBill.toFixed(2)}`} />

            <div>
                <button onClick={handlePrint}>Print Bill</button>
                <button onClick={handleSendToKitchen}>Send to Kitchen</button>
            </div>
        </div>
    );
};

export default PaymentPage;
