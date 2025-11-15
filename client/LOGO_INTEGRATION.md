# Fixora Logo Integration Guide

## Logo Files Created

All logo files have been created and placed in `public/assets/logo/`:

1. **logo-icon.svg** - Icon only version (40x40px)
2. **logo-full.svg** - Full logo with wordmark (Light version, 140x40px)
3. **logo-full-dark.svg** - Full logo with wordmark (Dark version, 140x40px)
4. **favicon.svg** - Favicon for browser tab (32x32px)

## Logo Design

The Fixora logo features:
- **Bold 'F' letter** inside a rounded square shape
- **Electric bolt motif** (subtle, 30% opacity) - represents electrician services
- **Cooling wave element** (subtle, 30% opacity) - represents AC services
- **Color palette**: Blue (#2563EB) + White + Gray
- **Style**: Clean, professional, modern minimal

## Integration Details

### Navbar Component
- **Mobile (< 768px)**: Shows icon-only logo
- **Desktop (≥ 768px)**: Shows full logo with wordmark
- **Hover effects**: Scale animation (1.05x on hover, 0.95x on tap)
- **Opacity transition**: 80-90% on hover for visual feedback
- **Alt text**: "Fixora - Smart Solutions for Your Home"

### Responsive Behavior
```tsx
// Mobile: Icon only
<div className="md:hidden">
  <Image src={LogoIcon} width={40} height={40} />
</div>

// Desktop: Full logo
<div className="hidden md:flex">
  <Image src={LogoFull} width={140} height={40} />
</div>
```

### CSS/Tailwind Classes Used
- `w-10 h-10` - Icon size (40x40px)
- `h-8 w-auto` - Full logo height (32px, auto width)
- `transition-opacity` - Smooth opacity transitions
- `group-hover:opacity-80` - Hover state opacity
- `md:hidden` / `hidden md:flex` - Responsive visibility

## TODO: Replace with Final Files

**Location**: All logo files in `public/assets/logo/` and `public/favicon.svg`

**Action Required**:
1. Replace SVG files with final designs from your designer
2. Ensure file names remain the same:
   - `logo-icon.svg`
   - `logo-full.svg`
   - `logo-full-dark.svg`
   - `favicon.svg`
3. Generate `.ico` file for `public/favicon.ico` (use online converter)
4. Optionally create PNG exports for use cases requiring raster images

## Logo Usage

The logo is integrated in:
- ✅ Navbar (responsive)
- ✅ Browser favicon
- ✅ Site metadata (title, description)

## Logo Component

A reusable `Logo` component is available at `src/components/Logo.tsx` for use throughout the site:

```tsx
import Logo from '@/components/Logo';

// Usage examples:
<Logo variant="icon" size="md" />
<Logo variant="full" size="lg" />
<Logo variant="full-dark" size="md" />
```

## Color Reference

- **Primary Blue**: `#2563EB` (Tailwind: `primary-600`)
- **Text Gray**: `#1F2937` (Tailwind: `gray-800`)
- **White**: `#FFFFFF`
- **Background**: White/Gray palette

## Notes

- All logos are SVG format for scalability
- Logos are optimized for web use
- Hover states provide visual feedback
- Accessible with proper alt text
- SEO-friendly with descriptive metadata

