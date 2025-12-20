# FruitStore – Full Stack E-commerce Application

🚀 Live Demo:  https://e-commerce-webapp-9in0.onrender.com

⚠️ Note: Initial load may take a few seconds due to free hosting on Render.
 
## Overview
FruitStore is a fully responsive full-stack e-commerce web application for buying fresh fruits and vegetables.  
Built with Node.js, Express.js, MongoDB on the backend and EJS, HTML, CSS, JavaScript on the frontend.

## Features
 
### User Authentication
- Register/Login/Reset Password
- **Email must be unique**; duplicate registration is prevented
- Login validates email and password; incorrect credentials return an error message
- Reset password: user enters registered email and sets a new password; backend updates the DB
- Passwords are securely hashed with **bcrypt**; they cannot be decrypted
 
### Role-Based Access Control
- Admin-level users can **add, update, or delete products** via backend API
- Regular users can only browse products, add to cart, and place orders
- Admin CRUD actions update the frontend in real-time:
  - Product deleted → removed from all carts
  - Product updated → frontend displays latest info
 
### Categories
- Two main categories: **Fruits** and **Vegetables**
- When adding a product, admin must select the category
- On frontend:
  - Fruits appear under Fruits container
  - Vegetables appear under Vegetables container
- Admin can add more categories in the future easily
 
### Product & Cart
- Dynamic search for products
- Add products to cart, update quantity, remove items
- **Guest Cart:** Users can add items without login
  - At checkout, redirected to login/register
  - Cart is preserved after login
 
### Order & Payment
- Orders and cart data saved in MongoDB
- Razorpay integration for secure payments
- Email notification sent on successful order with **order ID**
- Only logged-in users can proceed to payment
 
### Frontend
- Fully responsive design for desktop, tablet, and mobile
- Clean UI with category separation and dynamic updates
 
---
 
## Technologies Used
 
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: EJS templating, HTML, CSS, Vanilla JavaScript
- Payment Gateway: Razorpay
- Email: Nodemailer (for order confirmation)
- Security: bcrypt for password hashing
- Others: dotenv, morgan, cookie-parser, cors
 
---

**Important Note: 

My main focus and interest is backend development. I started by building the backend using Node.js and Express, and then connected it with a frontend to create a fully functional full-stack application, which helped me strengthen my full-stack development skills.

Apart from this project, I have built several backend-only projects, including:
- Movie API
- To-Do App API
- Metro Ticket Booking API
- Book Library API
- Contact form with Email API
- Quiz Model API
- User Login/Register API

- Link-- https://github.com/TAZEEM-BEG/Express-JS-API

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
1. git clone https://github.com/TAZEEM-BEG/E-Commerce-WebApp.git
cd E-Commerce-WebApp

2.Install dependencies:
npm install

3. Create a .env file and add required environment variables:

MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

4. Start the server:

node server.js

5.Open in browser:

http://localhost:3000


