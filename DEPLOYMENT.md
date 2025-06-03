# Vivaan Holidays - Deployment Guide

## Prerequisites
- Hostinger VPS with Ubuntu/Debian
- Domain (vivaanholidays.co.in) configured in Hostinger DNS
- Node.js 16+ installed
- Git installed

## Step 1: Initial Server Setup

1. SSH into your VPS:
```bash
ssh root@your_server_ip
```

2. Update system packages:
```bash
apt update && apt upgrade -y
```

3. Install required software:
```bash
apt install -y curl git nginx certbot python3-certbot-nginx
```

4. Install Node.js and npm (if not already installed):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

5. Install PM2 globally:
```bash
npm install -g pm2
```

## Step 2: Clone and Setup Project

1. Create project directory:
```bash
mkdir -p /var/www/vivaanholidays
cd /var/www/vivaanholidays
```

2. Clone your repository:
```bash
git clone https://github.com/parth7123/Vivvanholiday.git .
```

3. Create backend .env file:
```bash
cat > BACKEND/.env << EOL
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://parth:74108520@cluster0.lh4pbsu.mongodb.net/tourdb?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=tourdb

# CORS Configuration
ALLOWED_ORIGINS=https://vivaanholidays.co.in,https://www.vivaanholidays.co.in,http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=vivaanholidays6@gmail.com
EOL
```

4. Create frontend .env file:
```bash
cat > project/.env << EOL
# Site Configuration
VITE_APP_SITE_URL=https://vivaanholidays.co.in
VITE_APP_API_URL=https://api.vivaanholidays.co.in

# EmailJS Configuration
VITE_APP_EMAILJS_SERVICE_ID=service_mnglqot
VITE_APP_EMAILJS_ADMIN_TEMPLATE_ID=template_gy2tpsw
VITE_APP_EMAILJS_CONTACT_TEMPLATE_ID=template_kp0pqpw
VITE_APP_EMAILJS_PUBLIC_KEY=KZ9btcDfq7a9x6U_Q

# Firebase Configuration
VITE_APP_FIREBASE_API_KEY=AIzaSyBPV-9y4pv-gHCZefbDmuIm0N3Jg_jhFT0
VITE_APP_FIREBASE_AUTH_DOMAIN=vivvanholidays.firebaseapp.com
VITE_APP_FIREBASE_PROJECT_ID=vivvanholidays
VITE_APP_FIREBASE_STORAGE_BUCKET=vivvanholidays.appspot.com
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=943331123236
VITE_APP_FIREBASE_APP_ID=1:943331123236:web:002d53a5fc586a8c49b8b1
VITE_APP_FIREBASE_MEASUREMENT_ID=G-S0ENT705FM

# Admin Configuration
VITE_APP_ADMIN_EMAIL=vivaanholidays6@gmail.com
EOL
```

## Step 3: Build and Deploy

1. Install and build frontend:
```bash
cd project
npm install
npm run build
```

2. Install backend dependencies:
```bash
cd ../BACKEND
npm install
```

## Step 4: Configure Nginx

1. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

2. Run the deployment script:
```bash
sudo ./deploy.sh
```

## Step 5: DNS Configuration

1. Log in to your Hostinger control panel

2. Go to DNS Zone Editor

3. Add these A records pointing to your VPS IP:
   - vivaanholidays.co.in
   - www.vivaanholidays.co.in
   - api.vivaanholidays.co.in

## Step 6: Verify Deployment

1. Check if backend is running:
```bash
pm2 status
```

2. Test the endpoints:
```bash
curl https://api.vivaanholidays.co.in/health
curl https://vivaanholidays.co.in
```

## Troubleshooting

1. View backend logs:
```bash
pm2 logs vivaan-backend
```

2. View Nginx logs:
```bash
tail -f /var/log/nginx/error.log
```

3. Check SSL certificate status:
```bash
certbot certificates
```

## Security Recommendations

1. Configure UFW firewall:
```bash
ufw allow 80
ufw allow 443
ufw allow 22
ufw enable
```

2. Update MongoDB Atlas Network Access:
   - Go to MongoDB Atlas
   - Add your VPS IP to the IP Access List

## Maintenance

1. To update the website:
```bash
cd /var/www/vivaanholidays
git pull
cd project
npm install
npm run build
cd ../BACKEND
npm install
pm2 restart vivaan-backend
```

2. To renew SSL certificates (automatic, but manual command if needed):
```bash
certbot renew
```

For any issues, check the logs in:
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/error.log`
- PM2 status: `pm2 status` 