# 🎵 Spotify Clone - Full Stack Music Streaming Platform

A full-featured music streaming application built with modern microservices architecture.

## 🌟 Features

- 🎵 Stream music with full playback controls
- 📱 Responsive design for all devices
- 🔐 User authentication & authorization
- 🎨 Create and manage albums
- 📀 Upload and manage songs
- 💰 Subscription-based premium access
- 🔍 Search functionality
- 🎯 Admin dashboard for content management
- 📧 Email verification & password reset
- 🔒 Google OAuth integration
- 💳 Razorpay payment gateway integration

## 🏗️ Architecture

This project uses a **microservices architecture** with:

### Frontend
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7

### Backend Services

#### User Service (Port 3000)
- User authentication (JWT)
- Google OAuth integration
- Payment processing (Razorpay)
- Email notifications (Resend)
- Subscription management
- **Database**: MongoDB

#### Admin Service (Port 7000)
- Create/Update albums
- Create/Update songs
- Media upload (Cloudinary)
- Admin authentication
- **Database**: PostgreSQL (Neon)

#### Song Service (Port 8000)
- Fetch albums
- Fetch songs
- Public API endpoints
- **Database**: PostgreSQL (Neon)

### Shared Infrastructure
- **Cache**: Redis Cloud
- **Media Storage**: Cloudinary
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
Spotify Clone/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API integration layer
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand store
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── .env                 # Environment variables
│   └── vercel.json         # Vercel deployment config
│
├── user service/            # User & payment microservice
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── lib/            # Database & utilities
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # Express routes
│   ├── .env.example        # Example environment variables
│   └── render.yaml         # Render deployment config
│
├── admin service/          # Admin management microservice
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── lib/           # Database & utilities
│   │   ├── middleware/    # Auth & file upload middleware
│   │   └── routes/        # Express routes
│   ├── .env.example       # Example environment variables
│   └── render.yaml        # Render deployment config
│
├── song service/          # Song fetching microservice
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── lib/          # Database & utilities
│   │   └── routes/       # Express routes
│   ├── .env.example      # Example environment variables
│   └── render.yaml       # Render deployment config
│
├── DEPLOYMENT.md         # Comprehensive deployment guide
├── DEPLOYMENT_CHECKLIST.md  # Step-by-step checklist
└── DEPLOYED_URLS.md      # Track your deployed services
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB instance
- PostgreSQL database (or Neon)
- Redis instance
- Cloudinary account
- Razorpay account
- Resend account
- Google OAuth credentials

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "Spotify Clone"
```

2. **Set up User Service**
```bash
cd "user service"
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Set up Admin Service**
```bash
cd "../admin service"
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

4. **Set up Song Service**
```bash
cd "../song service"
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

5. **Set up Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- User Service: http://localhost:3000
- Admin Service: http://localhost:7000
- Song Service: http://localhost:8000

## 📦 Deployment

Ready to deploy? Follow our comprehensive guides:

1. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with all steps
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Interactive checklist to track progress
3. **[DEPLOYED_URLS.md](./DEPLOYED_URLS.md)** - Track your deployed service URLs

### Recommended Platforms

- **Frontend**: [Vercel](https://vercel.com) (Free tier available)
- **Backend Services**: [Render](https://render.com) (Free tier available)
- **Databases**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), [Neon](https://neon.tech)
- **Cache**: [Redis Cloud](https://redis.com/cloud)
- **Media**: [Cloudinary](https://cloudinary.com)

## 🛠️ Tech Stack

### Frontend
- React 19.2
- TypeScript 5.9
- Vite 7.2
- TailwindCSS 4.1
- TanStack Query 5.90
- Zustand 5.0
- React Router 7.13
- Axios 1.13

### Backend
- Node.js 18+
- Express 5.2
- TypeScript 5.9
- MongoDB (Mongoose 9.1)
- PostgreSQL (Neon)
- Redis 5.10
- JWT (jsonwebtoken 9.0)
- Bcrypt 6.0
- Cloudinary 2.9
- Multer 2.0
- Swagger 6.2

### Payment & Communication
- Razorpay SDK 2.9
- Resend 6.9
- Google Auth Library 9.15

## 📝 Environment Variables

Each service requires specific environment variables. Check the `.env.example` files in each service directory for the complete list.

### Critical Variables:
- Database connection strings
- API keys (Cloudinary, Razorpay, Resend, Google)
- JWT secrets
- Redis connection details
- Service URLs

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configured for specific origins
- Secure environment variable management
- File upload validation and sanitization

## 🎯 API Documentation

Once deployed, access Swagger documentation:
- User Service: `https://your-user-service-url/api-docs`
- Admin Service: `https://your-admin-service-url/api-docs`
- Song Service: `https://your-song-service-url/api-docs`

## 🧪 Testing

Run tests for each service:
```bash
# In each service directory
npm test
```

## 📊 Monitoring

- Check Render/Vercel dashboards for logs
- Monitor Redis cache hit rates
- Track database performance
- Set up error tracking (recommended: Sentry)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the ISC License.

## 🙋 Support

For deployment help, refer to:
- [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step tracking
- Service documentation (Render, Vercel, MongoDB, etc.)

## 🎉 Acknowledgments

Built with modern web technologies and best practices for scalable microservices architecture.

---

**Happy Streaming! 🎵**
