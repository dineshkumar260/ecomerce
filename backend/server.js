const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowed = ['https://ecommerce-eight-sand-12.vercel.app', 'http://localhost:5173'];
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

console.log('Backend starting with CORS allowed for:', 'https://ecommerce-eight-sand-12.vercel.app');


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Payment Mock Route
app.post('/api/payments/create-order', (req, res) => {
    // Mock Razorpay order creation
    const { amount } = req.body;
    res.json({
        id: 'order_' + Math.floor(Math.random() * 1000000),
        amount: amount * 100,
        currency: 'INR'
    });
});

app.post('/api/payments/verify', (req, res) => {
    // Mock Razorpay payment verification
    res.json({ success: true, message: 'Payment verified successfully.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
