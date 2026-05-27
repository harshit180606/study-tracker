# AI Study Planner & Performance Predictor

A full-stack machine learning web application that predicts 
student academic performance and provides personalized 
study recommendations.

## Live Demo
Frontend: https://endearing-tulumba-dafe29.netlify.app

## Architecture
React Frontend → Node.js Backend → Flask ML Service → MongoDB

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, JWT, bcrypt, MongoDB
- ML Service: Python, XGBoost, Scikit-learn, Flask, Docker
- Database: MongoDB Atlas
- Deployment: Netlify, Render

## ML Pipeline
- Dataset: Kaggle Student Performance (10,000 rows)
- Models compared: Linear Regression, Ridge, Random Forest, 
  XGBoost, SVR
- Final model: XGBoost tuned with Optuna (50 trials)
- Metrics: R² = 0.948, MAE = 2.4
- Clustering: K-Means (K=3) — Consistent, Passive, Burnout Risk

## Features
- JWT authentication
- Daily study logging
- ML performance prediction
- Student clustering and recommendations
- Progress chart over time
- Delete study logs

## Setup Instructions

### ML Service
cd ml-service
pip install -r requirements.txt
python app.py

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm run dev

## Environment Variables

### Backend .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=your_flask_url
PORT=8000

### Frontend .env
VITE_API_URL=your_backend_url