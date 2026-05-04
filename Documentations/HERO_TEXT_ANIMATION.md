# Hero Text Animation Feature

## Overview
Dynamic text animation in the hero section that cycles through three phrases with smooth fade transitions and different display durations.

---

## Feature Description

The hero section title now animates between three key messages:
1. **"SUPREMO GOBYERNO"** - Main title (10 seconds)
2. **"FOR THE SERVICE"** - Service message (5 seconds)
3. **"FOR THE STUDENTS"** - Student-focused message (5 seconds)

---

## Implementation Details

### State Management

```javascript
// Hero text animation state
const [heroTextIndex, setHeroTextIndex] = useState(0);
const [isHeroFading, setIsHeroFading] = useState(false);

const heroTexts = [
  { text: 'SUPREMO\nGOBYERNO', duration: 10000 }, // 10 seconds
  { text: 'FOR THE\nSERVICE', duration: 5000 },   // 5 seconds
  { text: 'FOR THE\nSTUDENTS', duration: 5000 }   // 5 seconds
];
```

### Animation Logic

```javascript
useEffect(() => {
  const currentText = heroTexts[heroTextIndex];
  
  // Start fade out 500ms before switching
  const fadeOutTimer = setTimeout(() => {
    setIsHeroFading(true);
  }, currentText.duration - 500);
  
  // Switch to next text
  const switchTimer = setTimeout(() => {
    setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    setIsHeroFading(false);
  }, currentText.duration);
  
  return () => {
    clearTimeout(fadeOutTimer);
    clearTimeout(switchTimer);
  };
}, [heroTextIndex]);
```

---

## Animation Timing

### Cycle Duration: 20 seconds total

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  SUPREMO GOBYERNO (10s)                                │
│  ████████████████████████████████████████████████████  │
│                                                         │
│  FOR THE SERVICE (5s)                                  │
│  ████████████████████████                              │
│                                                         │
│  FOR THE STUDENTS (5s)                                 │
│  ████████████████████████                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Transition Timing

```
Text Display:
├─ Fade In: 0.5s
├─ Display: (duration - 1s)
└─ Fade Out: 0.5s

Example for "SUPREMO GOBYERNO":
├─ 0.0s - 0.5s: Fade in
├─ 0.5s - 9.5s: Display (9 seconds)
└─ 9.5s - 10.0s: Fade out
```

---

## CSS Animations

### Fade In Animation

```css
.heroTitleFadeIn {
  animation: heroFadeIn 0.5s ease-in-out forwards;
}

@keyframes heroFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Effect**: Text slides up 20px while fading in

### Fade Out Animation

```css
.heroTitleFadeOut {
  animation: heroFadeOut 0.5s ease-in-out forwards;
}

@keyframes heroFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

**Effect**: Text slides up 20px while fading out

---

## JSX Implementation

```jsx
<h1 className={`${styles.heroTitle} ${isHeroFading ? styles.heroTitleFadeOut : styles.heroTitleFadeIn}`}>
  {heroTexts[heroTextIndex].text.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < heroTexts[heroTextIndex].text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ))}
</h1>
```

**Features**:
- Dynamic class switching based on fade state
- Automatic line break handling for multi-line text
- React.Fragment for clean rendering

---

## Visual Flow

### Animation Sequence

```
Frame 1 (0s - 0.5s): SUPREMO GOBYERNO fades in
┌─────────────────────────┐
│                         │
│   SUPREMO               │  ← Opacity: 0 → 1
│   GOBYERNO              │  ← Y: +20px → 0
│                         │
└─────────────────────────┘

Frame 2 (0.5s - 9.5s): SUPREMO GOBYERNO displayed
┌─────────────────────────┐
│                         │
│   SUPREMO               │  ← Fully visible
│   GOBYERNO              │  ← Static position
│                         │
└─────────────────────────┘

Frame 3 (9.5s - 10s): SUPREMO GOBYERNO fades out
┌─────────────────────────┐
│                         │
│   SUPREMO               │  ← Opacity: 1 → 0
│   GOBYERNO              │  ← Y: 0 → -20px
│                         │
└─────────────────────────┘

Frame 4 (10s - 10.5s): FOR THE SERVICE fades in
┌─────────────────────────┐
│                         │
│   FOR THE               │  ← Opacity: 0 → 1
│   SERVICE               │  ← Y: +20px → 0
│                         │
└─────────────────────────┘

... cycle continues ...
```

---

## Responsive Behavior

### Desktop (≥ 1024px)
- Font size: 9rem (clamp max)
- Full animation visible
- Smooth transitions

### Tablet (768px - 1023px)
- Font size: ~6rem (responsive)
- Animation maintains timing
- Text scales proportionally

### Mobile (< 768px)
- Font size: 3rem - 5rem (clamp)
- Animation timing unchanged
- Shorter text fits better

---

## Performance Considerations

### Optimizations
1. **CSS Animations**: GPU-accelerated transforms
2. **Timer Cleanup**: Prevents memory leaks
3. **Minimal Re-renders**: Only updates on text change
4. **Smooth Transitions**: 0.5s ease-in-out

### Browser Support
- Chrome 90+: ✅ Full support
- Firefox 88+: ✅ Full support
- Safari 14+: ✅ Full support
- Edge 90+: ✅ Full support

---

## Customization Options

### Changing Duration

```javascript
const heroTexts = [
  { text: 'SUPREMO\nGOBYERNO', duration: 15000 }, // 15 seconds
  { text: 'FOR THE\nSERVICE', duration: 7000 },   // 7 seconds
  { text: 'FOR THE\nSTUDENTS', duration: 7000 }   // 7 seconds
];
```

### Adding More Phrases

```javascript
const heroTexts = [
  { text: 'SUPREMO\nGOBYERNO', duration: 10000 },
  { text: 'FOR THE\nSERVICE', duration: 5000 },
  { text: 'FOR THE\nSTUDENTS', duration: 5000 },
  { text: 'UNITY &\nPROGRESS', duration: 5000 }, // New phrase
];
```

### Adjusting Animation Speed

```css
/* Faster transitions (0.3s) */
.heroTitleFadeIn {
  animation: heroFadeIn 0.3s ease-in-out forwards;
}

.heroTitleFadeOut {
  animation: heroFadeOut 0.3s ease-in-out forwards;
}

/* Update JavaScript timing */
const fadeOutTimer = setTimeout(() => {
  setIsHeroFading(true);
}, currentText.duration - 300); // Match CSS duration
```

### Changing Animation Direction

```css
/* Slide from right */
@keyframes heroFadeIn {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide to left */
@keyframes heroFadeOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50px);
  }
}
```

---

## Accessibility

### Screen Readers
- Text changes are announced automatically
- No ARIA live region needed (static content)
- Semantic HTML maintained

### Motion Sensitivity

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .heroTitleFadeIn,
  .heroTitleFadeOut {
    animation: none;
    transition: opacity 0.1s;
  }
  
  @keyframes heroFadeIn {
    0%, 100% { opacity: 1; transform: none; }
  }
  
  @keyframes heroFadeOut {
    0%, 100% { opacity: 0; transform: none; }
  }
}
```

---

## Testing Checklist

- [x] Text cycles through all three phrases
- [x] Timing is correct (10s, 5s, 5s)
- [x] Fade in animation smooth
- [x] Fade out animation smooth
- [x] No flicker between transitions
- [x] Line breaks render correctly
- [x] Responsive on all screen sizes
- [x] No memory leaks (timers cleaned up)
- [x] Build succeeds without errors
- [x] Animation loops infinitely

---

## Troubleshooting

### Issue: Text flickers during transition
**Solution**: Ensure fade out starts 500ms before text switch

### Issue: Animation doesn't loop
**Solution**: Check modulo operator in setHeroTextIndex

### Issue: Text doesn't break correctly
**Solution**: Verify `\n` in text strings and React.Fragment rendering

### Issue: Performance lag
**Solution**: Use CSS transforms (GPU-accelerated) instead of position changes

---

## Files Modified

### JavaScript
- `src/Homepage/Homepage.jsx`
  - Added `heroTextIndex` state
  - Added `isHeroFading` state
  - Added `heroTexts` array
  - Added animation useEffect

### CSS
- `src/Homepage/Homepage.module.css`
  - Added `.heroTitleFadeIn` class
  - Added `.heroTitleFadeOut` class
  - Added `@keyframes heroFadeIn`
  - Added `@keyframes heroFadeOut`
  - Updated `.heroTitle` with transition properties
  - Removed empty `.heroContent` ruleset

---

## Future Enhancements

### Potential Improvements
1. **Pause on Hover**: Stop animation when user hovers
2. **Manual Controls**: Add prev/next buttons
3. **Progress Indicator**: Show which phrase is active
4. **Custom Easing**: More sophisticated animation curves
5. **Stagger Effect**: Animate words individually
6. **3D Transforms**: Add depth with perspective
7. **Color Transitions**: Change text color per phrase

### Example: Pause on Hover

```javascript
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  if (isPaused) return; // Skip animation when paused
  
  // ... existing animation logic
}, [heroTextIndex, isPaused]);

// In JSX
<h1 
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
  className={...}
>
```

---

## Summary

The hero text animation creates a dynamic, engaging experience that highlights the three core messages of the SSG platform. With smooth fade transitions, appropriate timing, and responsive design, it enhances the visual appeal while maintaining accessibility and performance.

**Key Features**:
- ✅ Three rotating phrases with custom durations
- ✅ Smooth fade in/out transitions (0.5s)
- ✅ 10-second display for main title
- ✅ 5-second display for secondary messages
- ✅ Infinite loop with seamless transitions
- ✅ GPU-accelerated animations
- ✅ Responsive across all devices
- ✅ Clean timer management (no memory leaks)

The animation runs continuously, creating a professional, modern hero section that captures attention and communicates the platform's mission effectively.
