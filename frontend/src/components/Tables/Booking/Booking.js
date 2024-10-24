import React, { useState } from 'react';
import './Booking.css';

const Modal = ({ onClose, onBook }) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(name, members); 
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Book Table</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </label>
          <label>
            Number of Members:
            <input 
              type="number" 
              value={members} 
              onChange={(e) => setMembers(e.target.value)} 
              required 
              min="1" 
            />
          </label>
          <button type="submit">Book</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
