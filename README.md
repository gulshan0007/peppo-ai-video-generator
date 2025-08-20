# 🎬 Peppo AI Video Generator

A full-stack AI video generation web application that creates short videos from natural language prompts using the Replicate API.

## 🌟 **Live Demo**

**🚀 Live App**: [http://34.229.176.75:5000](http://34.229.176.75:5000)

## ✨ **Features**

- **AI Video Generation**: Create videos from natural language prompts using Replicate's Stable Video Diffusion
- **Real-time Processing**: Asynchronous video generation with status updates
- **Modern UI/UX**: Beautiful, responsive interface built with React and Framer Motion
- **Production Ready**: Deployed on AWS EC2 with PM2 process management
- **Security**: Rate limiting, CORS protection, and input validation
- **Fallback Mode**: Demo videos when API is unavailable

## 🛠 **Tech Stack**

### **Backend**
- **Node.js** with Express.js
- **Replicate API** for AI video generation
- **PM2** for process management
- **Helmet** for security headers
- **Rate limiting** and CORS protection

### **Frontend**
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Responsive CSS** with modern design

### **Deployment**
- **AWS EC2** for hosting
- **Nginx** for reverse proxy (optional)
- **Git** for version control
- **Environment-based** configuration

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Replicate API key (free at [replicate.com](https://replicate.com))

### **1. Clone the Repository**
```bash
git clone https://github.com/gulshan0007/peppo-ai-video-generator.git
cd peppo-ai-video-generator
```

### **2. Install Dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### **3. Set Up Environment Variables**
```bash
# Create a .env file in the root directory
touch .env

# Edit the .env file with your API key
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=5000
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

**Note**: You can also use `REPLICATE_API_KEY` for backward compatibility.

### **4. Get Your Replicate API Token**
1. Visit [replicate.com](https://replicate.com)
2. Sign up for a free account
3. Go to your [API tokens page](https://replicate.com/account/api-tokens)
4. Create a new API token
5. Copy the token to your `.env` file as `REPLICATE_API_TOKEN`

### **5. Run the Application**

#### **Development Mode**
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start frontend development server
npm run dev-client
```

#### **Production Mode**
```bash
# Build the frontend
npm run build-client

# Start the production server
npm start
```

## 🌐 **Access the App**

- **Local Development**: http://localhost:5000
- **Frontend Dev Server**: http://localhost:3000
- **Live Production**: http://34.229.176.75:5000

## 🔧 **API Endpoints**

### **Health Check**
```
GET /api/health
```

### **Video Generation**
```
POST /api/generate-video
Content-Type: application/json

{
  "prompt": "A beautiful sunset over the ocean"
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://...",
  "prompt": "A beautiful sunset over the ocean",
  "duration": "5 seconds",
  "message": "AI video generation started!",
  "source": "replicate",
  "predictionId": "abc123...",
  "status": "generation-started"
}
```

## 🚀 **Deployment to AWS EC2**

### **1. Launch EC2 Instance**
- **Instance Type**: t2.micro (free tier) or t3.small
- **OS**: Amazon Linux 2 or Ubuntu 20.04+
- **Security Group**: Allow HTTP (port 80) and custom port 5000

### **2. Connect and Setup**
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo yum install -y git
```

### **3. Deploy Your App**
```bash
# Clone your repository
git clone https://github.com/gulshan0007/peppo-ai-video-generator.git
cd peppo-ai-video-generator

# Install dependencies
npm install

# Build the frontend
cd client
npm install
npm run build
cd ..

# Set up environment variables
cat > .env << EOL
NODE_ENV=production
PORT=5000
REPLICATE_API_KEY=your_actual_api_key_here
EOL

# Start the application with PM2
pm2 start server.js --name "peppo-ai"

# Save PM2 configuration
pm2 save
pm2 startup
```

### **4. Configure Firewall (Optional)**
```bash
# Allow port 5000 through firewall
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

## 📱 **Usage**

1. **Open the App**: Visit http://34.229.176.75:5000
2. **Enter a Prompt**: Describe the video you want to generate
3. **Generate Video**: Click "Generate Video" button
4. **Wait for Processing**: AI generation takes 2-5 minutes
5. **View Results**: Watch your generated video

## 🔒 **Security Features**

- **Rate Limiting**: 50 requests per 15 minutes per IP
- **Input Validation**: Prompt length and content validation
- **CORS Protection**: Configured for production domains
- **Security Headers**: Helmet.js with HTTP-compatible settings
- **Environment Variables**: API keys stored securely

## 🐛 **Troubleshooting**

### **Common Issues**

#### **SSL Protocol Errors**
- **Cause**: Browser trying to load resources over HTTPS
- **Solution**: Ensure Vite config has `base: './'` and rebuild

#### **CORS Errors**
- **Cause**: Frontend and backend on different origins
- **Solution**: Update CORS configuration in server.js

#### **API Key Issues**
- **Cause**: Invalid or missing Replicate API key
- **Solution**: Verify API key in .env file and restart server

#### **Port Already in Use**
- **Cause**: Another process using port 5000
- **Solution**: Change PORT in .env or kill existing process

### **Debug Commands**
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs peppo-ai

# Restart app
pm2 restart peppo-ai

# Check health endpoint
curl http://localhost:5000/api/health
```

## 📊 **Performance**

- **Frontend Build**: ~300KB gzipped
- **API Response Time**: <100ms for prompt validation
- **Video Generation**: 2-5 minutes via Replicate API
- **Concurrent Users**: Supports 50+ with rate limiting

## 🔮 **Future Enhancements**

- [ ] **Real-time Status Updates**: WebSocket integration for generation progress
- [ ] **Video Polling**: Automatic status checking and result retrieval
- [ ] **User Authentication**: User accounts and video history
- [ ] **Multiple AI Models**: Support for different video generation APIs
- [ ] **Video Download**: Direct download of generated videos
- [ ] **Mobile App**: React Native version

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Replicate** for providing the AI video generation API
- **Vite** for the fast build tooling
- **Framer Motion** for smooth animations
- **AWS** for cloud infrastructure



---

**⭐ Star this repository if you found it helpful!**

**🚀 Built with ❤️ for the Peppo AI Engineering Internship Challenge**
