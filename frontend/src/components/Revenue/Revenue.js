import React from 'react';
import './Revenue.css';

const Revenue = () => {
  const revenueData = [
    { title: 'Total Orders', value: 450 },
    { title: 'Total Revenue', value: '$12,350' },
    { title: 'Inventory Status', value: 'Low Stock' },
    { title: 'Active Users', value: 128 },
    { title: 'Customer Feedback', value: '95% Positive' },
    { title: 'Pending Orders', value: 15 },
  ];

  return (
    <div className="revenue-container">
      <h1 className="revenue-title">Revenue Overview</h1>
      <div className="revenue-cards">
        {revenueData.map((item, index) => (
          <div key={index} className="revenue-card">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-value">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Revenue;