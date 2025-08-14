# 🎬 Peppo AI Video Generator

**AI-powered video generation web application built for the Peppo AI Engineering Internship Challenge**

Transform your text descriptions into stunning 5-10 second videos using advanced AI models. This application demonstrates full-stack development skills, AI integration, and cloud deployment capabilities.

## ✨ Features

- **AI Video Generation**: Create videos from natural language prompts
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Real-time Processing**: Live video generation with progress indicators
- **Download Support**: Save generated videos locally
- **Responsive Design**: Works perfectly on all devices
- **Security**: Rate limiting, CORS protection, and secure API key handling
- **Cloud Ready**: Optimized for deployment on Render, Railway, AWS, and more

## 🚀 Live Demo

**Application URL**: [Your deployed app link here]
**GitHub Repository**: [Your GitHub repo link here]

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **Security**: Helmet, CORS, Rate Limiting, Compression
- **AI Integration**: Axios for API calls to video generation services

### Frontend
- **React 18** with modern hooks
- **Build Tool**: **Vite** for fast development and optimized builds
- **Styling**: CSS3 with glassmorphism effects
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React for beautiful iconography
- **Responsive**: Mobile-first design approach

### AI Video APIs Supported
- **Runway ML Gen-3 Alpha** (Recommended)
- **Pika Labs**
- **Stability AI**
- **OpenAI Sora** (when available)

## 📋 Prerequisites

- Node.js 16.0.0 or higher (fully tested with Node.js 20+)
- npm or yarn package manager
- AI Video Generation API key (Runway ML, Pika Labs, etc.)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/peppo-ai-video-generator.git
cd peppo-ai-video-generator
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your API keys
nano .env
```

**Required Environment Variables:**
```env
# Choose one AI API key
RUNWAY_API_KEY=your_runway_api_key_here
# OR
PIKA_API_KEY=your_pika_api_key_here
# OR
STABILITY_API_KEY=your_stability_api_key_here

# Server configuration
PORT=5000
NODE_ENV=development
```

### 4. Run the Application

#### Development Mode
```bash
# Terminal 1: Start backend server
npm run dev

# Terminal 2: Start Vite frontend
npm run dev-client
```

#### Production Mode
```bash
# Build the React app with Vite
npm run build

# Start production server
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🌐 Deployment

### Render (Recommended for Free Tier)

1. **Connect Repository**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   - **Name**: `peppo-ai-video-generator`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables**
   - Add your API keys in the Render dashboard
   - Set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment

### Railway

1. **Connect Repository**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Deploy**
   - Railway automatically detects Node.js
   - Add environment variables
   - Deploy automatically

### AWS/GCP/Azure

1. **Build Docker Image**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Deploy to Container Service**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### Generate Video
```
POST /api/generate-video
Content-Type: application/json

{
  "prompt": "A majestic dragon flying over a medieval castle at sunset"
}
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://example.com/video.mp4",
  "prompt": "A majestic dragon flying over a medieval castle at sunset",
  "duration": "5 seconds",
  "message": "Video generated successfully!"
}
```

## 🔒 Security Features

- **API Key Protection**: Environment variables for sensitive data
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Prompt length and content validation
- **Helmet Security**: HTTP security headers
- **Compression**: Gzip compression for performance

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop Experience**: Full-featured interface
- **Touch Friendly**: Optimized for touch interactions

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern glass-like effects
- **Smooth Animations**: Framer Motion animations
- **Loading States**: Beautiful loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Performance Optimizations

- **Vite Build Tool**: Lightning-fast development and optimized production builds
- **Code Splitting**: Automatic chunk splitting for better performance
- **Image Optimization**: Optimized video loading
- **Caching**: Browser caching strategies
- **Compression**: Gzip compression enabled
- **CDN Ready**: Optimized for CDN deployment

## 🧪 Testing

```bash
# Run backend tests
node test.js

# Frontend testing (when implemented)
cd client
npm run test
```

## 📊 Monitoring & Logging

- **Health Checks**: `/api/health` endpoint
- **Error Logging**: Console and structured logging
- **Performance Metrics**: Response time tracking
- **Rate Limit Monitoring**: Request tracking

## 🔮 Future Enhancements

- **Video Streaming**: Real-time video generation
- **Batch Processing**: Multiple video generation
- **Video Editing**: Basic editing capabilities
- **User Accounts**: User management system
- **Video Gallery**: Generated video history
- **Advanced Prompts**: Template-based prompts
- **Video Analytics**: Generation statistics

## 🤝 Contributing

This project was built for the Peppo AI Engineering Internship Challenge. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Peppo AI Engineering Internship Candidate**
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio Website]

## 🙏 Acknowledgments

- **Peppo AI** for the internship opportunity
- **Runway ML** for AI video generation technology
- **Vite Team** for the amazing build tool
- **React Team** for the amazing framework
- **Open Source Community** for inspiration and tools

## 📞 Support

For questions about this project or the Peppo AI internship:
- **Email**: [Your Email]
- **GitHub Issues**: [Repository Issues Page]
- **Peppo AI**: [Company Contact Information]

---

**Built with ❤️ for the Peppo AI Engineering Internship Challenge**

*This application demonstrates proficiency in full-stack development, AI integration, cloud deployment, and modern web technologies.*
