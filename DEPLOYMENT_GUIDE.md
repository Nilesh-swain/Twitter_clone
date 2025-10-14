# Twitter Clone - Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- Node.js (version 18 or higher)
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)
- A hosting platform (Vercel, Netlify, Railway, etc.)

## Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/twitter-clone
# or for cloud MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/twitter-clone

# JWT Secret (use a strong secret key)
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=9000
NODE_ENV=production

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# or use individual variables
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Backend Deployment

### Option 1: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will automatically deploy your backend

### Option 2: Heroku

1. Install Heroku CLI
2. Create a new Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the Backend directory
3. Set environment variables in Vercel dashboard

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically

### Option 2: Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically

### Option 3: Manual Build

1. Run `npm run build` in the Frontend directory
2. Upload the `dist` folder to your hosting provider

## Build Process

The project includes an automated build process:

```bash
# Install dependencies
npm install

# Build the project (this will build Frontend and copy to Backend)
cd Backend
npm run build

# Start the server
npm start
```

## Database Setup

1. Create a MongoDB database
2. Update the `MONGO_URI` in your environment variables
3. The application will automatically create the necessary collections

## Cloudinary Setup

1. Create a Cloudinary account
2. Get your API credentials
3. Set the environment variables in your deployment platform

## CORS Configuration

Make sure to update the `CLIENT_URL` in your backend environment variables to match your frontend domain.

## Security Considerations

1. Use strong JWT secrets
2. Enable HTTPS in production
3. Set secure cookie options
4. Validate all inputs
5. Use environment variables for sensitive data

## Monitoring

Consider adding:

- Error tracking (Sentry)
- Performance monitoring
- Database monitoring
- Log aggregation

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Check that `CLIENT_URL` matches your frontend domain
2. **Database Connection**: Verify MongoDB URI and network access
3. **Image Upload**: Check Cloudinary configuration
4. **Build Failures**: Ensure all dependencies are installed

### Debug Mode:

Set `NODE_ENV=development` to enable detailed error messages.

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connected
- [ ] Cloudinary configured
- [ ] CORS settings correct
- [ ] HTTPS enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Security headers set
- [ ] Monitoring in place

## Support

For issues or questions, check the project documentation or create an issue in the repository.
