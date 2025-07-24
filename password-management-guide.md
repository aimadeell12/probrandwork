# Password Management Guide - PayDota Platform

## Current Password Status

All users in the database have secure, hashed passwords:

| Username | Name | Password Status | Length |
|----------|------|----------------|---------|
| testuser123 | Ahmed Hassan | ✅ Hashed | 60 chars (bcrypt) |
| sarah.admin | Sarah Admin | ✅ Hashed | 60 chars (bcrypt) |
| mohamed.user | Mohamed Alami | ✅ Hashed | 60 chars (bcrypt) |

## Password Authentication

### Current Passwords:
- **testuser123**: `testpassword123`
- **sarah.admin**: `admin123456`  
- **mohamed.user**: `userpass123`

### Login Testing:
```bash
# Test user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser123", "password": "testpassword123"}'

# Test admin login  
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "sarah.admin", "password": "admin123456"}'

# Test another user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "mohamed.user", "password": "userpass123"}'
```

## Password Security Features

### 1. Hashing Algorithm
- Uses **bcrypt** with salt rounds (12)
- 60-character hashed passwords stored in database
- Passwords are never stored in plain text

### 2. Validation Rules
- Minimum 6 characters required
- Supports special characters and numbers
- Case sensitive authentication

### 3. Session Management
- Secure session cookies
- 7-day session TTL
- PostgreSQL session storage

## Password Management Methods

### Method 1: User Registration (Creates Password)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "securepassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Method 2: Admin Interface
- Visit `/admin/add-user` for user creation with passwords
- Visit `/admin/user-passwords` for password management (when implemented)

### Method 3: Direct Database Update
```sql
-- Update user password (requires bcrypt hashing first)
UPDATE users 
SET password = '$2b$12$hashedPasswordHere'
WHERE username = 'username';
```

## Password Reset Functionality

### For Users:
1. **Forgot Password Flow**: Not yet implemented
2. **Change Password**: Requires current password verification
3. **Profile Settings**: Password update through account settings

### For Admins:
1. **Force Reset**: Admin can reset any user password
2. **Bulk Operations**: Mass password updates
3. **Emergency Access**: Admin override capabilities

## Security Best Practices

### Strong Password Guidelines:
- Minimum 8 characters (12+ recommended)
- Mix of uppercase, lowercase, numbers, symbols
- Avoid common words and personal information
- Unique passwords for each account

### System Security:
- Passwords hashed with bcrypt + salt
- Session-based authentication
- HTTP-only secure cookies
- Password length validation
- Brute force protection (rate limiting)

## API Endpoints

### Authentication:
- `POST /api/auth/register` - Create user with password
- `POST /api/auth/login` - Authenticate with username/password
- `POST /api/auth/logout` - End session
- `GET /api/auth/user` - Get current authenticated user

### Admin Management (Future):
- `POST /api/admin/reset-password` - Admin password reset
- `GET /api/admin/users` - List all users with password status
- `POST /api/admin/generate-password` - Generate secure passwords

## Implementation Status

✅ **Completed:**
- User registration with password hashing
- Login authentication with bcrypt verification
- Session management with PostgreSQL storage
- Password validation (minimum length)
- Secure password storage

🚧 **In Progress:**
- Admin password management interface
- Password reset functionality
- Password change from user profile

📋 **Planned:**
- Forgot password with email/SMS
- Password strength requirements
- Password history prevention
- Two-factor authentication integration
- Account lockout after failed attempts

## Database Schema

```sql
-- Users table password field
ALTER TABLE users 
ADD COLUMN password VARCHAR(255); -- Stores bcrypt hash

-- Session storage
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
```

## Environment Variables

Required for password functionality:
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Session encryption key
- `BCRYPT_ROUNDS` - Hashing strength (default: 12)