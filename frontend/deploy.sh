#!/bin/bash

# Build and test the Docker image locally
echo "Building Docker image..."
docker build -t chatbot-canvas-frontend .

# Test the container locally
echo "Testing container locally..."
docker run -d -p 3000:80 --name chatbot-canvas-test chatbot-canvas-frontend

# Wait for container to start
sleep 5

# Test health endpoint
echo "Testing health endpoint..."
curl -f http://localhost:3000/health || echo "Health check failed"

# Clean up test container
echo "Cleaning up test container..."
docker stop chatbot-canvas-test
docker rm chatbot-canvas-test

echo "Docker image is ready for deployment!"
echo "To deploy to Render:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Render"
echo "3. Use the render.yaml configuration"
echo "4. Update VITE_API_BASE_URL in render.yaml with your backend URL"
