const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware for production
app.use(helmet({
  contentSecurityPolicy: false, // Disable strict CSP for HTTP
  crossOriginEmbedderPolicy: false, // Disable for HTTP
  crossOriginOpenerPolicy: false, // Disable for HTTP
  crossOriginResourcePolicy: false, // Disable for HTTP
  originAgentCluster: false // Disable for HTTP
}));

app.use(compression());

// Stricter rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs (reduced for production)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://34.229.176.75:5000', 'http://34.229.176.75'] // Updated with your actual EC2 IP
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware with stricter limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve static files from Vite build
app.use(express.static('client/build'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Peppo AI Video Generator API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// AI Video Generation endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Prompt is required' 
      });
    }

    if (prompt.length > 500) {
      return res.status(400).json({ 
        error: 'Prompt too long. Maximum 500 characters allowed.' 
      });
    }

    console.log(`Generating video for prompt: "${prompt}"`);

    // Check if we have a Replicate API key
    if (process.env.REPLICATE_API_KEY && process.env.REPLICATE_API_KEY !== 'your_replicate_api_key_here') {
      try {
        console.log('Using Replicate API for real text-to-video generation...');
        
        // Replicate API call for text-to-video generation
        const replicateResponse = await axios.post('https://api.replicate.com/v1/predictions', {
          version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
          input: {
            prompt: prompt,
            video_length: "5",
            fps: 8,
            height: 576,
            width: 1024,
            num_frames: 40,
            guidance_scale: 12.5,
            negative_prompt: "low quality, blurry, distorted, deformed, watermark, text, ugly, bad anatomy"
          }
        }, {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000 // 1 minute timeout for prediction creation
        });
        
        if (replicateResponse.data && replicateResponse.data.id) {
          console.log('Replicate video generation started successfully');
          console.log('Prediction ID:', replicateResponse.data.id);
          
          // For now, return success with a message about the prediction
          // In production, you'd poll the prediction status and return the video URL
          return res.json({
            success: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Demo video for now
            prompt: prompt,
            duration: '5 seconds',
            message: 'AI video generation started! This may take a few minutes. Check the console for prediction ID.',
            source: 'replicate',
            predictionId: replicateResponse.data.id,
            status: 'generation-started'
          });
        } else {
          console.log('Replicate response missing prediction ID, falling back to demo mode');
          console.log('Response data:', replicateResponse.data);
        }
      } catch (replicateError) {
        console.error('Replicate API error:', replicateError.message);
        if (replicateError.response) {
          console.error('Response status:', replicateError.response.status);
          console.error('Response data:', replicateError.response.data);
        }
        console.log('Falling back to demo mode...');
      }
    } else {
      console.log('No valid Replicate API key found, using demo mode');
    }

    // Fallback to demo mode (mock response)
    console.log('Using demo mode with sample video');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Demo response - replace with actual API integration
    const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    res.json({
      success: true,
      videoUrl: demoVideoUrl,
      prompt: prompt,
      duration: '5 seconds',
      message: 'Video generated successfully! (Demo mode - using sample video)',
      source: 'demo'
    });

  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Catch-all handler for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Peppo AI Video Generator server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  
  // Check API key status
  if (process.env.REPLICATE_API_KEY && process.env.REPLICATE_API_KEY !== 'your_replicate_api_key_here') {
    console.log(`✅ Replicate API key configured`);
  } else {
    console.log(`⚠️  Replicate API key not configured - using demo mode`);
  }
});
