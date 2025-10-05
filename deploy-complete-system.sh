#!/bin/bash

# Complete Image Upload System - Deployment Script
# This script deploys the enhanced image upload system with real-time sync

echo "🚀 Deploying Complete Image Upload System..."
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
npm install

echo "🔧 Step 2: Building the project..."
npm run build

echo "☁️ Step 3: Deploying Firebase Functions..."
cd functions

# Install function dependencies
echo "   📥 Installing function dependencies..."
npm install

# Build functions
echo "   🔨 Building functions..."
npm run build

# Deploy functions
echo "   🚀 Deploying functions to Firebase..."
firebase deploy --only functions

cd ..

echo "🔥 Step 4: Deploying Firestore rules..."
firebase deploy --only firestore:rules

echo "📄 Step 5: Deploying Firestore indices..."
firebase deploy --only firestore:indexes

echo "🌐 Step 6: Starting development server..."
echo "   The development server will start on http://localhost:8081"
echo "   Admin panel: http://localhost:8081/admin"
echo ""

echo "✅ Deployment Complete!"
echo "========================"
echo ""
echo "🎯 What's been deployed:"
echo "   ✅ Enhanced image upload system"
echo "   ✅ Real-time synchronization"
echo "   ✅ Complete format support (JPEG, PNG, WebP, GIF, HEIC, HEIF, RAW, etc.)"
echo "   ✅ Cloudinary integration with optimization"
echo "   ✅ Firebase Functions with error handling"
echo "   ✅ Admin authentication and security"
echo ""
echo "🧪 Testing Instructions:"
echo "   1. Open http://localhost:8081/admin"
echo "   2. Login as admin"
echo "   3. Navigate to Products → Add New Product"
echo "   4. Test image upload (file or URL)"
echo "   5. Open main website in another tab"
echo "   6. Verify images appear instantly without refresh"
echo ""
echo "📚 Documentation:"
echo "   - complete-image-system-test.html - System overview and test guide"
echo "   - IMPLEMENTATION_COMPLETE.md - Technical documentation"
echo "   - ENHANCED_IMAGE_UPLOAD_GUIDE.md - Feature guide"
echo ""

# Start development server
npm run dev