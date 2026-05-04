# Commerce Hub - Visual Guide

## Table Layout Visualization

### Full Table Structure (1400px width)

```
┌──────────┬──────────┬──────────┬────┬──────┬────────┬─────────┬──────────┬────────────────────────────────┐
│ Order ID │ Customer │ Product  │ Qty│ Total│ Status │ Payment │   Date   │          Actions               │
│ (130px)  │ (180px)  │ (200px)  │(80)│(100) │ (100)  │  (90)   │  (150)   │          (370px)               │
├──────────┼──────────┼──────────┼────┼──────┼────────┼─────────┼──────────┼────────────────────────────────┤
│ ORD-DB-  │ John Doe │ SSG Polo │ 2  │₱1200 │Pending │  Cash   │ May 4,   │ [Status ▼] [✎ Edit] [🗑 Delete]│
│   0001   │john@...  │ Size: L  │    │      │        │         │  2026    │  (110px)   (90px)    (100px)   │
├──────────┼──────────┼──────────┼────┼──────┼────────┼─────────┼──────────┼────────────────────────────────┤
│ ORD-DB-  │ Jane Doe │ SSG Shirt│ 1  │ ₱600 │  Paid  │ Online  │ May 3,   │ [Status ▼] [✎ Edit] [🗑 Delete]│
│   0002   │jane@...  │ Size: M  │    │      │        │         │  2026    │                                │
└──────────┴──────────┴──────────┴────┴──────┴────────┴─────────┴──────────┴────────────────────────────────┘
                                                                                                        ▲
                                                                                    Custom scrollbar (8px)
```

---

## Actions Column Breakdown

### Component Layout (370px total)

```
┌─────────────────────────────────────────────────────────────┐
│                     Actions Column                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Status ▼   │  │  ✎  Edit     │  │  🗑  Delete   │     │
│  │   (110px)    │  │   (90px)     │  │   (100px)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│       ↑                  ↑                   ↑              │
│   Dropdown           Edit Modal         Confirmation       │
│                                                             │
│  Gap: 8px (0.5rem) between each component                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Status Dropdown States

### Default State
```
┌──────────────┐
│  Pending  ▼  │  ← White background
└──────────────┘     Gray border
```

### Hover State
```
┌──────────────┐
│  Pending  ▼  │  ← Blue border
└──────────────┘     Blue shadow ring
     ↑
  Cursor: pointer
```

### Open State
```
┌──────────────┐
│  Pending  ▲  │
├──────────────┤
│ ✓ Pending    │  ← Current selection
│   Paid       │
│   Ongoing    │
│   Completed  │
│   Cancelled  │
└──────────────┘
```

---

## Button States

### Edit Button

#### Default
```
┌──────────────┐
│  ✎  Edit     │  ← Light blue background
└──────────────┘     Blue text
```

#### Hover
```
┌──────────────┐
│  ✎  Edit     │  ← Solid blue background
└──────────────┘     White text
     ↑                Lifts 1px up
  Shadow glow         Shadow appears
```

### Delete Button

#### Default
```
┌──────────────┐
│  🗑  Delete   │  ← Light red background
└──────────────┘     Red text
```

#### Hover
```
┌──────────────┐
│  🗑  Delete   │  ← Solid red background
└──────────────┘     White text
     ↑                Lifts 1px up
  Shadow glow         Shadow appears
```

---

## Scroll Indicator

### Top Banner (< 1440px screens)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│          ← Scroll to see all columns →                      │  ← Scroll hint
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Order ID │ Customer │ Product │ ... │ Actions              │
│ ORD-DB-  │ John Doe │ Polo    │ ... │ [▼] [✎] [🗑]        │
└─────────────────────────────────────────────────────────────┘
```

### Hidden on Large Screens (≥ 1440px)

```
┌─────────────────────────────────────────────────────────────┐
│ Order ID │ Customer │ Product │ Qty │ Total │ ... │ Actions│  ← No hint
│ ORD-DB-  │ John Doe │ Polo    │  2  │ ₱1200 │ ... │ [▼][✎]│
└─────────────────────────────────────────────────────────────┘
```

---

## Custom Scrollbar

### Horizontal Scrollbar (8px height)

```
Table Content
─────────────────────────────────────────────────────────────
                                                              
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
▲                                                            ▲
Track (light gray)                                  Thumb (darker)
```

### Hover State
```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
████████████████████████████████████████████████████████████
▲
Thumb becomes darker on hover
```

---

## Responsive Layouts

### Desktop (≥ 1440px)
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Commerce Hub                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ [📦 Order Management] [🛍️ Product Management] [📊 Analytics]           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  All 9 columns visible without scrolling                               │
│  ┌──────┬──────┬──────┬───┬─────┬──────┬──────┬──────┬──────────────┐ │
│  │Order │Cust. │Prod. │Qty│Total│Status│Pay.  │Date  │Actions       │ │
│  └──────┴──────┴──────┴───┴─────┴──────┴──────┴──────┴──────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Laptop (1024px - 1439px)
```
┌───────────────────────────────────────────────────────────┐
│ Commerce Hub                                              │
├───────────────────────────────────────────────────────────┤
│ [📦 Orders] [🛍️ Products] [📊 Analytics]                 │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ← Scroll to see all columns →                           │  ← Hint visible
│  ┌──────┬──────┬──────┬───┬─────┬──────┬──────┬────     │
│  │Order │Cust. │Prod. │Qty│Total│Status│Pay.  │Dat...   │
│  └──────┴──────┴──────┴───┴─────┴──────┴──────┴────     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Scrollbar
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────┐
│ Commerce Hub                    │
├─────────────────────────────────┤
│ [📦] [🛍️] [📊]                  │
├─────────────────────────────────┤
│                                 │
│  Card Layout (Stacked)          │
│  ┌───────────────────────────┐  │
│  │ ORD-DB-0001               │  │
│  │ John Doe (john@email.com) │  │
│  │ SSG Polo - Size: L        │  │
│  │ Qty: 2 | Total: ₱1200     │  │
│  │ Status: Pending           │  │
│  │ Payment: Cash             │  │
│  │ Date: May 4, 2026         │  │
│  │                           │  │
│  │ [Status ▼]                │  │
│  │ [✎ Edit]                  │  │
│  │ [🗑 Delete]                │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ORD-DB-0002               │  │
│  │ ...                       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────┐
│ Commerce Hub        │
├─────────────────────┤
│ [📦 Orders]         │
│ [🛍️ Products]       │
│ [📊 Analytics]      │
├─────────────────────┤
│                     │
│  Full Card Layout   │
│  ┌───────────────┐  │
│  │ ORD-DB-0001   │  │
│  │               │  │
│  │ John Doe      │  │
│  │ john@email... │  │
│  │               │  │
│  │ SSG Polo      │  │
│  │ Size: L       │  │
│  │               │  │
│  │ Qty: 2        │  │
│  │ Total: ₱1200  │  │
│  │               │  │
│  │ Status:       │  │
│  │ Pending       │  │
│  │               │  │
│  │ Payment: Cash │  │
│  │               │  │
│  │ Date:         │  │
│  │ May 4, 2026   │  │
│  │               │  │
│  │ ┌───────────┐ │  │
│  │ │ Status ▼  │ │  │
│  │ └───────────┘ │  │
│  │ ┌───────────┐ │  │
│  │ │ ✎ Edit    │ │  │
│  │ └───────────┘ │  │
│  │ ┌───────────┐ │  │
│  │ │ 🗑 Delete  │ │  │
│  │ └───────────┘ │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

---

## Color Coding

### Status Badges

```
┌──────────┐
│ Pending  │  ← Yellow background (#fff3cd)
└──────────┘     Brown text (#856404)

┌──────────┐
│   Paid   │  ← Green background (#d1e7dd)
└──────────┘     Dark green text (#0f5132)

┌──────────┐
│ Ongoing  │  ← Blue background (#cfe2ff)
└──────────┘     Dark blue text (#084298)

┌──────────┐
│Completed │  ← Green background (#d1e7dd)
└──────────┘     Dark green text (#0f5132)

┌──────────┐
│Cancelled │  ← Red background (#f8d7da)
└──────────┘     Dark red text (#842029)
```

### Payment Badges

```
┌──────────┐
│   Cash   │  ← Light blue background
└──────────┘     Blue text

┌──────────┐
│  Online  │  ← Light blue background
└──────────┘     Blue text
```

---

## Interaction Flow

### Status Change Flow

```
1. Initial State
   ┌──────────────┐
   │  Pending  ▼  │
   └──────────────┘

2. Click Dropdown
   ┌──────────────┐
   │  Pending  ▲  │
   ├──────────────┤
   │ ✓ Pending    │
   │   Paid       │  ← Hover: Light blue bg
   │   Ongoing    │
   │   Completed  │
   │   Cancelled  │
   └──────────────┘

3. Select "Paid"
   ┌─────────────────────────────────────┐
   │ Change order ORD-DB-0001 status to  │
   │ "Paid"?                             │
   │                                     │
   │        [Cancel]  [OK]               │
   └─────────────────────────────────────┘

4. Confirm
   ┌─────────────────────────────────────┐
   │ ✅ Order status updated to: Paid    │
   └─────────────────────────────────────┘

5. Updated State
   ┌──────────────┐
   │   Paid    ▼  │  ← Green badge
   └──────────────┘
```

### Edit Order Flow

```
1. Click Edit Button
   ┌──────────────┐
   │  ✎  Edit     │  ← Hover: Blue bg
   └──────────────┘

2. Modal Opens
   ┌─────────────────────────────────────────┐
   │ Edit Order                         [×]  │
   ├─────────────────────────────────────────┤
   │                                         │
   │ Customer Information                    │
   │ ┌─────────────────────────────────────┐ │
   │ │ Full Name: John Doe                 │ │
   │ └─────────────────────────────────────┘ │
   │ ┌─────────────────────────────────────┐ │
   │ │ Email: john@email.com               │ │
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ Product Selection                       │
   │ ┌─────────────────────────────────────┐ │
   │ │ Product: SSG Polo                   │ │
   │ └─────────────────────────────────────┘ │
   │                                         │
   │ [Cancel]              [Update Order]   │
   └─────────────────────────────────────────┘

3. Update & Close
   ┌─────────────────────────────────────┐
   │ ✅ Order updated successfully!      │
   └─────────────────────────────────────┘
```

### Delete Order Flow

```
1. Click Delete Button
   ┌──────────────┐
   │  🗑  Delete   │  ← Hover: Red bg
   └──────────────┘

2. Confirmation Dialog
   ┌─────────────────────────────────────┐
   │ Are you sure you want to delete     │
   │ order ORD-DB-0001?                  │
   │                                     │
   │ This action cannot be undone.       │
   │                                     │
   │        [Cancel]  [OK]               │
   └─────────────────────────────────────┘

3. Confirm Deletion
   ┌─────────────────────────────────────┐
   │ 🗑️ Order deleted successfully!      │
   └─────────────────────────────────────┘

4. Row Removed
   (Order disappears from table)
```

---

## Animation Timings

### Button Hover Animation

```
Frame 1 (0ms)
┌──────────────┐
│  ✎  Edit     │  ← Light blue bg
└──────────────┘     Y position: 0

Frame 2 (75ms)
┌──────────────┐
│  ✎  Edit     │  ← Transitioning
└──────────────┘     Y position: -0.5px

Frame 3 (150ms)
┌──────────────┐
│  ✎  Edit     │  ← Solid blue bg
└──────────────┘     Y position: -1px
     ↑                Shadow appears
  Fully lifted
```

### Status Dropdown Animation

```
Frame 1 (0ms)
┌──────────────┐
│  Pending  ▼  │  ← Gray border
└──────────────┘

Frame 2 (75ms)
┌──────────────┐
│  Pending  ▼  │  ← Border transitioning
└──────────────┘     Shadow starting

Frame 3 (150ms)
┌──────────────┐
│  Pending  ▼  │  ← Blue border
└──────────────┘     Blue shadow ring
```

---

## Spacing Diagram

### Table Cell Padding

```
┌─────────────────────────────┐
│ ↕ 0.85rem                   │
│ ← 1rem → Content ← 1rem →  │
│ ↕ 0.85rem                   │
└─────────────────────────────┘
```

### Actions Column Gap

```
┌──────────┐ ← 0.5rem → ┌──────────┐ ← 0.5rem → ┌──────────┐
│ Status ▼ │            │ ✎ Edit   │            │ 🗑 Delete │
└──────────┘            └──────────┘            └──────────┘
```

### Button Padding

```
┌─────────────────────┐
│ ↕ 0.4rem            │
│ ← 0.7rem → ✎ Edit ← │
│ ↕ 0.4rem            │
└─────────────────────┘
```

---

## Summary

This visual guide demonstrates the complete layout and interaction patterns of the Commerce Hub Order Management table. All components are designed to work together seamlessly, providing a professional, user-friendly interface for managing orders.

**Key Visual Elements**:
- ✅ 1400px table width with fixed layout
- ✅ 370px Actions column with 3 components
- ✅ Custom 8px scrollbar with hover effects
- ✅ Prominent scroll indicator at top
- ✅ Color-coded status badges
- ✅ Smooth hover animations (150ms)
- ✅ Responsive layouts for all screen sizes
- ✅ Clear interaction flows with confirmations

The design follows modern e-commerce standards and provides excellent usability across all devices.
