# Bank Logos Directory

This directory contains the bank logos for the payment interface.

## Required Logo Files:

### For MobilePaymentMethods.tsx:
- `sbi-logo.[format]` - State Bank of India logo
- `hdfc-logo.[format]` - HDFC Bank logo  
- `icici-logo.[format]` - ICICI Bank logo
- `axis-logo.[format]` - Axis Bank logo
- `pnb-logo.[format]` - Punjab National Bank logo
- `bob-logo.[format]` - Bank of Baroda logo
- `canara-logo.[format]` - Canara Bank logo
- `union-logo.[format]` - Union Bank of India logo

### For NetBankingPanel.tsx:
- `sbi-logo.[format]` - State Bank of India logo (shared)
- `hdfc-logo.[format]` - HDFC Bank logo (shared)
- `icici-logo.[format]` - ICICI Bank logo (shared)
- `axis-logo.[format]` - Axis Bank logo (shared)
- `kotak-logo.[format]` - Kotak Mahindra Bank logo
- `federal-logo.[format]` - Federal Bank logo
- `iob-logo.[format]` - Indian Overseas Bank logo
- `indian-bank-logo.[format]` - Indian Bank logo

## Logo Requirements:

- **Supported Formats**: PNG, JPG, JPEG, SVG, WebP, GIF, BMP, TIFF
- **Size**: 24x24px to 64x64px (will be displayed as 32x32px in NetBankingPanel, 24x24px in MobilePaymentMethods)
- **Background**: Transparent or white recommended
- **Quality**: High resolution for crisp display

## URL Support:

### Local Files:
```
/bank-logos/sbi-logo.png
/bank-logos/hdfc-logo.jpg
/bank-logos/icici-logo.svg
```

### External URLs:
```
https://example.com/logo.png
https://cdn.example.com/images/bank-logo.jpg
https://assets.example.com/logo.svg
```

## Fallback Behavior:

If a logo file is not available or fails to load, the component will automatically display a styled abbreviation of the bank name in a colored background as a fallback.