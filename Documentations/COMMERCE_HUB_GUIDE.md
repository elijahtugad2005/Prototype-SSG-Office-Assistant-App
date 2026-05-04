# Commerce Hub - User Guide

## 🛍️ What is Commerce Hub?

Commerce Hub is your **one-stop dashboard** for managing all commerce operations. Instead of navigating between separate pages for orders and products, everything is now in one convenient location.

---

## 🎯 Who Can Access?

### ✅ Administrators
- Full access to all features
- Can manage orders and products
- Can view analytics

### ✅ Representatives
- Full access to all features
- Can manage orders and products
- Can view analytics

### ❌ Secretaries & Public Users
- No access to Commerce Hub
- Secretaries have Finance access instead
- Public users can only place and track orders

---

## 📍 How to Access

### From Sidebar
1. **Log in** with your representative or admin account
2. **Open the sidebar** (click hamburger menu if on mobile)
3. **Click "Commerce Hub"** (🛍️ icon)
4. You'll see the unified dashboard

```
┌─────────────────────┐
│  Supremo Gobyerno   │
├─────────────────────┤
│  🏠 Home            │
│  🛒 Place Order     │
│  🔍 Track Order     │
│  📊 Admin Dashboard │
│  🛍️ Commerce Hub ←──│ Click here!
│  💰 Finance         │
│  ...                │
└─────────────────────┘
```

---

## 🎨 Interface Overview

### Top Bar
```
┌─────────────────────────────────────────────────────┐
│  COMMERCE MANAGEMENT                                │
│  Commerce Hub                    🛍️ Representative  │
│  Manage orders, products, and track commerce        │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- **Eyebrow**: "COMMERCE MANAGEMENT"
- **Title**: "Commerce Hub"
- **Subtitle**: Brief description
- **Badge**: "Representative Portal" (purple badge)

### Tab Navigation
```
┌─────────────────────────────────────────────────────┐
│  📦 Order Management [Orders]                       │
│  🛍️ Product Management [Products]                   │
│  📊 Analytics [Insights]                            │
└─────────────────────────────────────────────────────┘
```

**Features:**
- **Icons**: Visual indicators for each section
- **Labels**: Clear section names
- **Badges**: Quick reference tags
- **Active Indicator**: Blue underline on selected tab

---

## 📦 Order Management Tab

### What You Can Do

#### 1. View All Orders
```
┌─────────────────────────────────────────────────────┐
│  Dashboard                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Total   │ │ Pending  │ │  Paid    │           │
│  │  Orders  │ │  Orders  │ │  Orders  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

**Dashboard View:**
- Total orders count
- Pending orders
- Paid orders
- Ongoing orders
- Completed orders
- Cancelled orders
- Total revenue

#### 2. Manage Orders
```
┌─────────────────────────────────────────────────────┐
│  Orders Table                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Order ID | Customer | Product | Status     │   │
│  ├─────────────────────────────────────────────┤   │
│  │ ORD-123  | Juan     | Lanyard | Pending    │   │
│  │ ORD-124  | Maria    | Uniform | Paid       │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Available Actions:**
- **Search**: Find orders by ID, name, or email
- **Filter**: By status or payment method
- **Update Status**: Change order status
- **Edit**: Modify order details
- **Delete**: Remove orders

#### 3. Update Order Status

**Status Options:**
1. **Pending** - Order received, awaiting payment
2. **Paid** - Payment confirmed
3. **Ongoing** - Order being processed
4. **Completed** - Ready for pickup
5. **Cancelled** - Order cancelled

**How to Update:**
1. Find the order in the table
2. Click the status dropdown
3. Select new status
4. Confirm the change

#### 4. Edit Order Details

**Editable Fields:**
- Customer information
- Product selection
- Quantity
- Size and color
- Payment details

**Steps:**
1. Click "Edit" button on order row
2. Modal opens with order form
3. Make your changes
4. Click "Update Order"

---

## 🛍️ Product Management Tab

### What You Can Do

#### 1. View All Products
```
┌─────────────────────────────────────────────────────┐
│  Products Grid                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ [Image]  │ │ [Image]  │ │ [Image]  │           │
│  │ Lanyard  │ │ Uniform  │ │  Shirt   │           │
│  │ ₱75.00   │ │ ₱250.00  │ │ ₱150.00  │           │
│  │ 50 stock │ │ 20 stock │ │ 30 stock │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

**Product Information:**
- Product image
- Product name
- Description
- Price
- Stock available
- Size options
- Color variations

#### 2. Add New Product

**Steps:**
1. Click "Add Product" button
2. Fill in product details:
   - Product name
   - Description
   - Price
   - Stock quantity
   - Category
   - Size options (optional)
   - Color variations (optional)
3. Upload product image
4. Click "Create Product"

**Required Fields:**
- ✅ Product name
- ✅ Price
- ✅ Stock available

**Optional Fields:**
- Description
- Image
- Size options
- Color variations
- Category

#### 3. Edit Existing Product

**Steps:**
1. Find the product card
2. Click "Edit" button
3. Update any fields
4. Click "Update Product"

**What You Can Edit:**
- Product name
- Description
- Price
- Stock quantity
- Image
- Size options
- Color variations

#### 4. Delete Product

**Steps:**
1. Find the product card
2. Click "Delete" button
3. Confirm deletion
4. Product is removed

**⚠️ Warning:**
- Deletion is permanent
- Cannot be undone
- Consider setting stock to 0 instead

#### 5. Manage Stock

**Low Stock Alert:**
- Products with ≤ 10 items show "Low Stock" badge
- Products with 0 items show "Out of Stock" badge

**Update Stock:**
1. Edit the product
2. Change "Stock Available" field
3. Save changes

---

## 📊 Analytics Tab (Coming Soon)

### Planned Features

```
┌─────────────────────────────────────────────────────┐
│  📊 Commerce Analytics                              │
│                                                     │
│  Comprehensive analytics and reports for orders    │
│  and products will be available here.              │
│                                                     │
│  Track sales trends, popular products, revenue     │
│  insights, and more.                               │
└─────────────────────────────────────────────────────┘
```

**Future Analytics:**
- Sales trends charts
- Revenue tracking
- Popular products ranking
- Order statistics
- Inventory insights
- Performance metrics
- Export reports (PDF/Excel)

---

## 🔄 Workflow Examples

### Example 1: Processing a New Order

1. **Customer places order** on website
2. **You receive notification** (order appears in system)
3. **Navigate to Commerce Hub** → Order Management tab
4. **Find the order** in Pending status
5. **Verify payment** (check reference number if online)
6. **Update status to "Paid"** once confirmed
7. **Prepare the product**
8. **Update status to "Ongoing"** while processing
9. **Complete preparation**
10. **Update status to "Completed"** when ready
11. **Customer picks up** order

### Example 2: Adding a New Product

1. **Navigate to Commerce Hub** → Product Management tab
2. **Click "Add Product"** button
3. **Enter product details:**
   - Name: "SSG Lanyard 2025"
   - Price: ₱75.00
   - Stock: 100
   - Description: "Official SSG lanyard for 2025"
4. **Upload product image**
5. **Add size options** (if applicable): Standard
6. **Add color options** (if applicable): Blue, Red
7. **Click "Create Product"**
8. **Product is now available** for ordering

### Example 3: Handling Low Stock

1. **Check Product Management tab**
2. **Look for "Low Stock" badges**
3. **Identify products needing restock**
4. **Order more inventory** from supplier
5. **Update stock quantity** when received
6. **Product is available again**

---

## 💡 Tips & Best Practices

### For Order Management

1. **Check Orders Daily**
   - Review pending orders every morning
   - Process payments promptly
   - Update statuses regularly

2. **Communicate with Customers**
   - Confirm payments quickly
   - Notify when orders are ready
   - Respond to inquiries

3. **Keep Records**
   - Don't delete orders unnecessarily
   - Use "Cancelled" status instead
   - Maintain order history

4. **Monitor Status Flow**
   - Pending → Paid → Ongoing → Completed
   - Don't skip statuses
   - Update in logical order

### For Product Management

1. **Maintain Accurate Stock**
   - Update stock after each order
   - Check inventory regularly
   - Set up reorder points

2. **Use Quality Images**
   - Clear, well-lit photos
   - Show product details
   - Consistent image sizes

3. **Write Clear Descriptions**
   - Include all relevant details
   - Mention size and color options
   - Highlight special features

4. **Price Competitively**
   - Research similar products
   - Consider costs and margins
   - Update prices as needed

5. **Organize Products**
   - Use consistent naming
   - Group similar items
   - Keep categories clear

---

## 🔍 Search & Filter

### Order Search
**Search by:**
- Order ID
- Customer name
- Customer email

**Filter by:**
- Order status (All, Pending, Paid, Ongoing, Completed, Cancelled)
- Payment method (All, Cash, Online)

### Product Search
**Search by:**
- Product name
- Description

**Filter by:**
- Category
- Stock status (All, In Stock, Low Stock, Out of Stock)

---

## 📱 Mobile Usage

### On Mobile Devices

**Accessing:**
1. Tap hamburger menu (☰)
2. Tap "Commerce Hub"
3. Swipe between tabs

**Features:**
- All tabs accessible
- Responsive tables
- Touch-friendly buttons
- Optimized layouts

**Tips:**
- Use landscape mode for tables
- Scroll horizontally if needed
- Tap and hold for more options

---

## ⚠️ Common Issues

### Issue: Can't see Commerce Hub in sidebar
**Reason:** You don't have the right role  
**Solution:** Contact admin to assign representative role

### Issue: Orders not loading
**Reason:** Network or Firebase connection issue  
**Solution:** 
- Refresh the page
- Check internet connection
- Contact IT support

### Issue: Can't update order status
**Reason:** Permission or validation error  
**Solution:**
- Verify you're logged in
- Check if order exists
- Try refreshing the page

### Issue: Product image not uploading
**Reason:** File size or format issue  
**Solution:**
- Use JPG or PNG format
- Keep file size under 5MB
- Compress image if needed

---

## 🎯 Quick Reference

### Keyboard Shortcuts
- **Tab**: Navigate between fields
- **Enter**: Submit forms
- **Esc**: Close modals
- **Ctrl+F**: Search (browser)

### Status Colors
- 🟡 **Pending**: Yellow/Amber
- 🟢 **Paid**: Green
- 🔵 **Ongoing**: Blue
- 🟢 **Completed**: Green
- 🔴 **Cancelled**: Red

### Action Buttons
- **Blue**: Primary actions (Save, Update)
- **Green**: Success actions (Complete)
- **Red**: Destructive actions (Delete)
- **Gray**: Secondary actions (Cancel)

---

## 📞 Need Help?

### For Technical Issues
- Contact IT/Web team
- Provide screenshots
- Describe the problem clearly

### For Process Questions
- Ask senior representatives
- Refer to this guide
- Contact admin for clarification

### For System Errors
- Note the error message
- Try refreshing the page
- Report to IT support

---

## ✅ Daily Checklist

### Morning Routine
- [ ] Log in to Commerce Hub
- [ ] Check pending orders
- [ ] Verify payments
- [ ] Update order statuses
- [ ] Check low stock products

### Throughout the Day
- [ ] Process new orders
- [ ] Update statuses as needed
- [ ] Respond to customer inquiries
- [ ] Monitor inventory levels

### End of Day
- [ ] Complete all pending updates
- [ ] Review completed orders
- [ ] Check for issues
- [ ] Plan for next day

---

## 🎉 Benefits of Commerce Hub

### Efficiency
- ✅ All tools in one place
- ✅ Quick tab switching
- ✅ Less navigation time
- ✅ Streamlined workflow

### Convenience
- ✅ Unified interface
- ✅ Consistent design
- ✅ Easy to learn
- ✅ Mobile-friendly

### Productivity
- ✅ Faster order processing
- ✅ Better inventory management
- ✅ Improved organization
- ✅ Time savings

---

**Happy Managing! 🛍️**

For more information, contact your administrator or refer to the technical documentation.
