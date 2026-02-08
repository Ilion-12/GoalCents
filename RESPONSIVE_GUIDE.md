# Responsive Design Guide

## Overview
The GoalCents app now uses **react-responsive** for dynamic responsive behavior across all devices.

## Installation
```bash
npm install react-responsive
```

## Breakpoints
The app uses consistent breakpoints across all pages:

- **Mobile**: ≤ 768px
- **Tablet**: 769px - 1024px
- **Desktop**: ≥ 1025px

## Usage

### Option 1: Custom Hook (Recommended)
Use the custom `useResponsive` hook for consistent breakpoints:

```tsx
import { useResponsive } from '../hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
};
```

### Option 2: Direct Import
Import `useMediaQuery` directly for custom breakpoints:

```tsx
import { useMediaQuery } from 'react-responsive';

const MyComponent = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isPortrait = useMediaQuery({ orientation: 'portrait' });

  return (
    <div style={isMobile ? { padding: '16px' } : { padding: '24px' }}>
      Content
    </div>
  );
};
```

## Updated Pages

### ✅ VisualAnalyticsPage
- Fewer tabs on mobile (3 instead of 6)
- Responsive tab button sizing
- Grid layout for chart legend on mobile

### ✅ LandingPage
- Single column features on mobile
- 2-column grid on tablet
- Responsive icon sizing

### ✅ HomeDashboard
- Stacked time cards on mobile
- Responsive greeting font size
- Full-width action buttons on mobile

### ✅ AddExpensePage
- Adjusted amount input size for mobile
- Responsive padding

### ✅ SpendingPage
- Stacked summary boxes on mobile
- Smaller chart on mobile screens

## CSS Media Queries
Complementary CSS media queries are added to:
- `visualAnalyticsPage.css`
- `homeDashboard.css`
- `landingPage.css`
- `spendingPage.css`

These provide fallback styles and enhance the JavaScript-based responsive behavior.

## Best Practices

### 1. Use Inline Styles for Dynamic Changes
```tsx
<div style={isMobile ? { fontSize: '14px' } : { fontSize: '16px' }}>
  Text
</div>
```

### 2. Conditional Rendering
```tsx
{isMobile ? (
  <MobileNavigation />
) : (
  <DesktopNavigation />
)}
```

### 3. Adjust Icon Sizes
```tsx
<iconify-icon 
  icon="lucide:home" 
  width={isMobile ? "20" : "24"}
/>
```

### 4. Layout Changes
```tsx
<div className="grid" style={
  isMobile 
    ? { gridTemplateColumns: '1fr' } 
    : { gridTemplateColumns: '1fr 1fr' }
}>
  {/* Content */}
</div>
```

## Testing Responsive Behavior

### In Browser
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select different devices or custom dimensions

### In Code
```tsx
const { isMobile } = useResponsive();
console.log('Is Mobile:', isMobile); // Debug responsive state
```

## Next Steps

To add responsive behavior to other pages:

1. Import the hook:
```tsx
import { useResponsive } from '../hooks/useResponsive';
```

2. Use in component:
```tsx
const { isMobile, isTablet } = useResponsive();
```

3. Apply conditional styling:
```tsx
<div style={isMobile ? mobileStyles : desktopStyles}>
  Content
</div>
```

## Common Patterns

### Stack on Mobile, Row on Desktop
```tsx
<div style={{ 
  display: 'flex', 
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? '12px' : '24px'
}}>
  <Card />
  <Card />
</div>
```

### Hide on Mobile
```tsx
{!isMobile && <DesktopOnlyFeature />}
```

### Different Content
```tsx
{isMobile ? (
  <CompactView data={data} />
) : (
  <DetailedView data={data} />
)}
```

## Resources
- [react-responsive Documentation](https://github.com/yocontra/react-responsive)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
