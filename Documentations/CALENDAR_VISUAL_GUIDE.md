# Calendar Widget Visual Guide

## Color Palette Reference

### Event Type Color Schemes

This guide shows the exact colors and gradients used for each event type in the Calendar Widget.

---

## 1. CLASS Events (Blue Theme)

**Use Case**: Regular classes, lectures, lab sessions

**Colors**:
- Border: `#2196f3` (Material Blue)
- Gradient: `linear-gradient(135deg, #0A1A2D 0%, #1A2A3D 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Deep navy blue gradient background
- Bright blue top border (4px)
- Orange day number (1.5rem)
- Professional, academic feel

---

## 2. EXAM Events (Red Theme)

**Use Case**: Exams, quizzes, assessments, deadlines

**Colors**:
- Border: `#f44336` (Material Red)
- Gradient: `linear-gradient(135deg, #2D0A0A 0%, #3D1A1A 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Dark burgundy/red gradient background
- Bright red top border (4px)
- Orange day number (1.5rem)
- Urgent, attention-grabbing feel

---

## 3. EVENT Events (Purple Theme)

**Use Case**: Special events, ceremonies, celebrations

**Colors**:
- Border: `#9c27b0` (Material Purple)
- Gradient: `linear-gradient(135deg, #1A0A2D 0%, #2A1A3D 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Deep purple gradient background
- Bright purple top border (4px)
- Orange day number (1.5rem)
- Elegant, special occasion feel

---

## 4. HOLIDAY Events (Green Theme)

**Use Case**: Holidays, breaks, no-class days

**Colors**:
- Border: `#4caf50` (Material Green)
- Gradient: `linear-gradient(135deg, #0A2D0A 0%, #1A3D1A 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Dark forest green gradient background
- Bright green top border (4px)
- Orange day number (1.5rem)
- Relaxed, restful feel

---

## 5. MEETING Events (Orange Theme)

**Use Case**: Meetings, conferences, appointments

**Colors**:
- Border: `#ff9800` (Material Orange)
- Gradient: `linear-gradient(135deg, #2D1A0A 0%, #3D2A1A 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Dark brown/orange gradient background
- Bright orange top border (4px)
- Orange day number (1.5rem)
- Professional, collaborative feel

---

## 6. MULTIPLE Event Types (Default Burgundy)

**Use Case**: Days with multiple different event types

**Colors**:
- Border: `#D94F1F` (Burnt Orange)
- Gradient: `linear-gradient(135deg, #2D0A0A 0%, #3D0F0F 100%)`
- Day Number: `#D94F1F` (Orange)

**Visual Description**:
- Dark burgundy gradient background (default theme color)
- Orange top border (4px)
- Orange day number (1.5rem)
- Neutral, versatile feel

---

## Base Calendar Colors

### Default Day (No Events)
- Background: `#1A1A1A` (Charcoal)
- Border: `#404040` (Medium Gray)
- Day Number: `#FFFFFF` (White, 1.25rem)

### Today Indicator
- Background: `rgba(217, 79, 31, 0.1)` (Orange tint)
- Border: `#D94F1F` (Orange, 2px)
- Top Border: `#D94F1F` (Orange, 3px)

### Empty Day (Before Month Starts)
- Background: `transparent`
- No border

---

## Typography

### Fonts Used
```css
--font-display: 'Playfair Display', Georgia, serif;
--font-body:    'Source Serif 4', Georgia, serif;
--font-accent:  'Montserrat', sans-serif;
```

### Font Sizes
- **Calendar Title**: 1.75rem (Playfair Display, Bold)
- **Day Names**: 0.75rem (Montserrat, Bold, Uppercase)
- **Day Number (Default)**: 1.25rem (Playfair Display, Bold)
- **Day Number (Event)**: 1.5rem (Playfair Display, Bold, Orange)
- **Event Text**: 0.7rem (Montserrat, Bold, Uppercase)

---

## Hover Effects

### Default Day Hover
```css
border-color: #D94F1F (Orange)
transform: translateY(-3px)
box-shadow: 0 4px 12px rgba(217, 79, 31, 0.3)
```

### Event Day Hover
```css
transform: translateY(-5px) scale(1.02)
box-shadow: 0 6px 16px rgba(217, 79, 31, 0.4)
background: Brighter gradient (10% lighter)
border-color: #E66B3D (Orange Hover)
```

---

## Layout Specifications

### Calendar Grid
- **Grid**: 7 columns (Sun-Sat)
- **Gap**: 0.75rem
- **Day Card Min Height**: 100px (desktop), 70px (mobile)

### Day Card Structure
```
┌─────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Top border (4px, event color)
│                         │
│  15  ← Day number       │
│                         │
│  ▪ Event Name 1         │ ← Event items
│  ▪ Event Name 2         │
│  +2 more                │ ← More indicator
│                         │
└─────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (>1024px)
- Day card: 100px min-height
- Day number: 1.25rem (default), 1.5rem (events)
- Full event text visible

### Tablet (768-1024px)
- Day card: 90px min-height
- Day number: 1.15rem (default), 1.35rem (events)
- Full event text visible

### Mobile (480-768px)
- Day card: 70px min-height
- Day number: 1rem (default), 1.15rem (events)
- Abbreviated event text

### Small Mobile (<480px)
- Day card: 60px min-height
- Day number: 0.9rem (default), 1rem (events)
- Event dots only (no text)

---

## Accessibility

### Color Contrast Ratios
All text meets WCAG AA standards:
- White text on dark backgrounds: >7:1
- Orange text on dark backgrounds: >4.5:1
- Gray text on dark backgrounds: >4.5:1

### Focus Indicators
- Orange outline (2px) on keyboard focus
- Visible on all interactive elements

---

## Animation Timing

### Transitions
```css
transition: all 0.3s ease;
```

### Transform Animations
- **Hover**: 0.3s ease
- **Scale**: 0.3s ease
- **Shadow**: 0.3s ease

---

## Usage Examples

### Single Event Type Day
```jsx
// Day 15 has only "Midterm Exam" (Exam type)
<div className={`${styles.calendarDay} ${styles.hasEventsExam}`}>
  <div className={styles.calendarDayNumber}>15</div>
  <div className={styles.calendarDayEvents}>
    <div className={styles.calendarEventDot}>Midterm...</div>
  </div>
</div>
```
**Result**: Red gradient background, red top border

### Multiple Event Types Day
```jsx
// Day 20 has "Class" and "Meeting"
<div className={`${styles.calendarDay} ${styles.hasEvents}`}>
  <div className={styles.calendarDayNumber}>20</div>
  <div className={styles.calendarDayEvents}>
    <div className={styles.calendarEventDot}>Physics...</div>
    <div className={styles.calendarEventDot}>Team Me...</div>
  </div>
</div>
```
**Result**: Default burgundy gradient, orange top border

---

## Design Inspiration

The calendar design draws inspiration from:
- **Vanity Fair**: Editorial typography, sophisticated color palette
- **The New Yorker**: Clean layout, serif fonts, cultural refinement
- **Modern Editorial Design**: Sharp corners, gradient backgrounds, bold accents

---

## Quick Reference Table

| Event Type | Border Color | Gradient Start | Gradient End | Use Case |
|------------|--------------|----------------|--------------|----------|
| Class      | #2196f3      | #0A1A2D        | #1A2A3D      | Regular classes |
| Exam       | #f44336      | #2D0A0A        | #3D1A1A      | Tests, deadlines |
| Event      | #9c27b0      | #1A0A2D        | #2A1A3D      | Special events |
| Holiday    | #4caf50      | #0A2D0A        | #1A3D1A      | Breaks, holidays |
| Meeting    | #ff9800      | #2D1A0A        | #3D2A1A      | Meetings, appointments |
| Multiple   | #D94F1F      | #2D0A0A        | #3D0F0F      | Mixed event types |

---

## Implementation Notes

1. **Event Type Detection**: Automatically detects event types and applies appropriate class
2. **Gradient Direction**: All gradients flow 135deg (diagonal top-left to bottom-right)
3. **Border Hierarchy**: Top border (4px) > Side borders (1px)
4. **Color Consistency**: Orange (#D94F1F) used for all day numbers on event days
5. **Hover Enhancement**: Event days have stronger hover effects than default days

---

## Conclusion

The Calendar Widget uses a sophisticated color system that provides immediate visual feedback about event types while maintaining the editorial dark mode aesthetic. Each color choice is intentional, creating a hierarchy that guides the user's attention to important dates and events.
