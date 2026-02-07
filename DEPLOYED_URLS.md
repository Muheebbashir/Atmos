# Deployed URLs Tracker

Use this file to track your deployed service URLs for easy reference.

## Backend Services

### User Service
- **Render URL**: 
- **Endpoint**: `/api/users`, `/api/payment`
- **Status**: ⏳ Pending deployment

### Admin Service
- **Render URL**: 
- **Endpoint**: `/api/v1/album`, `/api/v1/song`
- **Status**: ⏳ Pending deployment

### Song Service
- **Render URL**: 
- **Endpoint**: `/api/v1/album`, `/api/v1/song`
- **Status**: ⏳ Pending deployment

## Frontend

### Main Application
- **Vercel URL**: 
- **Status**: ⏳ Pending deployment

## External Services

### Database
- **MongoDB Atlas**: ✅ Connected | ⏳ Pending
- **Neon PostgreSQL (Admin)**: ✅ Connected | ⏳ Pending
- **Neon PostgreSQL (Song)**: ✅ Connected | ⏳ Pending

### Cache & Storage
- **Redis Cloud**: ✅ Connected | ⏳ Pending
- **Cloudinary**: ✅ Connected | ⏳ Pending

### API Services
- **Razorpay**: ✅ Configured | ⏳ Pending
- **Resend**: ✅ Configured | ⏳ Pending
- **Google OAuth**: ✅ Configured | ⏳ Pending

## API Documentation

Once deployed, access Swagger documentation at:
- User Service: `https://your-user-service-url/api-docs`
- Admin Service: `https://your-admin-service-url/api-docs`
- Song Service: `https://your-song-service-url/api-docs`

## Quick Test Endpoints

Test if your services are live:
```bash
# User Service Health
curl https://your-user-service-url/api/users

# Admin Service Health
curl https://your-admin-service-url/api/v1/album/all

# Song Service Health
curl https://your-song-service-url/api/v1/song/all
```

## Notes

- Update this file after each successful deployment
- Keep URLs handy for updating environment variables
- Share deployed URLs with team members
