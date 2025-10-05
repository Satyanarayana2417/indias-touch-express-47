# Deploy Firebase Functions for Enhanced Image Upload
# Run this script from the project root directory

Write-Host "🚀 Deploying Enhanced Image Upload Functions..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "functions")) {
    Write-Host "❌ Error: functions directory not found. Make sure you're in the project root." -ForegroundColor Red
    exit 1
}

# Navigate to functions directory
Set-Location functions

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Building functions..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to build functions" -ForegroundColor Red
    exit 1
}

Write-Host "☁️ Deploying to Firebase..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to deploy functions" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Return to project root
Set-Location ..

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 To test the deployment:" -ForegroundColor Cyan
Write-Host "1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "2. Login as admin" -ForegroundColor White
Write-Host "3. Go to admin/products/new" -ForegroundColor White
Write-Host "4. Try the 'Add from URL' tab" -ForegroundColor White
Write-Host ""
Write-Host "📝 Test with these sample URLs:" -ForegroundColor Cyan
Write-Host "• https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b" -ForegroundColor White
Write-Host "• https://via.placeholder.com/400x300.jpg" -ForegroundColor White
Write-Host "• https://picsum.photos/400/300" -ForegroundColor White