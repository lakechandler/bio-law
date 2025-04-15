#!/bin/bash

echo "Setting up Biology Laws Hub Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install it first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt "20" ]; then
    echo "Node.js version 20 or higher is required. Current version: $(node -v)"
    echo "Please upgrade Node.js and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Set up environment variables if they don't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-replace-this-in-production

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=
EOL
    echo ".env.local file created. Please update it with your settings."
fi

# Set up API types from Encore
echo "Setting up API types from Encore..."
mkdir -p src/lib/api
echo "// Auto-generated API client will be generated here" > src/lib/api/index.ts
echo "// Run 'encore gen client typescript --output-dir=../frontend/src/lib/api' from the backend directory" >> src/lib/api/index.ts

echo "Setup complete! You can now start the development server with:"
echo "npm run dev" 