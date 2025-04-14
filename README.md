# 🎬 YouTube Backend API (Express + MongoDB)

This is a backend API built with Node.js, Express, and MongoDB that handles user authentication and profile management functionalities like registration, login, password reset, and role-based access control — similar to a YouTube clone.

---

## 🚀 Features

### ✅ User Registration


### ✅ User Login
- Login with `email/username` and `password`
- Password authentication with hashed values
- JWT token generation for session management


### ✅ Access Control
- 🛡 Role-Based Access: Admin, User, etc.
- 🔒 Protected Routes: Middleware checks for JWT and roles

### ✅ Security
- Rate Limiting to prevent brute force attacks
- Input Sanitization to prevent XSS/SQL Injection
- Passwords never stored in plain text
- HTTPS-ready (production)

---

## 📦 Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Token)
- bcrypt.js
- Nodemailer (for OTP)
- dotenv
- Express-rate-limit
- Helmet & CORS




