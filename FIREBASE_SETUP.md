# Firebase Setup Guide for Venkat Express

## Current Status
The application is currently running in **offline mode** with mock data. This prevents Firebase connection errors while allowing you to test all functionality.

## Setting Up Firebase (Optional)

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose "Web"
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Update Environment Variables
Replace the values in `.env` file with your actual Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### 5. Restart Development Server
After updating the environment variables, restart the development server:
```bash
npm run dev
```

## Current Features Working in Offline Mode
- ✅ Product Detail Pages
- ✅ Product Variants and Pricing
- ✅ Add to Cart functionality
- ✅ Recommended Products
- ✅ Image Gallery with zoom
- ✅ Responsive design
- ✅ All UI interactions

## Mock Data Products Available
- Product ID 1: Premium Garam Masala
- Product ID 2: Organic Turmeric Powder

## Benefits of Connecting Firebase
Once Firebase is properly configured, you'll get:
- Real-time product data
- Product search functionality
- Product management capabilities
- User authentication
- Order management
- Scalable database

## Troubleshooting
If you see Firebase connection errors:
1. Check that your `.env` file has the correct values
2. Ensure your Firebase project has Firestore enabled
3. Verify that your API key is valid
4. Make sure you've restarted the development server after changing `.env`

## Need Help?
The application is designed to work perfectly in offline mode for development and testing. You can add Firebase later when you're ready to deploy to production.
