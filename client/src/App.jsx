import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video, Download, Sparkles, Loader } from 'lucide-react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a video.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedVideo(null);

    try {
      const response = await axios.post('/api/generate-video', { prompt });
      
      console.log('API Response:', response.data); // Debug log
      
      if (response.data.success) {
        setGeneratedVideo(response.data);
        console.log('Video URL:', response.data.videoUrl); // Debug log
      } else {
        setError('Failed to generate video. Please try again.');
      }
    } catch (err) {
      console.error('Error generating video:', err);
      setError(err.response?.data?.error || 'An error occurred while generating the video.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo?.videoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `peppo-ai-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerateVideo();
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <motion.header 
          className="header text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video size={48} color="white" />
          </motion.div>
          <h1 className="title">Peppo AI Video Generator</h1>
          <p className="subtitle">
            Transform your ideas into stunning videos with AI
          </p>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Input Section */}
          <div className="card input-section">
            <div className="input-group">
              <label htmlFor="prompt" className="input-label">
                <Sparkles size={16} />
                Describe Your Video
              </label>
              <textarea
                id="prompt"
                className="text-input"
                placeholder="e.g., A majestic dragon flying over a medieval castle at sunset, cinematic lighting, epic atmosphere..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                maxLength={500}
                disabled={isGenerating}
              />
              <div className="char-count">
                {prompt.length}/500 characters
              </div>
            </div>

            <motion.button
              className={`btn btn-primary ${isGenerating ? 'disabled' : ''}`}
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              whileHover={!isGenerating ? { scale: 1.02 } : {}}
              whileTap={!isGenerating ? { scale: 0.98 } : {}}
            >
              {isGenerating ? (
                <>
                  <Loader className="loading-spinner" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Generate Video
                </>
              )}
            </motion.button>

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Generated Video Section */}
          {generatedVideo && (
            <motion.div 
              className="card video-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Generated Video</h2>
              <p className="prompt-display">
                <strong>Prompt:</strong> {generatedVideo.prompt}
              </p>
              
              <div className="video-container">
                <video
                  className="video-player"
                  controls
                  autoPlay={false}
                  muted
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => console.error('Video error:', e)}
                  onLoadStart={() => console.log('Video loading started')}
                  onLoadedData={() => console.log('Video data loaded')}
                  onCanPlay={() => console.log('Video can play')}
                >
                  <source src={generatedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="video-debug">Video URL: {generatedVideo.videoUrl}</p>
              </div>

              <div className="video-info">
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{generatedVideo.duration}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value success">
                    {generatedVideo.status === 'generation-started' ? 'AI Generation Started' : 'Generated Successfully'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Source:</span>
                  <span className="info-value">{generatedVideo.source}</span>
                </div>
              </div>

              <div className="action-buttons">
                <motion.button
                  className="btn btn-secondary"
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download size={20} />
                  Download Video
                </motion.button>
                
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => {
                    setGeneratedVideo(null);
                    setPrompt('');
                    setError('');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Another
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Features Section */}
          <motion.div 
            className="card features-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="section-title">Features</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎬</div>
                <h3>AI-Powered Generation</h3>
                <p>Create videos from text descriptions using advanced AI models</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h3>Fast Processing</h3>
                <p>Generate 5-10 second videos in seconds</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎨</div>
                <h3>Creative Freedom</h3>
                <p>Unlimited creative possibilities with natural language prompts</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </motion.div>
        </motion.main>

        {/* Footer */}
        <motion.footer 
          className="footer text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>Built for Peppo AI Engineering Internship Challenge</p>
          <p>Powered by AI Video Generation Technology</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
