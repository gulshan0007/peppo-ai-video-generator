#!/bin/bash

# Peppo AI Video Generator - EC2 Deployment Script
# Run this script on your EC2 instance after connecting via SSH

echo "🚀 Starting EC2 deployment for Peppo AI Video Generator..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18.x
echo "📥 Installing Node.js 18.x..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
echo "📥 Installing PM2..."
sudo npm install -g pm2

# Install nginx
echo "📥 Installing nginx..."
sudo yum install -y nginx

# Start and enable nginx
echo "🚀 Starting nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/peppo-ai
sudo chown ec2-user:ec2-user /var/www/peppo-ai

# Navigate to app directory
cd /var/www/peppo-ai

# Clone your repository (REPLACE with your actual GitHub username and repo name)
echo "📥 Cloning repository..."
git clone https://github.com/YOUR_GITHUB_USERNAME/peppo-ai-video-generator.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build client
echo "🔨 Building client..."
cd client
npm install
npm run build
cd ..

# Create environment file
echo "🔐 Creating environment file..."
cat > .env << EOL
NODE_ENV=production
PORT=5000
REPLICATE_API_KEY=your_replicate_api_key_here
EOL

# Configure nginx
echo "⚙️ Configuring nginx..."
sudo tee /etc/nginx/conf.d/peppo-ai.conf > /dev/null << EOL
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start server.js --name "peppo-ai-backend"

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save
pm2 startup

echo "✅ Deployment completed successfully!"
echo "🌐 Your app should be running at: http://your-ec2-public-ip"
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs peppo-ai-backend"
