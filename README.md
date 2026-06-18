# Car Rental System

🚗 Live Demo: https://car-rental-peach-beta.vercel.app


A full-stack Car Rental web application built using React, Node.js, Express, PostgreSQL, and Sequelize.

The platform allows users to:

- Rent cars from other users.
- List their own cars for rent and earn income.
- Search and filter available cars based on location and preferences.
- Manage bookings and rental history.
- Upload car images using Cloudinary.
- Access separate dashboards for customers and car owners.

## Features

### User Features

- User Registration & Login
- JWT Authentication
- Profile Management
- Browse Available Cars
- Car Search & Filtering
- Car Booking System
- Booking History
- Responsive Design

### Owner Features

- Add Cars for Rent
- Upload Multiple Car Images
- Manage Listed Cars
- Update Car Availability
- View and Manage Bookings
- Owner Dashboard
- Cloudinary Image Upload & Storage

## Tech Stack

### Frontend

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Formik
- Yup

### Backend

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- PostgreSQL
- JWT Authentication

### Services

- Cloudinary (Image Hosting)

## Installation

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Database Setup

This project uses PostgreSQL as the primary database.

### Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE car_rental;
```

### Import Database Schema

The complete database schema is available in:

```txt
Database/database-schema.sql
```

Run the following command to create all required:

* Enums
* Tables
* Sequences
* Indexes
* Constraints
* Foreign Keys

```bash
psql -U postgres -d car_rental -f Database/database-schema.sql
```

### Database Structure

The schema includes:

* Users
* Cars
* Car Images
* Bookings

With proper relationships, foreign keys, and soft-delete support.

### Verify Installation

After importing the schema, verify that the following tables exist:

```sql
\dt
```

Expected tables:

```txt
users
cars
car_images
bookings
```


## Frontend Environment Variables

Create a `.env` file inside the `Frontend` folder.

```env
VITE_CURRENCY=₹
VITE_BASE_URL=http://localhost:3000/api
```

## Backend Environment Variables

Create a `.env` file inside the `Backend` folder.

```env
PORT=3000

DB_HOST=localhost
DB_NAME=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_PORT=5432

SALT=10
JWT_KEY=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Cloudinary Setup

1. Create an account on Cloudinary.
2. Log in to your Cloudinary Dashboard.
3. Navigate to Dashboard.
4. Copy the following credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Add them to your Backend `.env` file.


## Project Status

Core features are completed and deployed.
Additional enhancements and optimizations are currently in progress.


## Author

Pratham Mistry  
Full Stack Developer (React, Node.js, PostgreSQL, TypeScript)