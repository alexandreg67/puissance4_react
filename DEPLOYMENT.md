# 🚀 Cyberpunk Connect Four - Deployment Guide

## Overview

This guide covers multiple deployment options for the Cyberpunk Connect Four game, optimized for production environments with security, performance, and scalability in mind.

## 🎯 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Git

### Local Development
```bash
# Clone and setup
git clone <repository-url>
cd puissance4_react
npm install

# Start development server
npm run dev
```

## 🚀 Deployment Options

### 1. Vercel (Recommended)

**Automatic Deployment:**
- Connect your GitHub repository to Vercel
- Vercel will auto-deploy on every push to main branch
- Configuration is handled by `vercel.json`

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Environment Setup:**
- Add environment variables in Vercel dashboard
- Configure custom domains in Vercel settings

### 2. Netlify

**Deploy via Git:**
- Connect repository to Netlify
- Build command: `npm run build`
- Publish directory: `.next`

**Manual Deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### 3. Docker Deployment

**Production Docker:**
```bash
# Build production image
docker build -t connect-four-cyberpunk .

# Run container
docker run -p 3000:3000 connect-four-cyberpunk
```

**Docker Compose:**
```bash
# Production deployment
docker-compose up -d

# Development environment
docker-compose --profile dev up -d

# With reverse proxy
docker-compose --profile proxy up -d
```

### 4. Self-Hosted (VPS/Server)

**Using PM2:**
```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "connect-four" -- start
pm2 save
pm2 startup
```

**Using systemd (Linux):**
```bash
# Create service file
sudo nano /etc/systemd/system/connect-four.service

# Add configuration (see systemd section below)
sudo systemctl enable connect-four
sudo systemctl start connect-four
```

## ⚙️ Configuration Files

### Next.js Config (`next.config.mjs`)
```javascript
// Optimized for production with security headers
// Includes image optimization and performance enhancements
```

### Vercel Config (`vercel.json`)
- Custom headers for security
- Function timeout configuration
- Caching strategies
- Rewrites for API routes

### Docker Configuration
- Multi-stage build for minimal image size
- Security-optimized with non-root user
- Health checks included
- Production-ready with standalone output

## 🔒 Security Considerations

### Headers
All deployment methods include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`

### Content Security Policy
Implement CSP headers for additional security:
```javascript
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

## 📊 Performance Optimization

### Build Optimization
- Tree shaking enabled
- Code splitting automatic
- Image optimization with WebP/AVIF
- CSS optimization
- Bundle analysis available

### Runtime Performance
- GPU-accelerated animations
- Responsive design with device detection
- Memory cleanup for animations
- Optimized re-renders with React.memo

### Monitoring
```bash
# Bundle analysis
npm run build
npx @next/bundle-analyzer
```

## 🌐 Environment Variables

### Production Variables
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Optional Configuration
```bash
# Custom API endpoints
NEXT_PUBLIC_API_URL=https://api.yourserver.com

# Analytics
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID
```

## 🔧 Troubleshooting

### Common Issues

**Build Failures:**
- Ensure Node.js version compatibility (18.x+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Performance Issues:**
- Check bundle size with analyzer
- Verify GPU acceleration is working
- Monitor memory usage

**Docker Issues:**
- Ensure Docker has sufficient memory (4GB+)
- Check port conflicts
- Verify file permissions

### Debug Commands
```bash
# Check build output
npm run build 2>&1 | tee build.log

# Docker debug
docker logs <container-id>

# Performance monitoring
npx clinic doctor -- node server.js
```

## 📝 Systemd Service Configuration

Create `/etc/systemd/system/connect-four.service`:
```ini
[Unit]
Description=Cyberpunk Connect Four Game
Documentation=https://github.com/your-repo
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/connect-four
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=connect-four
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow provides:
- Automated testing and building
- Security vulnerability scanning
- Multi-platform Docker builds
- Automatic deployment to Vercel
- Artifact management

### Required Secrets
```bash
VERCEL_TOKEN          # Vercel deployment token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
DOCKER_USERNAME       # Docker Hub username
DOCKER_PASSWORD       # Docker Hub password
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple container instances
- Implement health checks

### Database Integration
If adding persistent features:
- Consider Redis for session storage
- PostgreSQL for game statistics
- MongoDB for user preferences

### CDN Configuration
- Use Vercel Edge Network (automatic)
- Or configure CloudFlare for custom deployments
- Enable gzip compression

## 🆘 Support

For deployment issues:
1. Check build logs first
2. Verify all environment variables
3. Test locally with production build
4. Check network connectivity and firewall rules
5. Review platform-specific documentation

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Platform Documentation](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PM2 Process Manager](https://pm2.keymetrics.io/docs/)

---

**Ready to deploy your cyberpunk gaming experience to the world! 🎮✨**