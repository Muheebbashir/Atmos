# Environment Variables Configuration Guide

This guide explains all environment variables needed for the Spotify Clone application.

## Frontend (.env)

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456-abcdef.apps.googleusercontent.com` | Get from Google Cloud Console |
| `VITE_USER_API_URL` | User Service API URL | `http://localhost:3000` or deployed URL | No trailing slash |
| `VITE_ADMIN_API_URL` | Admin Service API URL | `http://localhost:7000` or deployed URL | No trailing slash |
| `VITE_SONG_API_URL` | Song Service API URL | `http://localhost:8000` or deployed URL | No trailing slash |

### How to Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-production-domain.com` (production)
6. Copy the Client ID

---

## User Service (.env)

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `PORT` | Server port | `3000` | Choose any available port |
| `NODE_ENV` | Environment | `development` or `production` | Set based on environment |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| `JWT_SECRET` | Secret key for JWT | Random 32+ character string | Generate using `openssl rand -base64 32` |
| `REDIS_HOST` | Redis server host | `redis-12345.c123.us-east-1-1.ec2.cloud.redislabs.com` | [Redis Cloud](https://redis.com/cloud) |
| `REDIS_PASSWORD` | Redis password | `your_redis_password` | Redis Cloud dashboard |
| `REDIS_PORT` | Redis port | `19030` | Redis Cloud dashboard |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Your frontend URL |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_1234567890` | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | `your_razorpay_secret` | Razorpay Dashboard (keep secure!) |
| `RESEND_API_KEY` | Resend API Key | `re_123456789` | [Resend Dashboard](https://resend.com/api-keys) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Same as frontend | Google Cloud Console |

### MongoDB Atlas Setup

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster (512MB)
3. Create database user with strong password
4. Whitelist IP: `0.0.0.0/0` (allows all IPs for cloud deployment)
5. Click "Connect" → "Connect your application"
6. Copy connection string and replace `<password>` with your password

### JWT Secret Generation

Generate a secure random string:
```bash
# On Unix/Mac/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete account verification
3. Go to Dashboard → Settings → API Keys
4. Generate Test Keys (for development)
5. Generate Live Keys (for production)
6. Save both Key ID and Secret securely

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Go to API Keys section
4. Create new API key
5. Copy and save securely

---

## Admin Service (.env)

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `PORT` | Server port | `7000` | Choose any available port |
| `NODE_ENV` | Environment | `development` or `production` | Set based on environment |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` | [Neon](https://neon.tech) |
| `REDIS_HOST` | Redis server host | Same as User Service | Redis Cloud |
| `REDIS_PASSWORD` | Redis password | Same as User Service | Redis Cloud |
| `REDIS_PORT` | Redis port | Same as User Service | Redis Cloud |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_cloudinary_secret` | Cloudinary Dashboard |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Your frontend URL |

### Neon PostgreSQL Setup

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Create a database (e.g., `spotify_admin_db`)
4. Copy the connection string (includes username, password, host, port, database name)
5. Make sure to use `?sslmode=require` at the end of the connection string

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Free tier includes:
   - 25 GB storage
   - 25 GB bandwidth/month
   - 25,000 transformations/month
3. Go to Dashboard
4. Find your:
   - Cloud Name
   - API Key
   - API Secret (click "reveal" to see it)

---

## Song Service (.env)

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `PORT` | Server port | `8000` | Choose any available port |
| `NODE_ENV` | Environment | `development` or `production` | Set based on environment |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` | [Neon](https://neon.tech) |
| `REDIS_HOST` | Redis server host | Same as other services | Redis Cloud |
| `REDIS_PASSWORD` | Redis password | Same as other services | Redis Cloud |
| `REDIS_PORT` | Redis port | Same as other services | Redis Cloud |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Your frontend URL |

**Note**: Create a separate database in Neon for this service (e.g., `spotify_song_db`)

---

## Security Best Practices

### DO ✅
- Use strong, randomly generated secrets
- Keep `.env` files in `.gitignore`
- Use different credentials for development and production
- Rotate secrets regularly
- Store production secrets in secure vaults (Render/Vercel environment variables)
- Use environment-specific `.env` files (`.env.local`, `.env.production`)

### DON'T ❌
- Commit `.env` files to version control
- Share secrets in plain text (Slack, email, etc.)
- Use the same secrets across environments
- Hardcode secrets in source code
- Use weak or predictable secrets

---

## Quick Setup Commands

### Generate all secrets at once:
```bash
# JWT Secret
echo "JWT_SECRET=$(openssl rand -base64 32)"

# Another random secret
echo "APP_SECRET=$(openssl rand -base64 32)"
```

### Validate MongoDB Connection:
```bash
# Test MongoDB connection (requires mongosh)
mongosh "your_mongodb_connection_string"
```

### Validate PostgreSQL Connection:
```bash
# Test PostgreSQL connection (requires psql)
psql "your_postgresql_connection_string"
```

### Validate Redis Connection:
```bash
# Test Redis connection (requires redis-cli)
redis-cli -h your_host -p your_port -a your_password ping
```

---

## Development vs Production

### Development
- Use `localhost` URLs
- Test API keys (Razorpay test mode)
- Development database instances
- Relaxed CORS settings
- Verbose logging enabled

### Production
- Use deployed URLs (https)
- Live API keys (Razorpay live mode)
- Production database instances
- Strict CORS settings
- Error logging only

---

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
- Check if IP is whitelisted (0.0.0.0/0)
- Verify username/password
- Ensure database name is correct
- Check if cluster is active

**Redis Connection Failed:**
- Verify host, port, and password
- Check if Redis instance is running
- Ensure firewall allows connection

**Cloudinary Upload Failed:**
- Verify all three credentials (cloud name, API key, secret)
- Check upload preset settings
- Verify file size limits

**Razorpay Payment Failed:**
- Ensure using correct mode (test/live)
- Verify both Key ID and Secret
- Check webhook configuration

---

## Example .env Files

See the `.env.example` files in each service directory for complete working examples.

---

**Need Help?**

Check the service-specific documentation:
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Neon Docs](https://neon.tech/docs)
- [Redis Cloud Docs](https://redis.com/cloud/developer-guide/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Razorpay Docs](https://razorpay.com/docs/)
- [Resend Docs](https://resend.com/docs)
