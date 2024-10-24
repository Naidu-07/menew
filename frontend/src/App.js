import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bookings from './components/Tables/Booking/Booking';
import Orders from './components/Orders/Orders';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Tables from './components/Tables/Tables';
import Menu from './components/Menu/Menu';
import Revenue from './components/Revenue/Revenue';
import './App.css';

const App = () => {
    return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tables" element={<Tables/>} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/bookings" element={<Bookings />} />
            </Routes>
    );
};

export default App;
