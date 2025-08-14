# 🚀 Quick Start Guide - Peppo AI Video Generator

Get your AI video generation app running in under 5 minutes!

## ⚡ Super Quick Setup

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Start the Application
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend (Vite)
npm run dev-client
```

### 3. Open Your Browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 What You'll See

1. **Beautiful Landing Page** with glassmorphism design
2. **Text Input Box** for your video prompts
3. **Generate Button** to create videos
4. **Demo Mode** using sample videos (no API key needed for testing)

## 🧪 Test the App

### Try These Prompts:
- "A majestic dragon flying over a medieval castle at sunset"
- "A peaceful forest with sunlight streaming through trees"
- "A futuristic city with flying cars and neon lights"
- "A serene beach at golden hour with gentle waves"

### Test API Endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Generate video
curl -X POST http://localhost:5000/api/generate-video \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful sunset"}'
```

## 🔑 Add Real AI Video Generation

### Option 1: Runway ML (Recommended)
1. Sign up at [runway.ml](https://runway.ml)
2. Get your API key
3. Create `.env` file:
```env
RUNWAY_API_KEY=your_key_here
NODE_ENV=development
```

### Option 2: Pika Labs
1. Sign up at [pika.art](https://pika.art)
2. Get your API key
3. Update `.env` file with `PIKA_API_KEY`

## 🚀 Deploy to Production

### Render (Free Tier)
1. Push code to GitHub
2. Connect to [render.com](https://render.com)
3. Deploy automatically

### Railway
1. Install Railway CLI: `npm i -g @railway/cli`
2. Run: `railway login && railway up`

## 📱 Features You'll Love

- ✨ **Modern UI** with smooth animations
- 📱 **Mobile-first** responsive design
- 🔒 **Secure** API key handling
- ⚡ **Fast** video generation
- 🎨 **Beautiful** glassmorphism design
- 📥 **Download** generated videos
- 🔄 **Real-time** progress updates

## 🐛 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
```

**Dependencies not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Frontend won't start:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Check Logs:
```bash
# Backend logs
npm run dev

# Frontend logs (in client directory)
npm run dev
```

## 🎉 You're Ready!

Your Peppo AI Video Generator is now running! 

**Next Steps:**
1. ✅ Test the app locally
2. 🔑 Add your AI API key
3. 🚀 Deploy to production
4. 📝 Update README with live URL
5. 🎯 Submit your internship application!

## 🆘 Need Help?

- 📖 Check the full [README.md](README.md)
- 🐛 Run the test script: `node test.js`
- 🚀 Use the deployment script: `./deploy.sh all`
- 💬 Check the code comments for guidance

---

**Good luck with your Peppo AI internship challenge! 🎬✨**
