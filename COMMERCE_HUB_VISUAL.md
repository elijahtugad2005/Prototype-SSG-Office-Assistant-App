# Commerce Hub - Visual Reference

## 🎨 Interface Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         TOP BAR                                 │
├─────────────────────────────────────────────────────────────────┤
│  COMMERCE MANAGEMENT                    🛍️ Representative Portal│
│  Commerce Hub                                                   │
│  Manage orders, products, and track commerce performance       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      TAB NAVIGATION                             │
├─────────────────────────────────────────────────────────────────┤
│  [📦 Order Management] [🛍️ Product Management] [📊 Analytics]   │
│  ═══════════════════                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TAB CONTENT                               │
│                                                                 │
│  (Order Management Component)                                   │
│  OR                                                             │
│  (Product Management Component)                                 │
│  OR                                                             │
│  (Analytics Placeholder)                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Order Management Tab View

```
┌─────────────────────────────────────────────────────────────────┐
│  📦 Order Management Tab                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Total   │  │ Pending  │  │   Paid   │  │ Ongoing  │      │
│  │  Orders  │  │  Orders  │  │  Orders  │  │  Orders  │      │
│  │   150    │  │    25    │  │    40    │  │    30    │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │Completed │  │Cancelled │  │ Revenue  │                    │
│  │  Orders  │  │  Orders  │  │          │                    │
│  │    50    │  │     5    │  │ ₱75,000  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  🔍 Search   [Status ▼]  [Payment ▼]                    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Order ID  │ Customer │ Product │ Status  │ Actions     │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ ORD-123   │ Juan     │ Lanyard │ Pending │ [Edit][Del] │  │
│  │ ORD-124   │ Maria    │ Uniform │ Paid    │ [Edit][Del] │  │
│  │ ORD-125   │ Pedro    │ Shirt   │ Ongoing │ [Edit][Del] │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Showing 1-10 of 150    [← Previous] [1/15] [Next →]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛍️ Product Management Tab View

```
┌─────────────────────────────────────────────────────────────────┐
│  🛍️ Product Management Tab                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [+ Add Product]                    🔍 Search products          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  [Image]     │  │  [Image]     │  │  [Image]     │        │
│  │              │  │              │  │              │        │
│  │  SSG Lanyard │  │ SSG Uniform  │  │  SSG Shirt   │        │
│  │              │  │              │  │              │        │
│  │  ₱75.00      │  │  ₱250.00     │  │  ₱150.00     │        │
│  │  50 in stock │  │  20 in stock │  │  30 in stock │        │
│  │              │  │              │  │              │        │
│  │ [Edit][Delete]│  │ [Edit][Delete]│  │ [Edit][Delete]│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  [Image]     │  │  [Image]     │  │  [Image]     │        │
│  │              │  │              │  │              │        │
│  │  SSG Cap     │  │  SSG Bag     │  │  SSG Pin     │        │
│  │              │  │              │  │              │        │
│  │  ₱100.00     │  │  ₱300.00     │  │  ₱50.00      │        │
│  │  15 in stock │  │  10 in stock │  │  100 in stock│        │
│  │              │  │              │  │              │        │
│  │ [Edit][Delete]│  │ [Edit][Delete]│  │ [Edit][Delete]│        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Analytics Tab View (Placeholder)

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Analytics Tab                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                         ┌─────────┐                            │
│                         │    📊   │                            │
│                         └─────────┘                            │
│                                                                 │
│                    Commerce Analytics                          │
│                                                                 │
│         Comprehensive analytics and reports for orders         │
│         and products will be available here.                   │
│                                                                 │
│         Track sales trends, popular products, revenue          │
│         insights, and more.                                    │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Tab States

### Active Tab
```
┌─────────────────────────────────┐
│  📦 Order Management [Orders]   │
│  ═══════════════════            │  ← Blue underline
└─────────────────────────────────┘
   ↑ Blue text
```

### Inactive Tab
```
┌─────────────────────────────────┐
│  🛍️ Product Management [Products]│
│                                 │  ← No underline
└─────────────────────────────────┘
   ↑ Gray text
```

---

## 🔄 Navigation Flow

```
                    START
                      │
                      ▼
            ┌─────────────────┐
            │  Login Screen   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Dashboard     │
            │   (Any Page)    │
            └────────┬────────┘
                     │
                     │ Click "Commerce Hub"
                     │ in Sidebar
                     ▼
            ┌─────────────────┐
            │  Commerce Hub   │
            │   Landing Page  │
            └────────┬────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Orders  │  │ Products │  │Analytics │
│   Tab    │  │   Tab    │  │   Tab    │
└──────────┘  └──────────┘  └──────────┘
```

---

## 📱 Responsive Views

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────────┐
│  COMMERCE MANAGEMENT      🛍️ Representative Portal  │
│  Commerce Hub                                       │
│  Manage orders, products, and track commerce        │
├─────────────────────────────────────────────────────┤
│  [📦 Orders] [🛍️ Products] [📊 Analytics]           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Full-width content area                           │
│  Three-column layouts                              │
│  Spacious padding                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tablet (≤ 768px)
```
┌─────────────────────────────────┐
│  COMMERCE MANAGEMENT            │
│  Commerce Hub                   │
│  Manage orders, products...     │
│  🛍️ Representative Portal       │
├─────────────────────────────────┤
│  [📦] [🛍️] [📊]                  │
├─────────────────────────────────┤
│                                 │
│  Stacked elements               │
│  Two-column layouts             │
│  Adjusted padding               │
│                                 │
└─────────────────────────────────┘
```

### Mobile (≤ 480px)
```
┌───────────────────┐
│  COMMERCE         │
│  Commerce Hub     │
│  🛍️ Representative │
├───────────────────┤
│  [📦][🛍️][📊]     │
├───────────────────┤
│                   │
│  Single column    │
│  Compact layout   │
│  Small padding    │
│                   │
└───────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│   Blue   │  │  Purple  │  │  Green   │
│ #3b82f6  │  │ #8b5cf6  │  │ #10b981  │
│ Primary  │  │  Accent  │  │ Success  │
└──────────┘  └──────────┘  └──────────┘
```

### Text Colors
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Primary  │  │Secondary │  │  Muted   │
│ #0f172a  │  │ #64748b  │  │ #94a3b8  │
│  Dark    │  │   Gray   │  │Light Gray│
└──────────┘  └──────────┘  └──────────┘
```

---

## 🔲 Component Hierarchy

```
CommerceHub
│
├── Top Bar
│   ├── Left Section
│   │   ├── Eyebrow ("COMMERCE MANAGEMENT")
│   │   ├── Title ("Commerce Hub")
│   │   └── Subtitle
│   └── Right Section
│       └── Badge ("Representative Portal")
│
├── Tab Navigation
│   ├── Order Management Tab Button
│   │   ├── Icon (📦)
│   │   ├── Label
│   │   └── Badge
│   ├── Product Management Tab Button
│   │   ├── Icon (🛍️)
│   │   ├── Label
│   │   └── Badge
│   └── Analytics Tab Button
│       ├── Icon (📊)
│       ├── Label
│       └── Badge
│
└── Tab Content Area
    ├── OrderManagement Component (if orders tab)
    ├── ProductManagement Component (if products tab)
    └── Analytics Placeholder (if analytics tab)
```

---

## 🎯 User Journey Map

```
Step 1: Access
┌─────────────┐
│ Sidebar     │
│ Click       │
│ Commerce Hub│
└──────┬──────┘
       │
       ▼
Step 2: Land
┌─────────────┐
│ Commerce Hub│
│ Page Loads  │
│ Orders Tab  │
└──────┬──────┘
       │
       ▼
Step 3: View
┌─────────────┐
│ See Orders  │
│ Dashboard   │
│ & Table     │
└──────┬──────┘
       │
       ▼
Step 4: Action
┌─────────────┐
│ Manage      │
│ Orders or   │
│ Switch Tab  │
└──────┬──────┘
       │
       ▼
Step 5: Complete
┌─────────────┐
│ Task Done   │
│ Stay or     │
│ Navigate    │
└─────────────┘
```

---

## 📊 Data Flow

```
User Action
    │
    ▼
Tab Click
    │
    ▼
State Update (setActiveTab)
    │
    ▼
Component Re-render
    │
    ▼
Conditional Rendering
    │
    ├─→ Orders Tab → OrderManagement Component
    │
    ├─→ Products Tab → ProductManagement Component
    │
    └─→ Analytics Tab → Placeholder Component
```

---

## 🎨 Badge Styles

### Representative Badge
```
┌──────────────────────────┐
│  🛍️ Representative Portal │
└──────────────────────────┘
   Purple background
   Purple border
   White text
```

### Tab Badges
```
Active:
┌─────────┐
│ Orders  │  ← White text on blue
└─────────┘

Inactive:
┌─────────┐
│ Orders  │  ← Blue text on light blue
└─────────┘
```

---

## 🔄 State Transitions

```
Initial State: activeTab = 'orders'
                    │
                    ▼
            ┌───────────────┐
            │ Orders Tab    │
            │ (Active)      │
            └───────┬───────┘
                    │
        User clicks Products Tab
                    │
                    ▼
            ┌───────────────┐
            │ Products Tab  │
            │ (Active)      │
            └───────┬───────┘
                    │
        User clicks Analytics Tab
                    │
                    ▼
            ┌───────────────┐
            │ Analytics Tab │
            │ (Active)      │
            └───────────────┘
```

---

## 📱 Touch Targets (Mobile)

```
Minimum Touch Target: 44x44px

Tab Buttons:
┌────────────────────┐
│                    │  ← 44px height
│  📦 Order Mgmt     │
│                    │
└────────────────────┘

Action Buttons:
┌──────────┐
│          │  ← 44px height
│   Edit   │
│          │
└──────────┘
```

---

This visual reference provides a clear understanding of the Commerce Hub interface layout, navigation flow, and responsive behavior across different devices.
