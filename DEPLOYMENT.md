# Spotify Clone Deployment Guide

This guide will help you deploy your Spotify Clone application with its microservices architecture.

## Architecture Overview

Your application consists of:
- **Frontend**: React + Vite (Port 5173 in dev)
- **User Service**: Authentication & Payments (Port 3000)
- **Admin Service**: Create/Delete Albums & Songs (Port 7000)
- **Song Service**: Fetch Albums & Songs (Port 8000)

## Prerequisites

Before deploying, ensure you have:
- [x] GitHub account (for code hosting)
- [ ] Render account (for backend services) - [render.com](https://render.com)
- [ ] Vercel account (for frontend) - [vercel.com](https://vercel.com)
- [ ] MongoDB Atlas account (for user service database)
- [ ] Neon account (for PostgreSQL databases)
- [ ] Redis Cloud account (for caching)
- [ ] Cloudinary account (for media storage)
- [ ] Razorpay account (for payments)
- [ ] Resend account (for emails)
- [ ] Google Cloud Console (for OAuth)

## Step 1: Push Code to GitHub

1. Initialize Git in your project (if not already done):
```bash
cd "c:\Spotify Clone"
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/spotify-clone.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up External Services

### 2.1 MongoDB Atlas (User Service Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0 for production)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### 2.2 Neon PostgreSQL (Admin & Song Services)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Create two databases:
   - `spotify_admin_db`
   - `spotify_song_db`
4. Get connection strings for both databases

### 2.3 Redis Cloud (Caching)
1. Go to [redis.com/cloud](https://redis.com/try-free/)
2. Create a free database
3. Note your: Host, Port, and Password

### 2.4 Cloudinary (Media Storage)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get your: Cloud Name, API Key, API Secret from dashboard

### 2.5 Razorpay (Payment Gateway)
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and complete KYC
3. Get your Test/Live Key ID and Secret

### 2.6 Resend (Email Service)
1. Go to [resend.com](https://resend.com)
2. Sign up and verify your domain
3. Get your API key

### 2.7 Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or use existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs
6. Get your Client ID

## Step 3: Deploy Backend Services to Render

### 3.1 Deploy User Service

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `spotify-user-service`
   - **Root Directory**: `user service`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
```
PORT=3000
NODE_ENV=production
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<generate_random_secret_at_least_32_chars>
REDIS_HOST=<your_redis_host>
REDIS_PASSWORD=<your_redis_password>
REDIS_PORT=<your_redis_port>
FRONTEND_URL=<will_add_after_frontend_deploy>
RAZORPAY_KEY_ID=<your_razorpay_key>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
RESEND_API_KEY=<your_resend_api_key>
GOOGLE_CLIENT_ID=999984879080-k9opn6n5u1tv3nnk4fjm8lkabcvd8vm7.apps.googleusercontent.com
```

6. Click "Create Web Service"
7. **Save the URL** (e.g., `https://spotify-user-service.onrender.com`)

### 3.2 Deploy Admin Service

1. Click "New +" → "Web Service"
2. Select same GitHub repository
3. Configure:
   - **Name**: `spotify-admin-service`
   - **Root Directory**: `admin service`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
```
PORT=7000
NODE_ENV=production
DATABASE_URL=<your_neon_admin_database_url>
REDIS_HOST=<your_redis_host>
REDIS_PASSWORD=<your_redis_password>
REDIS_PORT=<your_redis_port>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
FRONTEND_URL=<will_add_after_frontend_deploy>
```

5. Click "Create Web Service"
6. **Save the URL** (e.g., `https://spotify-admin-service.onrender.com`)

### 3.3 Deploy Song Service

1. Click "New +" → "Web Service"
2. Select same GitHub repository
3. Configure:
   - **Name**: `spotify-song-service`
   - **Root Directory**: `song service`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
```
PORT=8000
NODE_ENV=production
DATABASE_URL=<your_neon_song_database_url>
REDIS_HOST=<your_redis_host>
REDIS_PASSWORD=<your_redis_password>
REDIS_PORT=<your_redis_port>
FRONTEND_URL=<will_add_after_frontend_deploy>
```

5. Click "Create Web Service"
6. **Save the URL** (e.g., `https://spotify-song-service.onrender.com`)

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
```
VITE_GOOGLE_CLIENT_ID=999984879080-k9opn6n5u1tv3nnk4fjm8lkabcvd8vm7.apps.googleusercontent.com
VITE_USER_API_URL=https://spotify-user-service.onrender.com
VITE_ADMIN_API_URL=https://spotify-admin-service.onrender.com
VITE_SONG_API_URL=https://spotify-song-service.onrender.com
```

5. Click "Deploy"
6. **Save your frontend URL** (e.g., `https://spotify-clone-xyz.vercel.app`)

## Step 5: Update Backend Services with Frontend URL

Go back to each backend service on Render and update the `FRONTEND_URL` environment variable:

1. User Service → Environment → Add/Edit `FRONTEND_URL` → `https://your-frontend-url.vercel.app`
2. Admin Service → Environment → Add/Edit `FRONTEND_URL` → `https://your-frontend-url.vercel.app`
3. Song Service → Environment → Add/Edit `FRONTEND_URL` → `https://your-frontend-url.vercel.app`

**Important**: After updating environment variables, Render will automatically redeploy your services.

## Step 6: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add Authorized JavaScript origins:
   - `https://your-frontend-url.vercel.app`
6. Add Authorized redirect URIs:
   - `https://your-frontend-url.vercel.app`
7. Save

## Step 7: Test Your Deployment

1. Visit your frontend URL: `https://your-frontend-url.vercel.app`
2. Test the following features:
   - ✅ User registration and login
   - ✅ Google OAuth login
   - ✅ Browse albums and songs
   - ✅ Play music
   - ✅ Admin dashboard (create/delete albums and songs)
   - ✅ Payment subscription
   - ✅ Email verification

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is correctly set in all backend services
   - Check that your frontend URL matches exactly (no trailing slash)

2. **Database Connection Errors**
   - Verify database URLs are correct
   - Ensure IP whitelist includes 0.0.0.0/0 (MongoDB Atlas)
   - Check Neon database is active

3. **Redis Connection Errors**
   - Verify Redis host, port, and password
   - Ensure Redis instance is running

4. **Build Failures**
   - Check build logs on Render/Vercel
   - Ensure all dependencies are in package.json
   - Verify TypeScript compiles without errors locally first

5. **API Not Responding**
   - Render free tier services spin down after 15 minutes of inactivity
   - First request after inactivity may take 30-60 seconds to wake up

### Viewing Logs:

**Render Logs:**
- Go to your service → "Logs" tab
- Real-time logs show all console output

**Vercel Logs:**
- Go to your deployment → "Functions" tab
- Shows function execution logs

## Production Checklist

Before going live:
- [ ] All environment variables are set correctly
- [ ] Google OAuth includes production URLs
- [ ] Database backups are configured
- [ ] SSL certificates are active (automatic on Render/Vercel)
- [ ] Error monitoring is set up (consider Sentry)
- [ ] Rate limiting is implemented on APIs
- [ ] Payment gateway is in live mode (not test)
- [ ] Email domain is verified in Resend
- [ ] Test all user flows end-to-end

## Scaling Considerations

As your app grows:
- Upgrade Render plans for better performance and no spin-down
- Use Vercel Pro for advanced features and analytics
- Implement caching strategies with Redis
- Consider CDN for media files (Cloudinary handles this)
- Monitor database performance and optimize queries
- Set up database indexes for frequently queried fields

## Costs Estimate

**Free Tier:**
- Render: 3 services × Free = $0/month (with spin-down)
- Vercel: Free tier = $0/month
- MongoDB Atlas: 512MB free = $0/month
- Neon: 0.5GB free = $0/month
- Redis Cloud: 30MB free = $0/month
- Cloudinary: 25GB storage & 25GB bandwidth free = $0/month

**Production Tier (No Spin-down):**
- Render: 3 services × $7 = $21/month
- Vercel Pro: $20/month
- MongoDB Atlas: $9/month (M2 tier)
- Neon: $19/month
- Redis Cloud: $5/month
- Cloudinary: $89/month (for high usage)

Total: ~$163/month for production-grade hosting

## Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Docs: [mongodb.com/docs](https://www.mongodb.com/docs/)
- Neon Docs: [neon.tech/docs](https://neon.tech/docs)

## Next Steps

1. Set up custom domain for your frontend
2. Implement monitoring and analytics
3. Add error tracking (Sentry)
4. Set up CI/CD for automatic deployments
5. Create staging environment for testing

---

**Congratulations! 🎉 Your Spotify Clone is now live!**

Remember to keep your environment variables secure and never commit them to version control.
