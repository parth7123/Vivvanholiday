#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Vivaan Holidays deployment process..."

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Install required packages
echo "📦 Installing required packages..."
apt update
apt install -y nginx certbot python3-certbot-nginx

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p /var/www/vivaanholidays/frontend
mkdir -p /var/www/vivaanholidays/backend
mkdir -p /var/www/vivaanholidays/logs

# Check for .env files
if [ ! -f "BACKEND/.env" ]; then
    echo "❌ Error: BACKEND/.env file not found!"
    exit 1
fi

if [ ! -f "project/.env" ]; then
    echo "❌ Error: project/.env file not found!"
    exit 1
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Deploy Frontend
echo "🌐 Deploying frontend..."
cd project
npm install --production
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

cp -r dist/* /var/www/vivaanholidays/frontend/

# Deploy Backend
echo "⚙️ Deploying backend..."
cd ../BACKEND
npm install --production

# Copy Nginx configuration
echo "🔧 Configuring Nginx..."
cp ../nginx.conf /etc/nginx/sites-available/vivaanholidays
ln -sf /etc/nginx/sites-available/vivaanholidays /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

systemctl restart nginx

# Setup SSL certificates
echo "🔒 Setting up SSL certificates..."
certbot --nginx -d vivaanholidays.co.in -d www.vivaanholidays.co.in -d api.vivaanholidays.co.in --non-interactive --agree-tos --email vivaanholidays6@gmail.com

# Start backend with PM2
echo "🚀 Starting backend server..."
cd ..
pm2 delete vivaan-backend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Verify deployment
echo "🔍 Verifying deployment..."
curl -s -o /dev/null -w "%{http_code}" https://api.vivaanholidays.co.in/health
if [ $? -ne 0 ]; then
    echo "❌ Backend health check failed!"
    pm2 logs vivaan-backend
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "
Your website is now deployed:
- Main website: https://vivaanholidays.co.in
- API endpoint: https://api.vivaanholidays.co.in

Next steps:
1. Make sure your domain DNS is pointing to your server's IP address
2. Add these DNS records:
   - A record: vivaanholidays.co.in -> Your server IP
   - A record: www.vivaanholidays.co.in -> Your server IP
   - A record: api.vivaanholidays.co.in -> Your server IP
3. Test your website and API endpoints
4. Monitor logs with: pm2 logs vivaan-backend

For any issues:
- Check Nginx logs: /var/log/nginx/error.log
- Check PM2 logs: pm2 logs
- Check application status: pm2 status
- Application logs are in: /var/www/vivaanholidays/logs/

Security reminders:
1. Update your MongoDB password
2. Set up MongoDB IP whitelisting
3. Enable UFW firewall:
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 22
   sudo ufw enable
" 