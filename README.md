# Events Booking Platform

A comprehensive full-stack web application designed for booking events and services. The platform supports multiple user roles including Users, Event Owners (Providers), and Admins, each with their own dedicated dashboards and features.

##  Features

### User Features
- Browse available events and services.
- View detailed service information and pricing.
- Book services/events.
- View and manage personal bookings.
- Interactive maps for location-based services.

### Event Owner (Provider) Features
- Dedicated dashboard.
- Create, update, and manage services.
- View and manage bookings for their services.

### Admin Features
- Comprehensive admin dashboard.
- Manage users and event owners (Role-Based Access Control).
- Manage service categories.
- Oversee all services and platform bookings.

## Tech Stack

**Frontend:**
- React 19 (Vite)
- TypeScript
- Redux Toolkit (State Management)
- React Router DOM
- React Leaflet (Maps)
- Recharts (Data Visualization)
- Tailwind CSS / Custom CSS

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT) & bcrypt for authentication
- Zod for Data Validation
- Multer & Cloudinary for File/Image Uploads
- Swagger UI for API Documentation

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary Account (for image uploads)

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd events-booking
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on your requirements (refer to environment variables below).

Run the backend development server:
```bash
npm run dev
```
*The backend server will typically start on `http://localhost:5000` (or your configured port).*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory if necessary (e.g., for API URL).

Run the frontend development server:
```bash
npm run dev
```
*The frontend application will typically start on `http://localhost:5173`.*

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the backend root with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📖 API Documentation
The backend API is documented using Swagger. Once the backend server is running, you can access the Swagger UI documentation at:
```
http://localhost:5000/api-docs
