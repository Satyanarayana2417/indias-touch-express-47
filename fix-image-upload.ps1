# Image Upload Fix - Deployment Script
# This script fixes the image upload issues in admin panel

Write-Host "🔧 Image Upload Fix - Starting Deployment..." -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Installing/Updating Dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Step 2: Building Functions..." -ForegroundColor Yellow
Set-Location "functions"

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Functions directory not found or invalid" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

npm install
npm run build

Write-Host "Step 3: Deploying Firebase Functions..." -ForegroundColor Yellow
firebase deploy --only functions

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Functions deployment may have failed, but continuing..." -ForegroundColor Yellow
}

Set-Location ".."

Write-Host "Step 4: Deploying Firestore Rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules

Write-Host "Step 5: Creating Admin User Setup Guide..." -ForegroundColor Yellow

$adminSetup = @"
🔒 ADMIN USER SETUP REQUIRED
================================

If image uploads are still not working, you need to set up an admin user:

1. Login to your Firebase Console: https://console.firebase.google.com
2. Go to your project: venkat-express-c95bb
3. Navigate to Firestore Database
4. Create a collection called 'users'
5. Add a document with your user ID as the document ID
6. Add the following fields:
   - email: "your-admin-email@example.com"
   - role: "admin"
   - name: "Admin User"
   - createdAt: (current timestamp)
   - permissions: ["products", "orders", "users", "settings"]

Example document structure:
{
  "email": "admin@venkatexpress.com",
  "role": "admin", 
  "name": "Admin User",
  "createdAt": "2025-10-03T07:30:00.000Z",
  "permissions": ["products", "orders", "users", "settings"]
}

🔍 TESTING TOOLS AVAILABLE:
- Debug Tool: http://localhost:8081/image-upload-debug.html
- System Diagnostic: Open browser console and run:
  ImageUploadFixer.SystemDiagnostic.runCompleteCheck()
"@

Write-Host $adminSetup -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Image Upload Fix Deployment Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 TESTING STEPS:" -ForegroundColor White
Write-Host "1. Start dev server: npm run dev" -ForegroundColor Gray
Write-Host "2. Open debug tool: http://localhost:8081/image-upload-debug.html" -ForegroundColor Gray  
Write-Host "3. Login to admin panel: http://localhost:8081/admin" -ForegroundColor Gray
Write-Host "4. Test image uploads in product form" -ForegroundColor Gray
Write-Host ""
Write-Host "🚨 COMMON ISSUES & FIXES:" -ForegroundColor Yellow
Write-Host "❌ 'Functions not deployed' → Re-run: firebase deploy --only functions" -ForegroundColor Red
Write-Host "❌ 'Permission denied' → Set up admin user in Firestore (see above)" -ForegroundColor Red
Write-Host "❌ 'Not authenticated' → Login to admin panel first" -ForegroundColor Red
Write-Host "❌ 'Firebase connection failed' → Check internet & Firebase config" -ForegroundColor Red
Write-Host ""

$startServer = Read-Host "Start development server now? (y/N)"
if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    npm run dev
}