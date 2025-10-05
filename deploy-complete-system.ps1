# Complete Image Upload System - Deployment Script (PowerShell)
# This script deploys the enhanced image upload system with real-time sync

Write-Host "🚀 Deploying Complete Image Upload System..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Step 2: Building the project..." -ForegroundColor Yellow
npm run build

Write-Host "☁️ Step 3: Deploying Firebase Functions..." -ForegroundColor Yellow
Set-Location "functions"

# Install function dependencies
Write-Host "   📥 Installing function dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install function dependencies" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Build functions
Write-Host "   🔨 Building functions..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build functions" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Deploy functions
Write-Host "   🚀 Deploying functions to Firebase..." -ForegroundColor Cyan
firebase deploy --only functions

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy functions" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Set-Location ".."

Write-Host "🔥 Step 4: Deploying Firestore rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules

Write-Host "📄 Step 5: Deploying Firestore indices..." -ForegroundColor Yellow
firebase deploy --only firestore:indexes

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 What's been deployed:" -ForegroundColor White
Write-Host "   ✅ Enhanced image upload system" -ForegroundColor Green
Write-Host "   ✅ Real-time synchronization" -ForegroundColor Green
Write-Host "   ✅ Complete format support (JPEG, PNG, WebP, GIF, HEIC, HEIF, RAW, etc.)" -ForegroundColor Green
Write-Host "   ✅ Cloudinary integration with optimization" -ForegroundColor Green
Write-Host "   ✅ Firebase Functions with error handling" -ForegroundColor Green
Write-Host "   ✅ Admin authentication and security" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Testing Instructions:" -ForegroundColor Yellow
Write-Host "   1. Run: npm run dev" -ForegroundColor Cyan
Write-Host "   2. Open http://localhost:8081/admin" -ForegroundColor Cyan
Write-Host "   3. Login as admin" -ForegroundColor Cyan
Write-Host "   4. Navigate to Products → Add New Product" -ForegroundColor Cyan
Write-Host "   5. Test image upload (file or URL)" -ForegroundColor Cyan
Write-Host "   6. Open main website in another tab" -ForegroundColor Cyan
Write-Host "   7. Verify images appear instantly without refresh" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor White
Write-Host "   - complete-image-system-test.html - System overview and test guide" -ForegroundColor Gray
Write-Host "   - IMPLEMENTATION_COMPLETE.md - Technical documentation" -ForegroundColor Gray
Write-Host "   - ENHANCED_IMAGE_UPLOAD_GUIDE.md - Feature guide" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 Ready to start development server?" -ForegroundColor Yellow
$response = Read-Host "Press Y to start npm run dev, or any other key to exit"

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    npm run dev
}

Write-Host ""
Write-Host "🎉 System ready! Happy coding!" -ForegroundColor Green