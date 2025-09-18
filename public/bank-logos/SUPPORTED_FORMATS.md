# Bank Logo URL Examples

This file shows examples of all supported image formats and URL types for bank logos.

## ✅ Supported Image Formats

### Raster Formats:
- **PNG** (Recommended for logos with transparency)
- **JPG/JPEG** (Good for photos, smaller file size)
- **WebP** (Modern format, excellent compression)
- **GIF** (Supports animation, transparency)
- **BMP** (Uncompressed, large file size)
- **TIFF** (High quality, large file size)

### Vector Formats:
- **SVG** (Scalable, perfect for logos, small file size)

## 📁 Local File Examples

```tsx
// PNG format
src="/bank-logos/sbi-logo.png"

// JPG format  
src="/bank-logos/hdfc-logo.jpg"

// SVG format (Recommended for crisp scaling)
src="/bank-logos/icici-logo.svg"

// WebP format (Modern, great compression)
src="/bank-logos/axis-logo.webp"

// JPEG format
src="/bank-logos/pnb-logo.jpeg"

// GIF format
src="/bank-logos/bob-logo.gif"
```

## 🌐 External URL Examples

```tsx
// Google Images
src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwJIli9wfjnY2K9ZDnYiJqLJdyG3_0bJ7EQ&s"

// CDN URLs
src="https://cdn.example.com/logos/bank-logo.png"
src="https://assets.bankwebsite.com/images/logo.svg"

// Direct image URLs
src="https://example.com/images/bank-logo.jpg"
src="https://logo-api.com/bank/sbi.webp"

// Base64 Data URLs (for small images)
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..."
```

## 🔧 How to Update Logo URLs

### Method 1: Edit the Component File
1. Open `NetBankingPanel.tsx` or `MobilePaymentMethods.tsx`
2. Find the bank you want to update
3. Change the `src` attribute:

```tsx
// Before
<img src="/bank-logos/sbi-logo.png" />

// After - any format works!
<img src="/bank-logos/sbi-logo.svg" />
<img src="https://example.com/sbi-logo.jpg" />
<img src="/bank-logos/sbi-logo.webp" />
```

### Method 2: Replace Files in Public Folder
1. Add your logo file to `/public/bank-logos/`
2. Use any supported format
3. The component will automatically load it

## 💡 Best Practices

1. **SVG**: Best for logos (crisp at any size, small file)
2. **PNG**: Good for logos with transparency
3. **WebP**: Modern format with excellent compression
4. **JPG**: Good for complex images, smaller file size
5. **External URLs**: Make sure they support CORS and are reliable

## ⚠️ Important Notes

- External URLs must be accessible (no CORS restrictions)
- File paths are case-sensitive
- Always include proper `alt` attributes for accessibility
- Fallback system automatically shows bank abbreviation if image fails