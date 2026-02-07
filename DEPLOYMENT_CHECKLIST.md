# 🚀 Quick Deployment Checklist

Use this checklist to track your deployment progress step by step.

## Pre-Deployment Setup

- [ ] Code pushed to GitHub
- [ ] All services tested locally
- [ ] `.env.example` files reviewed

## External Services Setup

- [ ] MongoDB Atlas cluster created
- [ ] Neon PostgreSQL databases created (Admin & Song)
- [ ] Redis Cloud instance created
- [ ] Cloudinary account configured
- [ ] Razorpay API keys obtained
- [ ] Resend API key obtained
- [ ] Google OAuth credentials configured

## Backend Deployment (Render)

### User Service
- [ ] Service created on Render
- [ ] Environment variables added
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] URL saved in `DEPLOYED_URLS.md`

### Admin Service
- [ ] Service created on Render
- [ ] Environment variables added
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] URL saved in `DEPLOYED_URLS.md`

### Song Service
- [ ] Service created on Render
- [ ] Environment variables added
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] URL saved in `DEPLOYED_URLS.md`

## Frontend Deployment (Vercel)

- [ ] Project imported to Vercel
- [ ] Environment variables added (3 API URLs + Google Client ID)
- [ ] Build successful
- [ ] Deployment live
- [ ] URL saved in `DEPLOYED_URLS.md`

## Post-Deployment Configuration

- [ ] Frontend URL added to all backend services
- [ ] Backend services redeployed with updated FRONTEND_URL
- [ ] Google OAuth redirect URIs updated with production URL
- [ ] Razorpay webhook configured (if needed)

## Testing

- [ ] Frontend loads successfully
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth login works
- [ ] Album/Song browsing works
- [ ] Music player works
- [ ] Admin dashboard accessible
- [ ] Create album/song works
- [ ] Delete album/song works
- [ ] Payment flow works
- [ ] Email verification works

## Final Steps

- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified (automatic)
- [ ] Performance tested
- [ ] Error monitoring set up
- [ ] Documentation updated
- [ ] Team notified

## 🎉 Deployment Complete!

Date deployed: ________________

Production URL: ________________

---

**Next Steps:**
1. Monitor logs for first 24 hours
2. Set up analytics
3. Create staging environment
4. Implement CI/CD
5. Plan for scaling

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
