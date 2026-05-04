# Track Order Feature - Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Homepage   │  │  Order Page  │  │   Sidebar    │         │
│  │              │  │              │  │              │         │
│  │ Quick Access │  │   Success    │  │ Track Order  │         │
│  │    Card      │  │   Screen     │  │     Link     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                    │
│                           ▼                                    │
│              ┌────────────────────────┐                        │
│              │   Track Order Page     │                        │
│              │  /track-order          │                        │
│              └────────────┬───────────┘                        │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TRACK ORDER COMPONENT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Search Section                        │  │
│  │  ┌────────────┐  ┌────────────┐                         │  │
│  │  │  Order ID  │  │   Email    │  Toggle Tabs           │  │
│  │  └────────────┘  └────────────┘                         │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Search Input                                    │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  [Track Order Button]                            │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
│                           │ Search Query                       │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Firebase Query                          │  │
│  │  - Query by orderId OR                                   │  │
│  │  - Query by customerInfo.email                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                    │
│                           │ Order Data                         │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Results Section                         │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           Status Card                              │  │  │
│  │  │  - Status Icon & Label                             │  │  │
│  │  │  - Progress Bar                                    │  │  │
│  │  │  - Timeline                                        │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │  │
│  │  │  Order   │  │ Customer │  │ Payment  │             │  │
│  │  │ Details  │  │   Info   │  │   Info   │             │  │
│  │  └──────────┘  └──────────┘  └──────────┘             │  │
│  │                                                          │  │
│  │  ┌────────────────────┐  ┌────────────────────┐        │  │
│  │  │ Track Another Order│  │   Back to Home     │        │  │
│  │  └────────────────────┘  └────────────────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE FIRESTORE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Collection: orders                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Document 1                                              │  │
│  │  {                                                       │  │
│  │    orderId: "ORD-1234567890-123",                       │  │
│  │    orderStatus: "Pending",                              │  │
│  │    customerInfo: {                                      │  │
│  │      fullName: "...",                                   │  │
│  │      email: "...",                                      │  │
│  │      ...                                                │  │
│  │    },                                                   │  │
│  │    productInfo: { ... },                               │  │
│  │    paymentInfo: { ... },                               │  │
│  │    dateOrdered: Timestamp                              │  │
│  │  }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌──────────────┐
│     USER     │
└──────┬───────┘
       │
       │ 1. Clicks "Track Order"
       ▼
┌──────────────────────┐
│  Navigation Router   │
└──────┬───────────────┘
       │
       │ 2. Routes to /track-order
       ▼
┌──────────────────────┐
│  TrackOrder.jsx      │
│  Component Mounts    │
└──────┬───────────────┘
       │
       │ 3. Renders Search Form
       ▼
┌──────────────────────┐
│  User Enters Query   │
│  (Order ID or Email) │
└──────┬───────────────┘
       │
       │ 4. Clicks "Track Order"
       ▼
┌──────────────────────┐
│  handleSearch()      │
│  - Validates input   │
│  - Sets loading      │
└──────┬───────────────┘
       │
       │ 5. Firebase Query
       ▼
┌──────────────────────┐
│  Firebase Firestore  │
│  - Query orders      │
│  - Filter by ID/email│
└──────┬───────────────┘
       │
       │ 6. Returns data
       ▼
┌──────────────────────┐
│  Process Results     │
│  - Sort by date      │
│  - Get most recent   │
└──────┬───────────────┘
       │
       │ 7. Update state
       ▼
┌──────────────────────┐
│  setOrder(data)      │
│  setLoading(false)   │
└──────┬───────────────┘
       │
       │ 8. Re-render
       ▼
┌──────────────────────┐
│  Display Results     │
│  - Status card       │
│  - Info cards        │
│  - Timeline          │
└──────────────────────┘
```

---

## 🎯 Component Structure

```
TrackOrder Component
│
├── State Management
│   ├── searchQuery (string)
│   ├── searchType (orderId | email)
│   ├── order (object | null)
│   ├── loading (boolean)
│   ├── error (string)
│   └── searched (boolean)
│
├── Effects
│   └── useEffect (auto-search from navigation state)
│
├── Functions
│   ├── handleSearch()
│   ├── formatDate()
│   ├── getStatusInfo()
│   └── getProgressPercentage()
│
└── Render Methods
    ├── renderSearchForm()
    ├── renderNoResults()
    └── renderOrderDetails()
        ├── Status Card
        │   ├── Status Header
        │   ├── Progress Bar
        │   └── Timeline
        └── Info Grid
            ├── Order Details Card
            ├── Customer Info Card
            └── Payment Info Card
```

---

## 🗂️ File Structure

```
src/
├── components/
│   ├── TrackOrder/
│   │   ├── TrackOrder.jsx          ← Main component
│   │   └── TrackOrder.module.css   ← Scoped styles
│   │
│   ├── Order/
│   │   ├── order.jsx               ← Modified (added track button)
│   │   └── Order.module.css        ← Modified (added button styles)
│   │
│   └── Sidebar/
│       ├── Sidebar.jsx             ← Modified (added track link)
│       └── Sidebar.module.css      ← No changes
│
├── Homepage/
│   ├── Homepage.jsx                ← Modified (added quick access)
│   └── Homepage.module.css         ← Modified (added card styles)
│
├── firebase/
│   └── firebaseConfig.js           ← Existing (no changes)
│
└── App.jsx                         ← Modified (added route)
```

---

## 🔐 Firebase Query Structure

### Query by Order ID
```javascript
const ordersRef = collection(db, 'orders');
const q = query(
  ordersRef, 
  where('orderId', '==', 'ORD-1234567890-123')
);
const querySnapshot = await getDocs(q);
```

### Query by Email
```javascript
const ordersRef = collection(db, 'orders');
const q = query(
  ordersRef, 
  where('customerInfo.email', '==', 'user@example.com')
);
const querySnapshot = await getDocs(q);
```

### Data Structure
```javascript
{
  docId: "firebase-document-id",
  orderId: "ORD-1234567890-123",
  orderStatus: "Pending" | "Paid" | "Ongoing" | "Completed" | "Cancelled",
  customerInfo: {
    fullName: string,
    email: string,
    phoneNumber: string,
    schoolID: string,
    bachelorDegree: string,
    section: string,
    address: string
  },
  productInfo: {
    productId: string,
    productName: string,
    size: string,
    color: string,
    quantity: number,
    pricePerUnit: number,
    totalPrice: number
  },
  paymentInfo: {
    paymentMethod: "Cash" | "Online",
    onlinePaymentType: "GCash" | "PayMaya" | null,
    referenceNumber: string | null
  },
  dateOrdered: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🎨 Style Architecture

### CSS Module Structure
```
TrackOrder.module.css
│
├── Design Tokens (:root)
│   ├── Colors (bg, text, borders)
│   ├── Typography (font families)
│   └── Spacing (rhythm, shadows)
│
├── Layout
│   ├── .container
│   ├── .topBar
│   └── .content
│
├── Search Section
│   ├── .searchCard
│   ├── .searchForm
│   ├── .searchInput
│   └── .searchButton
│
├── Results Section
│   ├── .statusCard
│   │   ├── .statusHeader
│   │   ├── .progressBar
│   │   └── .timeline
│   │
│   └── .infoGrid
│       ├── .infoCard
│       └── .infoRow
│
├── Responsive Breakpoints
│   ├── @media (max-width: 768px)
│   └── @media (max-width: 480px)
│
└── Dark Mode
    └── @media (prefers-color-scheme: dark)
```

---

## 🔀 Navigation Flow

```
                    ┌─────────────────┐
                    │   Homepage (/)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌────────────────┐   ┌──────────────┐
│ Quick Access  │   │    Sidebar     │   │ Order Page   │
│     Card      │   │  Track Link    │   │   Success    │
└───────┬───────┘   └────────┬───────┘   └──────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  Track Order Page    │
                  │    /track-order      │
                  └──────────┬───────────┘
                             │
                ┌────────────┼────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌──────────────┐
        │ Search & View │         │ Back to Home │
        │     Order     │         │      (/)     │
        └───────────────┘         └──────────────┘
```

---

## 📊 State Management Flow

```
Initial State
├── searchQuery: ""
├── searchType: "orderId"
├── order: null
├── loading: false
├── error: ""
└── searched: false

        │
        │ User enters query
        ▼

Searching State
├── searchQuery: "ORD-123..."
├── searchType: "orderId"
├── order: null
├── loading: true ←─────────── Loading indicator
├── error: ""
└── searched: true

        │
        │ Firebase query completes
        ▼

Success State
├── searchQuery: "ORD-123..."
├── searchType: "orderId"
├── order: { ... } ←─────────── Order data loaded
├── loading: false
├── error: ""
└── searched: true

        │
        │ Display results
        ▼

Results Displayed
- Status card rendered
- Info cards populated
- Timeline updated
- Action buttons shown
```

---

## 🔄 Status Transition Logic

```
Order Lifecycle

    [Order Created]
          │
          ▼
    ┌──────────┐
    │ PENDING  │ ← Order placed, awaiting payment
    └────┬─────┘
         │
         │ Payment confirmed by officer
         ▼
    ┌──────────┐
    │   PAID   │ ← Payment verified, order queued
    └────┬─────┘
         │
         │ Officer starts processing
         ▼
    ┌──────────┐
    │ ONGOING  │ ← Order being prepared
    └────┬─────┘
         │
         │ Order ready
         ▼
    ┌──────────┐
    │COMPLETED │ ← Ready for pickup/delivered
    └──────────┘

    Any status can transition to:
    ┌──────────┐
    │CANCELLED │ ← Order cancelled
    └──────────┘
```

---

## 🎯 Component Lifecycle

```
1. Component Mount
   └── useEffect checks for navigation state
       └── If orderId provided → auto-search

2. User Interaction
   ├── Select search type (Order ID / Email)
   ├── Enter search query
   └── Click "Track Order"

3. Search Execution
   ├── Validate input
   ├── Set loading state
   ├── Query Firebase
   └── Process results

4. Display Results
   ├── Calculate status info
   ├── Render status card
   ├── Render info cards
   └── Render timeline

5. User Actions
   ├── Track another order → Reset state
   └── Back to home → Navigate away

6. Component Unmount
   └── Cleanup (automatic)
```

---

## 🔍 Search Algorithm

```
handleSearch(query, type)
│
├── 1. Validate Input
│   ├── Check if query is empty
│   └── Return error if invalid
│
├── 2. Prepare Query
│   ├── Set loading = true
│   ├── Clear previous results
│   └── Clear previous errors
│
├── 3. Build Firebase Query
│   ├── If type === "orderId"
│   │   └── where('orderId', '==', query)
│   └── If type === "email"
│       └── where('customerInfo.email', '==', query.toLowerCase())
│
├── 4. Execute Query
│   └── getDocs(query)
│
├── 5. Process Results
│   ├── If empty → Show "not found" error
│   ├── If multiple → Sort by date
│   └── Get most recent order
│
├── 6. Update State
│   ├── setOrder(orderData)
│   ├── setLoading(false)
│   └── setSearched(true)
│
└── 7. Render Results
    └── Component re-renders with order data
```

---

## 📱 Responsive Breakpoints

```
Desktop (> 768px)
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │      Search Section         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      Status Card            │   │
│  └─────────────────────────────┘   │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │ Order │ │Customer│ │Payment│    │
│  │Details│ │  Info  │ │ Info  │    │
│  └───────┘ └───────┘ └───────┘    │
└─────────────────────────────────────┘

Tablet (≤ 768px)
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │      Search Section         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      Status Card            │   │
│  └─────────────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐   │
│  │   Order     │ │  Customer   │   │
│  │  Details    │ │    Info     │   │
│  └─────────────┘ └─────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      Payment Info           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

Mobile (≤ 480px)
┌─────────────────────┐
│  ┌───────────────┐  │
│  │    Search     │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │    Status     │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │     Order     │  │
│  │    Details    │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │   Customer    │  │
│  │     Info      │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │    Payment    │  │
│  │     Info      │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 🎨 Color Coding System

```
Status Colors

Pending    → 🟡 Amber (#f59e0b)
Paid       → 🟢 Green (#10b981)
Ongoing    → 🔵 Blue  (#3b82f6)
Completed  → 🟢 Green (#10b981)
Cancelled  → 🔴 Red   (#ef4444)

UI Colors

Primary    → Blue   (#3b82f6)
Success    → Green  (#10b981)
Warning    → Amber  (#f59e0b)
Error      → Red    (#ef4444)
Text       → Slate  (#0f172a)
Border     → Gray   (#e2e8f0)
Background → White  (#ffffff)
```

---

## 🔗 Integration Points

```
Track Order Feature
│
├── Firebase
│   ├── firebaseConfig.js (existing)
│   ├── orders collection (existing)
│   └── Firestore queries (new)
│
├── React Router
│   ├── /track-order route (new)
│   └── Navigation state (new)
│
├── Components
│   ├── Homepage (modified)
│   ├── Order (modified)
│   ├── Sidebar (modified)
│   └── TrackOrder (new)
│
└── Styling
    ├── Design tokens (existing)
    ├── CSS modules (existing pattern)
    └── Responsive breakpoints (existing)
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Reusable components
- ✅ Scalable structure
- ✅ Maintainable code
- ✅ Consistent design
- ✅ Optimal performance
