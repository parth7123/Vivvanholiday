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
PORT=3000
MONGODB_URI=mongodb+srv://parth:74108520@cluster0.lh4pbsu.mongodb.net/tourdb?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
EOL
```

4. Create frontend .env file:
```bash
cat > project/.env << EOL
VITE_API_URL=https://api.vivaanholidays.co.in
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