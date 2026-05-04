# Track Order Feature - Testing Guide

## 🧪 How to Test the Feature

### Prerequisites
1. Firebase must be configured and running
2. At least one order should exist in the database
3. Development server should be running (`npm run dev`)

---

## Test Scenario 1: Track from Homepage

### Steps:
1. Navigate to homepage (`http://localhost:5173/`)
2. Scroll to the hero section
3. Look for "QUICK ACCESS" section on the right
4. Click on "📦 Track My Order" card
5. Verify you're redirected to `/track-order`

### Expected Results:
- ✅ Card should have hover effect (orange highlight)
- ✅ Card should be clickable
- ✅ Navigation should work smoothly
- ✅ Track Order page should load

---

## Test Scenario 2: Search by Order ID

### Steps:
1. Go to `/track-order`
2. Ensure "Order ID" tab is selected (default)
3. Enter a valid Order ID (e.g., `ORD-1234567890-123`)
4. Click "Track Order" button

### Expected Results:
- ✅ Loading spinner should appear
- ✅ Order details should display
- ✅ Status card should show correct status
- ✅ Progress bar should show correct percentage
- ✅ Timeline should highlight completed steps
- ✅ Three info cards should display all data

### Test with Invalid Order ID:
1. Enter a non-existent Order ID
2. Click "Track Order"

**Expected:**
- ✅ Error message: "Order not found. Please check your Order ID and try again."
- ✅ No order details displayed

---

## Test Scenario 3: Search by Email

### Steps:
1. Go to `/track-order`
2. Click "Email Address" tab
3. Enter a valid email used in an order
4. Click "Track Order" button

### Expected Results:
- ✅ Loading spinner should appear
- ✅ Most recent order for that email should display
- ✅ All order information should be correct

### Test with Invalid Email:
1. Enter an email with no orders
2. Click "Track Order"

**Expected:**
- ✅ Error message: "No orders found for this email address."

---

## Test Scenario 4: Track from Order Success Screen

### Steps:
1. Go to `/order`
2. Fill out the order form completely
3. Submit the order
4. On success screen, note the Order ID
5. Click "Track My Order" button (green button)

### Expected Results:
- ✅ Redirected to `/track-order`
- ✅ Order is automatically searched
- ✅ Order details display immediately
- ✅ No need to manually enter Order ID

---

## Test Scenario 5: Sidebar Navigation

### Steps:
1. Open sidebar (click hamburger if on mobile)
2. Look for "🔍 Track Order" menu item
3. Click on it

### Expected Results:
- ✅ Menu item should be visible
- ✅ Redirected to `/track-order`
- ✅ Search form should be displayed

---

## Test Scenario 6: Different Order Statuses

Test with orders having different statuses:

### Pending Order
- ✅ Yellow/Amber status indicator
- ✅ Progress bar at 25%
- ✅ Only "Order Placed" step highlighted in timeline
- ✅ Description: "awaiting payment confirmation"

### Paid Order
- ✅ Green status indicator
- ✅ Progress bar at 50%
- ✅ "Order Placed" and "Payment Confirmed" highlighted
- ✅ Description: "order is being prepared"

### Ongoing Order
- ✅ Blue status indicator
- ✅ Progress bar at 75%
- ✅ Three steps highlighted in timeline
- ✅ Description: "being processed and prepared"

### Completed Order
- ✅ Green status indicator
- ✅ Progress bar at 100%
- ✅ All four steps highlighted
- ✅ Description: "ready for pickup or has been delivered"

### Cancelled Order
- ✅ Red status indicator
- ✅ Progress bar at 0%
- ✅ No timeline steps highlighted
- ✅ Description: "contact support for more information"

---

## Test Scenario 7: Responsive Design

### Desktop (> 768px)
1. Open in full browser window
2. Check layout

**Expected:**
- ✅ Three-column info grid
- ✅ Horizontal timeline
- ✅ Side-by-side action buttons
- ✅ Proper spacing and padding

### Tablet (≤ 768px)
1. Resize browser to 768px width
2. Check layout

**Expected:**
- ✅ Two-column info grid
- ✅ Adjusted spacing
- ✅ Buttons still side-by-side

### Mobile (≤ 480px)
1. Resize browser to 375px width (iPhone size)
2. Check layout

**Expected:**
- ✅ Single-column info grid
- ✅ Stacked action buttons
- ✅ Compact timeline
- ✅ Full-width search input
- ✅ Readable text sizes

---

## Test Scenario 8: Track Another Order

### Steps:
1. Search for and view an order
2. Scroll to bottom
3. Click "Track Another Order" button

### Expected Results:
- ✅ Order details disappear
- ✅ Search form reappears
- ✅ Previous search query is cleared
- ✅ Can search for a new order

---

## Test Scenario 9: Back to Home

### Steps:
1. View an order's details
2. Click "Back to Home" button

### Expected Results:
- ✅ Redirected to homepage (`/`)
- ✅ Navigation works smoothly

---

## Test Scenario 10: Empty Search

### Steps:
1. Go to `/track-order`
2. Leave search input empty
3. Click "Track Order" button

### Expected Results:
- ✅ Error message: "Please enter an Order ID or Email"
- ✅ No search is performed
- ✅ No loading state

---

## Test Scenario 11: Data Accuracy

### Steps:
1. Track an order
2. Compare displayed data with Firebase database

**Verify:**
- ✅ Order ID matches
- ✅ Customer name matches
- ✅ Email matches
- ✅ Phone number matches
- ✅ School ID matches
- ✅ Product name matches
- ✅ Size matches (if applicable)
- ✅ Color matches (if applicable)
- ✅ Quantity matches
- ✅ Total price matches
- ✅ Payment method matches
- ✅ Reference number matches (if online payment)
- ✅ Order date matches

---

## Test Scenario 12: Dark Mode (if applicable)

### Steps:
1. Enable dark mode in browser/OS
2. Navigate to `/track-order`
3. Search for an order

### Expected Results:
- ✅ Dark background colors
- ✅ Light text colors
- ✅ Proper contrast
- ✅ All elements visible
- ✅ Hover effects work

---

## Test Scenario 13: Loading States

### Steps:
1. Throttle network in DevTools (Slow 3G)
2. Search for an order
3. Observe loading behavior

### Expected Results:
- ✅ Spinner appears in button
- ✅ Button text changes to "Searching..."
- ✅ Button is disabled during search
- ✅ Loading state clears after search completes

---

## Test Scenario 14: Error Handling

### Test Firebase Connection Error:
1. Disconnect from internet
2. Try to search for an order

**Expected:**
- ✅ Error message displayed
- ✅ User-friendly error text
- ✅ No app crash

### Test Invalid Data:
1. Manually modify Firebase data to have missing fields
2. Search for that order

**Expected:**
- ✅ App handles missing data gracefully
- ✅ Shows "N/A" for missing fields
- ✅ No console errors

---

## Test Scenario 15: Multiple Orders for Same Email

### Steps:
1. Create multiple orders with same email
2. Search by that email

### Expected Results:
- ✅ Most recent order is displayed
- ✅ Correct order based on timestamp
- ✅ No errors

---

## Performance Tests

### Page Load Time
- ✅ Page loads in < 2 seconds
- ✅ No layout shift during load
- ✅ Smooth animations

### Search Performance
- ✅ Search completes in < 1 second (normal network)
- ✅ No lag or freezing
- ✅ Smooth transitions

---

## Accessibility Tests

### Keyboard Navigation
1. Use Tab key to navigate
2. Use Enter to submit search

**Expected:**
- ✅ All interactive elements are focusable
- ✅ Focus indicators visible
- ✅ Enter key submits search
- ✅ Logical tab order

### Screen Reader
1. Use screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through the page

**Expected:**
- ✅ All content is announced
- ✅ Button labels are clear
- ✅ Form labels are associated
- ✅ Status messages are announced

---

## Browser Compatibility

Test in multiple browsers:

### Chrome
- ✅ All features work
- ✅ Styles render correctly
- ✅ No console errors

### Firefox
- ✅ All features work
- ✅ Styles render correctly
- ✅ No console errors

### Safari
- ✅ All features work
- ✅ Styles render correctly
- ✅ No console errors

### Edge
- ✅ All features work
- ✅ Styles render correctly
- ✅ No console errors

---

## Quick Test Checklist

Use this for rapid testing:

- [ ] Homepage Quick Access card works
- [ ] Sidebar navigation works
- [ ] Order success screen button works
- [ ] Search by Order ID works
- [ ] Search by Email works
- [ ] All 5 status types display correctly
- [ ] Progress bar animates
- [ ] Timeline updates based on status
- [ ] All info cards display data
- [ ] "Track Another Order" works
- [ ] "Back to Home" works
- [ ] Responsive on mobile
- [ ] Error messages display
- [ ] Loading states work
- [ ] No console errors

---

## Common Issues & Solutions

### Issue: "Order not found" for valid Order ID
**Solution:** 
- Check Firebase connection
- Verify Order ID format in database
- Ensure order exists in `orders` collection

### Issue: Styles not loading
**Solution:**
- Clear browser cache
- Rebuild project (`npm run build`)
- Check CSS module imports

### Issue: Navigation not working
**Solution:**
- Verify route is added in App.jsx
- Check React Router configuration
- Ensure component is imported correctly

### Issue: Firebase query fails
**Solution:**
- Check Firebase configuration
- Verify Firestore security rules
- Ensure collection name is correct (`orders`)

---

## Test Data Setup

### Create Test Orders in Firebase

```javascript
// Pending Order
{
  orderId: "ORD-1234567890-001",
  orderStatus: "Pending",
  customerInfo: {
    fullName: "Test User 1",
    email: "test1@example.com",
    phoneNumber: "09123456789",
    schoolID: "2021-12345",
    bachelorDegree: "BSIT"
  },
  productInfo: {
    productName: "SSG Lanyard",
    quantity: 1,
    totalPrice: 75
  },
  paymentInfo: {
    paymentMethod: "Cash"
  },
  dateOrdered: Timestamp.now()
}

// Completed Order
{
  orderId: "ORD-1234567890-002",
  orderStatus: "Completed",
  customerInfo: {
    fullName: "Test User 2",
    email: "test2@example.com",
    phoneNumber: "09123456789",
    schoolID: "2021-54321",
    bachelorDegree: "BSCS"
  },
  productInfo: {
    productName: "SSG Uniform",
    size: "Large",
    color: "Blue",
    quantity: 2,
    totalPrice: 500
  },
  paymentInfo: {
    paymentMethod: "Online",
    onlinePaymentType: "GCash",
    referenceNumber: "1234567890"
  },
  dateOrdered: Timestamp.now()
}
```

---

## Automated Testing (Future)

Consider adding:
- Unit tests for search logic
- Integration tests for Firebase queries
- E2E tests for user flows
- Visual regression tests

---

## Sign-off Checklist

Before marking feature as complete:

- [ ] All test scenarios pass
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Cross-browser tested
- [ ] Accessibility checked
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Firebase security rules verified
- [ ] User guide created

---

**Testing completed by:** _________________

**Date:** _________________

**Notes:** _________________
