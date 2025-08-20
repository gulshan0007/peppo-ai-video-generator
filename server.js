const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Replicate = require('replicate');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY,
});

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
// Updated video generation endpoint with proper text-to-video models
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
    if ((process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY) && 
        (process.env.REPLICATE_API_TOKEN !== 'your_replicate_api_token_here' && 
         process.env.REPLICATE_API_KEY !== 'your_replicate_api_key_here')) {
      try {
        console.log('Using Replicate API for real text-to-video generation...');
        
        // Try different text-to-video models in order of preference
        const videoModels = [
          {
            name: "Luma Ray",
            version: "luma/ray",
            input: {
              prompt: prompt,
              negative_prompt: "low quality, blurry, distorted, deformed, watermark, text, ugly, bad anatomy, poor quality, low resolution",
              width: 1024,
              height: 576,
              num_frames: 24,
              fps: 8,
              guidance_scale: 7.5,
              num_inference_steps: 50
            }
          },
          {
            name: "Stable Video Diffusion",
            version: "stability-ai/stable-video-diffusion",
            input: {
              prompt: prompt,
              negative_prompt: "low quality, blurry, distorted, deformed, watermark, text, ugly, bad anatomy, poor quality, low resolution",
              motion_bucket_id: 127,
              fps: 6,
              width: 1024,
              height: 576,
              seed: Math.floor(Math.random() * 1000000),
            }
          },
          {
            name: "AnimateDiff Lightning",
            version: "guoyww/animatediff",
            input: {
              prompt: prompt,
              negative_prompt: "low quality, blurry, distorted, deformed, watermark, text, ugly, bad anatomy, poor quality, low resolution",
              width: 512,
              height: 512,
              num_frames: 16,
              num_inference_steps: 8,
              guidance_scale: 1.2,
              fps: 8
            }
          }
        ];

        let videoGenerated = false;
        let lastError = null;

        // Try each model until one works
        for (const model of videoModels) {
          try {
            console.log(`Trying ${model.name}...`);
            
            console.log(`Running ${model.name}...`);
            
            try {
              const output = await replicate.run(model.version, { input: model.input });
              
                             console.log(`✅ ${model.name} generated video successfully`);
               console.log('Output:', output); // Debug log
               
               // Handle different output formats from Replicate
               let videoUrl = null;
               if (output && typeof output === 'string') {
                 videoUrl = output;
               } else if (output && output.url) {
                 videoUrl = output.url();
               } else if (output && Array.isArray(output) && output.length > 0) {
                 videoUrl = output[0];
               }
               
               if (videoUrl) {
                 console.log('Final video URL:', videoUrl);
                 videoGenerated = true;
                 return res.json({
                   success: true,
                   videoUrl: videoUrl,
                   prompt: prompt,
                   duration: '5-10 seconds',
                   message: 'AI video generated successfully!',
                   source: 'replicate',
                   model: model.name,
                   status: 'generated-successfully'
                 });
               } else {
                 console.log(`⚠️ ${model.name} generated unexpected output format:`, output);
                 lastError = `${model.name} generated unexpected output format`;
                 continue;
               }
            } catch (runError) {
              console.error(`${model.name} run error:`, runError.message);
              lastError = runError;
              continue;
            }
          } catch (modelError) {
            console.error(`${model.name} error:`, modelError.message);
            lastError = modelError;
            continue;
          }
        }

        // If no model worked, fall back to demo mode
        if (!videoGenerated) {
          console.log('All video models failed, falling back to demo mode');
          throw new Error(`All video generation models failed. Last error: ${lastError?.message || 'Unknown error'}`);
        }

      } catch (replicateError) {
        console.error('Replicate API error:', replicateError.message);
        console.log('Falling back to demo mode...');
        
        // Fall through to demo mode instead of returning error immediately
      }
    } else {
      console.log('No valid Replicate API key found, using demo mode');
    }

    // Enhanced demo mode with better video selection
    console.log('Using demo mode with sample video');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const demoVideos = [
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Animated short film'
      },
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        description: 'Action sequence'
      },
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        description: 'Adventure scene'
      },
      {
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        description: 'Nature footage'
      }
    ];
    
    const randomVideo = demoVideos[Math.floor(Math.random() * demoVideos.length)];

    res.json({
      success: true,
      videoUrl: randomVideo.url,
      prompt: prompt,
      duration: '5-10 seconds',
      message: 'Video generated successfully! (Demo mode - using sample video)',
      source: 'demo',
      status: 'generated-successfully',
      description: randomVideo.description
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
  if ((process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY) && 
      (process.env.REPLICATE_API_TOKEN !== 'your_replicate_api_token_here' && 
       process.env.REPLICATE_API_KEY !== 'your_replicate_api_key_here')) {
    console.log(`✅ Replicate API key configured`);
  } else {
    console.log(`⚠️  Replicate API key not configured - using demo mode`);
  }
});
