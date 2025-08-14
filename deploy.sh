#!/bin/bash

# Peppo AI Video Generator - Deployment Script
# This script helps automate the deployment process

set -e

echo "🚀 Peppo AI Video Generator - Deployment Script"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Install dependencies
install_deps() {
    print_status "Installing backend dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd client
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Build the application
build_app() {
    print_status "Building React application with Vite..."
    cd client
    npm run build
    cd ..
    
    print_success "Application built successfully!"
}

# Check environment variables
check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please edit .env file with your API keys before deployment."
        else
            print_error "env.example file not found. Please create .env file manually."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Test the application
test_app() {
    print_status "Testing application..."
    
    # Start the server in background
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Application is running and healthy!"
    else
        print_error "Application health check failed!"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop the server
    kill $SERVER_PID 2>/dev/null || true
}

# Deploy to Render
deploy_render() {
    print_status "Preparing for Render deployment..."
    
    if [ ! -f render.yaml ]; then
        print_error "render.yaml not found. Cannot deploy to Render."
        return 1
    fi
    
    print_success "Ready for Render deployment!"
    print_status "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Render"
    echo "3. Deploy using the render.yaml configuration"
}

# Deploy to Railway
deploy_railway() {
    print_status "Preparing for Railway deployment..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not installed. Installing..."
        npm install -g @railway/cli
    fi
    
    print_success "Ready for Railway deployment!"
    print_status "Next steps:"
    echo "1. Run: railway login"
    echo "2. Run: railway init"
    echo "3. Run: railway up"
}

# Deploy to Docker
deploy_docker() {
    print_status "Preparing for Docker deployment..."
    
    if [ ! -f Dockerfile ]; then
        print_error "Dockerfile not found. Cannot build Docker image."
        return 1
    fi
    
    print_status "Building Docker image..."
    docker build -t peppo-ai-video-generator .
    
    if [ $? -eq 0 ]; then
        print_success "Docker image built successfully!"
        print_status "To run the container:"
        echo "docker run -p 5000:5000 --env-file .env peppo-ai-video-generator"
    else
        print_error "Docker build failed!"
        return 1
    fi
}

# Main deployment function
main() {
    case "${1:-all}" in
        "check")
            check_node
            check_npm
            check_env
            ;;
        "install")
            check_node
            check_npm
            install_deps
            ;;
        "build")
            install_deps
            build_app
            ;;
        "test")
            build_app
            test_app
            ;;
        "render")
            build_app
            deploy_render
            ;;
        "railway")
            build_app
            deploy_railway
            ;;
        "docker")
            build_app
            deploy_docker
            ;;
        "all")
            check_node
            check_npm
            check_env
            install_deps
            build_app
            test_app
            deploy_render
            deploy_railway
            deploy_docker
            ;;
        *)
            echo "Usage: $0 {check|install|build|test|render|railway|docker|all}"
            echo ""
            echo "Commands:"
            echo "  check     - Check system requirements"
            echo "  install   - Install dependencies"
            echo "  build     - Build the application"
            echo "  test      - Test the application locally"
            echo "  render    - Prepare for Render deployment"
            echo "  railway   - Prepare for Railway deployment"
            echo "  docker    - Build and deploy with Docker"
            echo "  all       - Run all steps (default)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

echo ""
print_success "Deployment script completed!"
echo ""
print_status "Next steps for production deployment:"
echo "1. Update your .env file with production API keys"
echo "2. Choose your deployment platform (Render, Railway, AWS, etc.)"
echo "3. Follow the platform-specific deployment instructions"
echo "4. Update the README.md with your live app URL"
echo ""
print_status "Good luck with your Peppo AI internship challenge! 🎉"
