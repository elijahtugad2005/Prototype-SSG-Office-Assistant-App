import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, onSnapshot, Timestamp, doc, updateDoc} from 'firebase/firestore';
import styles from './Order.module.css';

function Order(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.selectedProduct;
  const editingOrder = props.editingOrder;

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [products, setProducts] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    bachelorDegree: '',
    section: '',
    address: '',
    email: '',
    phoneNumber: '',
    schoolID: '',
    productId: selectedProduct?.productId || '',
    productName: selectedProduct?.productName || '',
    size: '',
    color: '',
    quantity: 1,
    paymentMethod: 'Cash',
    onlinePaymentType: '',
    referenceNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [errors, setErrors] = useState({});

  // ========================================
  // FETCH PRODUCTS FROM FIREBASE
  // ========================================
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);

      if (selectedProduct) {
        setSelectedProductData(selectedProduct);
      }
    });

    return () => unsubscribe();
  }, [selectedProduct]);

  // ========================================
  // HANDLE PRODUCT SELECTION CHANGE
  // ========================================
  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p.productId === productId);
    
    setSelectedProductData(product);
    setFormData(prev => ({
      ...prev,
      productId: productId,
      productName: product?.productName || '',
      size: '',
      color: '',
    }));
  };

  // ========================================
  // HANDLE INPUT CHANGES
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ========================================
  // FORM VALIDATION
  // ========================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.bachelorDegree) newErrors.bachelorDegree = 'Bachelor degree is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.schoolID.trim()) newErrors.schoolID = 'School ID is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (selectedProductData?.sizeOptions?.length > 0 && !formData.size) {
      newErrors.size = 'Please select a size';
    }
    if (selectedProductData?.colorVariations?.length > 0 && !formData.color) {
      newErrors.color = 'Please select a color';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (selectedProductData && formData.quantity > selectedProductData.stockAvailable) {
      newErrors.quantity = `Only ${selectedProductData.stockAvailable} items available`;
    }

    if (formData.paymentMethod === 'Online') {
      if (!formData.onlinePaymentType) {
        newErrors.onlinePaymentType = 'Please select payment type';
      }
      if (!formData.referenceNumber.trim()) {
        newErrors.referenceNumber = 'Reference number is required for online payment';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // GENERATE UNIQUE ORDER ID
  // ========================================
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  // ========================================
  // CALCULATE TOTAL PRICE
  // ========================================
  const calculateTotal = () => {
    if (!selectedProductData) return 0;
    return selectedProductData.price * formData.quantity;
  };

  // ========================================
  // HANDLE FORM SUBMISSION
  // ========================================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    alert('Please fill in all required fields correctly');
    return;
  }

  setLoading(true);

  try {
    const orderId = editingOrder ? editingOrder.orderId : generateOrderId();
    const docId = editingOrder ? editingOrder.docId : null;

    const orderData = {
      orderId: orderId,
      customerInfo: {
        fullName: formData.fullName,
        bachelorDegree: formData.bachelorDegree,
        section: formData.section,
        address: formData.address,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        schoolID: formData.schoolID, // Make sure this matches your Firestore field name
      },
      productInfo: {
        productId: formData.productId,
        productName: formData.productName,
        size: formData.size || 'N/A',
        color: formData.color || 'N/A',
        quantity: parseInt(formData.quantity),
        pricePerUnit: selectedProductData.price,
        totalPrice: calculateTotal(),
      },
      paymentInfo: {
        paymentMethod: formData.paymentMethod,
        onlinePaymentType: formData.paymentMethod === 'Online' ? formData.onlinePaymentType : null,
        referenceNumber: formData.paymentMethod === 'Online' ? formData.referenceNumber : null,
      },
      orderStatus: editingOrder ? editingOrder.orderStatus : 'Pending',
      dateOrdered: editingOrder ? editingOrder.dateOrdered : Timestamp.now(),
      updatedAt: Timestamp.now(), // Add update timestamp
    };

    // Check if editing or creating new
    if (editingOrder && docId) {
      // UPDATE existing order
      await updateDoc(doc(db, 'orders', docId), orderData);
      alert('✅ Order updated successfully!');
      
      // Call onSuccess to close modal in OrderManagement
      if (props.onSuccess) {
        props.onSuccess();
      }
    } else {
      // CREATE new order
      orderData.createdAt = new Date().toISOString();
      await addDoc(collection(db, 'orders'), orderData);
      setGeneratedOrderId(orderId);
      setSubmitSuccess(true);
    }

    setLoading(false);

    if (!editingOrder) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Error submitting order. Please try again.');
    setLoading(false);
  }
};
  


  // ========================================
  // RESET FORM FOR NEW ORDER
  // ========================================
 const handleNewOrder = () => {
  // If in edit mode (in modal), just close the modal
  if (editingOrder && props.onSuccess) {
    props.onSuccess();
    return;
  }
  
  // Only reset for new orders
  setSubmitSuccess(false);
  setGeneratedOrderId('');
  setFormData({
    fullName: '',
    bachelorDegree: '',
    section: '',
    address: '',
    email: '',
    schoolID: '',
    phoneNumber: '',
    productId: '',
    productName: '',
    size: '',
    color: '',
    quantity: 1,
    paymentMethod: 'Cash',
    onlinePaymentType: '',
    referenceNumber: '',
  });
  setSelectedProductData(null);
  setErrors({});
};

  // ========================================
// HANDLE EDITING ORDER PROP
// ========================================
// ========================================
// HANDLE EDITING ORDER PROP
// ========================================
useEffect(() => {
  if (props.editingOrder) {
    const order = props.editingOrder;
    setFormData({
      fullName: order.customerInfo?.fullName || '',
      bachelorDegree: order.customerInfo?.bachelorDegree || '',
      section: order.customerInfo?.section || '',
      address: order.customerInfo?.address || '',
      email: order.customerInfo?.email || '',
      phoneNumber: order.customerInfo?.phoneNumber || '',
      schoolID: order.customerInfo?.schoolID || '', // This might be missing from your data
      productId: order.productInfo?.productId || '',
      productName: order.productInfo?.productName || '',
      size: order.productInfo?.size || '',
      color: order.productInfo?.color || '',
      quantity: order.productInfo?.quantity || 1,
      paymentMethod: order.paymentInfo?.paymentMethod || 'Cash',
      onlinePaymentType: order.paymentInfo?.onlinePaymentType || '',
      referenceNumber: order.paymentInfo?.referenceNumber || '',
    });
    
    // Also update the selectedProductData
    const product = products.find(p => p.productId === order.productInfo?.productId);
    if (product) {
      setSelectedProductData(product);
    }
  }
}, [props.editingOrder, products]);

  // ========================================
  // RENDER: SUCCESS MESSAGE
  // ========================================
  if (submitSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successMessage}>
            Thank you for your order. Your order has been received and is being processed.
          </p>
          
          <div className={styles.orderIdBox}>
            <span className={styles.orderIdLabel}>Your Order ID:</span>
            <span className={styles.orderId}>{generatedOrderId}</span>
          </div>

          <p className={styles.successNote}>
            Please save this Order ID for tracking your order. 
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>

          <div className={styles.successButtons}>
            <button onClick={handleNewOrder} className={styles.newOrderButton}>
              Place Another Order
            </button>
            <button onClick={() => navigate('/')} className={styles.homeButton}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER: ORDER FORM
  // ========================================
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Place Your Order</h1>
        <p className={styles.subtitle}>Fill in the details below to complete your order</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* CUSTOMER INFORMATION */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Elijah Glenn malake et- oops"
                className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              />
              {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>School ID *</label>
              <input
                type="text"
                name="schoolID"
                value={formData.schoolID}
                onChange={handleChange}
                placeholder="8304433"
                className={`${styles.input} ${errors.schoolID ? styles.inputError : ''}`}
              />
              {errors.schoolID && <span className={styles.errorText}>{errors.schoolID}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bachelor Degree *</label>
                <select
                  name="bachelorDegree"
                  value={formData.bachelorDegree}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.bachelorDegree ? styles.inputError : ''}`}
                >
                  <option value="">Select Degree</option>
                  <option value="BSIT">BSIT - Information Technology</option>
                  <option value="BSCS">BSCS - Computer Science</option>
                  <option value="BSHM">BSHM - Hospitality Management</option>
                  <option value="BSED">BSED - Education</option>
                  <option value="BSBA">BSBA - Business Administration</option>
                  <option value="BSN">BSN - Nursing</option>
                  <option value="BSCE">BSCE - Civil Engineering</option>
                </select>
                {errors.bachelorDegree && <span className={styles.errorText}>{errors.bachelorDegree}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.section ? styles.inputError : ''}`}
                >
                  <option value="">Select Section</option>
                  <option value="1A">1A</option>
                  <option value="1B">1B</option>
                  <option value="2A">2A</option>
                  <option value="2B">2B</option>
                  <option value="3A">3A</option>
                  <option value="3B">3B</option>
                  <option value="4A">4A</option>
                  <option value="4B">4B</option>
                </select>
                {errors.section && <span className={styles.errorText}>{errors.section}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete Address"
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
              />
              {errors.address && <span className={styles.errorText}>{errors.address}</span>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@example.com"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09123456789"
                  className={`${styles.input} ${errors.phoneNumber ? styles.inputError : ''}`}
                />
                {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>

          {/* PRODUCT SELECTION */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Product Selection</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Product *</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleProductChange}
                disabled={!!selectedProduct}
                className={`${styles.select} ${errors.productId ? styles.inputError : ''}`}
              >
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName} - ₱{product.price} 
                    ({product.stockAvailable} available)
                  </option>
                ))}
              </select>
              {errors.productId && <span className={styles.errorText}>{errors.productId}</span>}
            </div>

            {selectedProductData && (
              <div className={styles.productPreview}>
                <h3 className={styles.productPreviewTitle}>{selectedProductData.productName}</h3>
                <p className={styles.productPreviewDesc}>{selectedProductData.description}</p>
                <p className={styles.productPreviewPrice}>₱{selectedProductData.price} per unit</p>
              </div>
            )}

            {selectedProductData?.sizeOptions?.length > 0 && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.size ? styles.inputError : ''}`}
                >
                  <option value="">Choose size</option>
                  {selectedProductData.sizeOptions.map((size, idx) => (
                    <option key={idx} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <span className={styles.errorText}>{errors.size}</span>}
              </div>
            )}

            {selectedProductData?.colorVariations?.length > 0 && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Color *</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.color ? styles.inputError : ''}`}
                >
                  <option value="">Choose color</option>
                  {selectedProductData.colorVariations.map((color, idx) => (
                    <option key={idx} value={color}>{color}</option>
                  ))}
                </select>
                {errors.color && <span className={styles.errorText}>{errors.color}</span>}
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={selectedProductData?.stockAvailable || 999}
                className={`${styles.input} ${errors.quantity ? styles.inputError : ''}`}
              />
              {errors.quantity && <span className={styles.errorText}>{errors.quantity}</span>}
            </div>

            {selectedProductData && formData.quantity > 0 && (
              <div className={styles.totalBox}>
                <span className={styles.totalLabel}>Total Price:</span>
                <span className={styles.totalPrice}>₱{calculateTotal().toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* PAYMENT INFORMATION */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Method *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={formData.paymentMethod === 'Cash'}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  Cash on Delivery
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={formData.paymentMethod === 'Online'}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  Online Payment
                </label>
              </div>
            </div>

            {formData.paymentMethod === 'Online' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Online Payment Type *</label>
                  <select
                    name="onlinePaymentType"
                    value={formData.onlinePaymentType}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.onlinePaymentType ? styles.inputError : ''}`}
                  >
                    <option value="">Select payment type</option>
                    <option value="GCash">GCash</option>
                    <option value="PayMaya">PayMaya</option>
                  </select>
                  {errors.onlinePaymentType && <span className={styles.errorText}>{errors.onlinePaymentType}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Reference Number *</label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    placeholder="Enter transaction reference number"
                    className={`${styles.input} ${errors.referenceNumber ? styles.inputError : ''}`}
                  />
                  {errors.referenceNumber && <span className={styles.errorText}>{errors.referenceNumber}</span>}
                </div>
              </>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.submitButtonDisabled : ''}`}
          >
            {loading ? 'Processing Order...' : 'Place Order'}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className={styles.cancelButton}
          >
            Cancel & Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default Order;