// Simple test script for Peppo AI Video Generator API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Peppo AI Video Generator API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test video generation endpoint
    console.log('2. Testing video generation endpoint...');
    const testPrompt = 'A beautiful sunset over the ocean with gentle waves';
    const videoResponse = await axios.post(`${BASE_URL}/api/generate-video`, {
      prompt: testPrompt
    });
    console.log('✅ Video generation test passed:', videoResponse.data);
    console.log('');

    // Test error handling (empty prompt)
    console.log('3. Testing error handling (empty prompt)...');
    try {
      await axios.post(`${BASE_URL}/api/generate-video`, { prompt: '' });
      console.log('❌ Should have returned an error for empty prompt');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Error handling working correctly for empty prompt');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test error handling (very long prompt)
    console.log('4. Testing error handling (very long prompt)...');
    const longPrompt = 'A'.repeat(501);
    try {
      await axios.post(`${BASE_URL}/api/generate-video`, { prompt: longPrompt });
      console.log('❌ Should have returned an error for long prompt');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Error handling working correctly for long prompt');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('🚀 Your Peppo AI Video Generator is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   npm run dev');
    }
    
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
