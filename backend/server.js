const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit")
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const studyRoutes = require('./routes/studyRoutes');

const app=express();
app.use(cors());
app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,  // 100 requests per 15 mins   
    message: { error: "Too many requests, please try again later" }
})

app.use(limiter)
app.use('/api/auth', authRoutes);

app.use('/api/study', studyRoutes);

app.get('/health', (req,res)=>{
    res.json({status: 'ok'});
});

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });
