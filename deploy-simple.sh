#!/bin/bash

# Simple EC2 Deployment Script
# Run this after connecting to your EC2 instance

echo "🚀 Quick EC2 Deployment for Peppo AI..."

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create app directory
mkdir -p ~/peppo-ai
cd ~/peppo-ai

# Clone your repo (Updated with your actual GitHub username)
git clone https://github.com/gulshan0007/peppo-ai-video-generator.git .

# Install dependencies
npm install
cd client && npm install && npm run build && cd ..

# Create .env file
cat > .env << EOL
NODE_ENV=production
PORT=5000
REPLICATE_API_KEY=your_replicate_api_key_here
EOL

# Start with PM2
pm2 start server.js --name "peppo-ai"
pm2 save
pm2 startup

echo "✅ Quick deployment done!"
echo "🌐 App running on port 5000"
echo "📊 Check: pm2 status"
