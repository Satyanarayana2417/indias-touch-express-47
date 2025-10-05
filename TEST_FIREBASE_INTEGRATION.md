# Firebase Integration Test Guide

## Overview
This guide helps you test the complete Firebase integration for the product management system.

## Features Implemented

### ✅ Firebase Configuration
- **Firebase Storage**: For product image uploads
- **Firebase Firestore**: For product data storage
- **Firebase Auth**: For admin authentication
- **Real-time Sync**: Automatic updates across admin and main website

### ✅ Admin Product Management
- **Add New Products**: Complete form with image upload
- **Edit Products**: Update existing products with real-time sync
- **Delete Products**: Remove products with image cleanup
- **Advanced Filtering**: Search, category, stock status filters
- **Smart Sorting**: Sort by name, price, category, date
- **Stock Alerts**: Low stock and out-of-stock notifications

### ✅ Main Website Integration
- **Dynamic Product Loading**: Fetches from Firebase with mock fallback
- **Real-time Updates**: Products update instantly when admin makes changes
- **Featured Products**: Dynamic featured product section
- **Product Details**: Real-time product detail pages
- **Consistent UI**: Maintains original design and styling

## Test Steps

### 1. Test Admin Access
1. Navigate to `/admin` in your browser
2. Verify admin authentication is required
3. Access admin dashboard after authentication

### 2. Test Product Management
1. Go to **Admin > Products**
2. Check stock alerts display (if any low/out of stock products exist)
3. Test search functionality in the search bar
4. Test category filtering dropdown
5. Test stock status filtering (All, In Stock, Low Stock, Out of Stock)
6. Test sorting options (Name, Price, Category, Date)
7. Test sort order toggle (ascending/descending)

### 3. Test Add New Product
1. Click **"Add Product"** button
2. Fill in product details:
   - Name: Test Product
   - Price: 29.99
   - Description: Test description
   - Category: Select from dropdown
   - Upload an image file
3. Submit form and verify:
   - Image uploads to Firebase Storage
   - Product saves to Firestore
   - Redirects to products list
   - New product appears in list

### 4. Test Edit Product
1. Click edit icon on any product
2. Modify some fields
3. Upload a new image (optional)
4. Save changes and verify:
   - Changes reflect immediately
   - Old image is cleaned up if replaced

### 5. Test Delete Product
1. Click delete icon on any product
2. Confirm deletion
3. Verify:
   - Product removed from list
   - Images cleaned up from Storage

### 6. Test Real-time Sync
1. Open admin in one browser tab
2. Open main website in another tab
3. Add/edit/delete a product in admin
4. Verify changes appear instantly on main website
   - Shop page updates
   - Featured products update
   - Product detail pages update

### 7. Test Main Website
1. Navigate to main website home page
2. Check **Featured Products** section loads
3. Navigate to **Shop** page
4. Verify products load from Firebase
5. Test product detail pages
6. Verify search functionality works

## Expected Results

### ✅ Admin Dashboard
- Clean, responsive interface
- Real-time stock alerts
- Advanced filtering and sorting
- Smooth product management workflow

### ✅ Main Website
- Products load from Firebase
- Fallback to mock data if Firebase fails
- Real-time updates without page refresh
- Original UI/UX preserved

### ✅ Performance
- Fast image uploads with compression
- Efficient real-time subscriptions
- Optimized queries and pagination
- Proper loading states

## Troubleshooting

### If products don't load:
1. Check browser console for errors
2. Verify Firebase configuration in environment
3. Check network tab for failed requests

### If images don't upload:
1. Verify Firebase Storage rules
2. Check file size limits (max 5MB)
3. Ensure supported formats (JPG, PNG, WebP)

### If real-time sync doesn't work:
1. Check Firestore security rules
2. Verify subscription cleanup in useEffect
3. Check browser network connectivity

## Development URLs
- **Main Website**: http://localhost:8081/
- **Admin Dashboard**: http://localhost:8081/admin
- **Products Management**: http://localhost:8081/admin/products

## Files Modified
- `src/lib/firebase.ts` - Enhanced Firebase configuration
- `src/lib/imageUpload.ts` - NEW: Image upload service
- `src/lib/products.ts` - Enhanced with real-time operations
- `src/pages/AdminProductForm.tsx` - Real Firebase integration
- `src/pages/AdminProducts.tsx` - Enhanced with advanced features
- `src/pages/ShopProducts.tsx` - Firebase data integration
- `src/components/FeaturedProducts.tsx` - Dynamic product loading
- `src/pages/ProductDetail.tsx` - Real-time product updates

## Success Criteria
✅ Products can be added, edited, and deleted through admin interface
✅ Images upload to Firebase Storage with proper compression
✅ Product data syncs in real-time between admin and main website
✅ Advanced filtering and sorting works in admin panel
✅ Stock alerts display correctly
✅ Main website loads products dynamically from Firebase
✅ Original UI/UX design is preserved
✅ System gracefully handles errors and loading states