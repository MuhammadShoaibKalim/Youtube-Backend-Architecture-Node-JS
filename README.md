# YouTube Backend Architecture

## Overview

This project is a **YouTube-like backend system** designed to handle user authentication, user registration, login, token-based authentication (JWT), user profile management, and secure file uploads (user logo). The backend is built using **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary** for handling file storage.


- **Role-Based Access Control** (RBAC): Different routes are accessible based on the user's role.
  - **Super Admin**: Full access to all resources, including managing users, videos, and more.
  - **Admin**: Can manage content (videos), ads, and other admin-specific tasks.
  - **Normal User**: Can upload videos, view own videos, and edit their content.

## Roles

### Super Admin
- Full access to the entire application, including user management, video management, and more.
- Can perform all actions, including actions restricted to Admins or Normal Users.
- Routes that require this role include user management, system-wide configurations, etc.

### Admin
- Can manage video content (e.g., editing, deleting videos).
- May have access to additional admin functionalities like managing ads and promotions.
- Does not have access to user management or administrative configurations that are limited to the Super Admin.

### Normal User
- Can upload, view, and edit their own videos.
- Cannot manage other users or videos uploaded by others.
- Limited access to basic functionality like viewing personal videos and managing their own profile.

## Middleware

### 1. **checkAuthentication**
Checks if the user is authenticated using JWT tokens.

### 2. **checkAdmin**
Checks if the user is either an Admin or Super Admin.

### 3. **checkSuperAdmin**
Checks if the user is a Super Admin.

### 4. **checkOwnership**
Ensures the user owns the video they are trying to access or modify.


## Features

- **User Registration**: Users can register with a channel name, email, phone, and password. The profile logo is uploaded to Cloudinary.
- **User Login**: Users can log in using their email and password, which are validated. JWT tokens (access and refresh) are generated for secure access.
- **Logout**: Users can log out, and the refresh token is cleared from the client's cookies.
- **Token-based Authentication**: The system uses **JWT tokens** for secure access to protected routes.
- **Profile Management**: Users can update their profile information and upload an avatar (logo) to Cloudinary.
- **File Uploading**: User profile images (logos) are uploaded to Cloudinary.

## Architecture

This system follows a typical **RESTful API** architecture and includes the following features:

1. **Express.js** server for routing.
2. **MongoDB** database for storing user data.
3. **Cloudinary** for storing user profile images (logos).
4. **JWT-based authentication** with both **accessToken** and **refreshToken**.
5. **Cookie-based storage** for the refresh token.

## Dependencies

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool for Node.js.
- **bcrypt**: A library for hashing passwords securely.
- **cloudinary**: A cloud-based media management service to handle file uploads.
- **jsonwebtoken**: A library to sign and verify JWT tokens.
- **cookie-parser**: Middleware for parsing cookies in Express.
- **dotenv**: To manage environment variables for sensitive information.

--


This is the **README.md** formatted for your project with a detailed explanation of your YouTube backend system, including setup instructions, API details, token management, and more.
