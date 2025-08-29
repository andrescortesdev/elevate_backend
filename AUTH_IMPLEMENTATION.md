# Authentication Implementation Documentation

## Overview
This document outlines the complete authentication system implemented using Argon2id for secure password hashing, following MVC architecture patterns.

## Architecture Summary

### 🗂️ **Models Layer** (`app/models/`)
- **UserEntity.js**: Enhanced with Argon2id password hashing methods
- **AuthServices.js**: Authentication business logic (login, registration, validation)
- **UserServices.js**: Extended with user lookup methods

### 🎮 **Controllers Layer** (`app/controllers/`)
- **AuthController.js**: Handles HTTP authentication requests/responses

### 🛣️ **Routes Layer** (`app/routes/`)
- **AuthRouter.js**: Defines authentication API endpoints

### 📋 **Main Application** (`app.js`)
- Registers authentication routes at `/api/auth`

### 🌐 **Frontend** (`public/js/`)
- **API Integration**: Updated user API with authentication functions
- **Login Page**: Enhanced to use secure backend authentication

## 🔐 Security Features

### Password Security
- **Argon2id Hashing**: Industry-standard password hashing
- **Salt + Iterations**: Automatic salt generation with optimized parameters
- **Memory/Time Cost**: Configured for production security

### Validation
- **Input Validation**: Server-side validation for all auth endpoints
- **Email Format**: Proper email validation
- **Password Strength**: Minimum length requirements

## 📡 API Endpoints

### Authentication Routes (`/api/auth/`)

#### 🔐 `POST /api/auth/register`
Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepassword123",
  "role_id": 1
}
```

**Responses:**
- `201` - User created successfully
- `400` - Validation error
- `409` - User already exists
- `500` - Internal server error

#### 🔑 `POST /api/auth/login`
Authenticate user and login

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Responses:**
- `200` - Login successful with user data
- `400` - Validation error
- `401` - Invalid credentials
- `500` - Internal server error

#### 🚪 `POST /api/auth/logout`
Logout user (stateless endpoint)

**Responses:**
- `200` - Logout successful

#### 🔄 `PUT /api/auth/change-password`
Change user password

**Request Body:**
```json
{
  "email": "john@example.com",
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword123"
}
```

## 🧪 Testing

### Test File
- **Location**: `test-auth.html`
- **Purpose**: Manual testing of authentication endpoints
- **Features**: 
  - Registration form
  - Login form
  - Real-time API testing
  - Response visualization

### Manual Testing Steps
1. Open `test-auth.html` in browser
2. Test user registration
3. Test user login with registered credentials
4. Verify error handling for invalid inputs

## 🔧 Configuration

### Required Dependencies
```json
{
  "argon2": "^0.44.0",
  "express": "^5.1.0",
  "sequelize": "^6.37.7",
  "mysql2": "^3.14.3"
}
```

### Environment Variables
- Database connection configured in `config/db_conn.js`
- Server port: `9000` (configurable via `PORT` env var)

## 📁 File Structure
```
app/
├── controllers/
│   └── AuthController.js          # Authentication request handlers
├── models/
│   ├── entities/
│   │   └── UserEntity.js          # Enhanced with Argon2id methods
│   └── services/
│       ├── AuthServices.js        # Authentication business logic
│       └── UserServices.js        # User management services
└── routes/
    └── AuthRouter.js               # Authentication API routes

public/js/
├── api/
│   └── users.js                    # Updated with auth functions
├── utils/
│   └── config.js                   # API configuration
└── views/
    └── loginPage.js                # Enhanced login implementation
```

## 🚀 Usage Examples

### Frontend Authentication
```javascript
import { loginUser, registerUser } from '../api/users.js';

// Login
try {
  const response = await loginUser(email, password);
  if (response.success) {
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    // Redirect or update UI
  }
} catch (error) {
  console.error('Login failed:', error.message);
}

// Registration
try {
  const response = await registerUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepass123',
    role_id: 1
  });
  if (response.success) {
    console.log('Registration successful');
  }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Backend Service Usage
```javascript
import AuthServices from '../models/services/AuthServices.js';

// In controller
const user = await AuthServices.loginUser(email, password);
const newUser = await AuthServices.registerUser(userData);
```

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: Argon2id with secure parameters
2. **Input Validation**: Server-side validation for all inputs
3. **Error Handling**: Consistent error responses without revealing sensitive info
4. **No Password Storage**: Passwords never stored in plain text
5. **Session Management**: Frontend localStorage for session persistence

## 🎯 Next Steps

1. **JWT Tokens**: Implement JWT for stateless authentication
2. **Rate Limiting**: Add rate limiting for auth endpoints
3. **Account Verification**: Email verification for new accounts
4. **Password Reset**: Forgot password functionality
5. **2FA**: Two-factor authentication support

## 🛡️ Production Considerations

- Use HTTPS in production
- Configure proper CORS settings
- Implement proper session timeout
- Add authentication middleware for protected routes
- Monitor failed login attempts
- Regular security audits
