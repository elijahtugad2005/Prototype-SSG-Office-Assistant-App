import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.selectedProduct;

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Product data from Firebase
  const [products, setProducts] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Customer Information
    fullName: '',
    bachelorDegree: '',
    section: '',
    address: '',
    email: '',
    phoneNumber: '',
    schoolID:'',
    
    // Product Selection
    productId: selectedProduct?.productId || '',
    productName: selectedProduct?.productName || '',
    size: '',
    color: '',
    quantity: 1,
    
    // Payment Information
    paymentMethod: 'Cash',
    onlinePaymentType: '',
    referenceNumber: '',
  });

  // UI States
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

      // If product was pre-selected from homepage
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
      size: '', // Reset size when product changes
      color: '', // Reset color when product changes
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
    
    // Clear error for this field when user starts typing
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

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.bachelorDegree) newErrors.bachelorDegree = 'Bachelor degree is required';
    if (!formData.section) newErrors.section = 'Section is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.schoolID.trim()) newErrors.schoolID ='School ID is required'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (simple check)
    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Product validation
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

    // Payment validation
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

    // Validate form
    if (!validateForm()) {
      alert('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Generate unique order ID
      const orderId = generateOrderId();

      // Prepare order data for Firebase
      const orderData = {
        orderId: orderId,
        
        // Customer Information
        customerInfo: {
          fullName: formData.fullName,
          bachelorDegree: formData.bachelorDegree,
          section: formData.section,
          address: formData.address,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          schoolID: formData.schoolID,
        },
        
        // Product Information
        productInfo: {
          productId: formData.productId,
          productName: formData.productName,
          size: formData.size || 'N/A',
          color: formData.color || 'N/A',
          quantity: parseInt(formData.quantity),
          pricePerUnit: selectedProductData.price,
          totalPrice: calculateTotal(),
        },
        
        // Payment Information
        paymentInfo: {
          paymentMethod: formData.paymentMethod,
          onlinePaymentType: formData.paymentMethod === 'Online' ? formData.onlinePaymentType : null,
          referenceNumber: formData.paymentMethod === 'Online' ? formData.referenceNumber : null,
        },
        
        // Order Status
        orderStatus: 'Pending',
        
        // Timestamps
        dateOrdered: Timestamp.now(),
        createdAt: new Date().toISOString(),
      };

      // Save to Firebase
      await addDoc(collection(db, 'orders'), orderData);

      // Success!
      setGeneratedOrderId(orderId);
      setSubmitSuccess(true);
      setLoading(false);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
  // RENDER: SUCCESS MESSAGE
  // ========================================
  if (submitSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successMessage}>
            Thank you for your order. Your order has been received and is being processed.
          </p>
          
          <div style={styles.orderIdBox}>
            <span style={styles.orderIdLabel}>Your Order ID:</span>
            <span style={styles.orderId}>{generatedOrderId}</span>
          </div>

          <p style={styles.successNote}>
            Please save this Order ID for tracking your order. 
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>

          <div style={styles.successButtons}>
            <button 
              onClick={handleNewOrder}
              style={styles.newOrderButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff7035'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fe5c03'}
            >
              Place Another Order
            </button>
            <button 
              onClick={() => navigate('/')}
              style={styles.homeButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8a3a3a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#732020'}
            >
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
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.title}>Place Your Order</h1>
        <p style={styles.subtitle}>Fill in the details below to complete your order</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* ========== CUSTOMER INFORMATION ========== */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Customer Information</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Elijah Glenn malake et- oops"
                style={{...styles.input, ...(errors.fullName ? styles.inputError : {})}}
              />
              {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
            </div>


            <div style={styles.formGroup}>
              <label style={styles.label}>School ID *</label>
              <input
                type="text"
                name="schoolID"
                value={formData.schoolID}
                onChange={handleChange}
                placeholder="8304433"
                style={{...styles.input, ...(errors.schoolID ? styles.inputError : {})}}
              />
              {errors.schoolId && <span style={styles.errorText}>{errors.schoolID}</span>}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bachelor Degree *</label>
                <select
                  name="bachelorDegree"
                  value={formData.bachelorDegree}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.bachelorDegree ? styles.inputError : {})}}
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
                {errors.bachelorDegree && <span style={styles.errorText}>{errors.bachelorDegree}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Section *</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.section ? styles.inputError : {})}}
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
                {errors.section && <span style={styles.errorText}>{errors.section}</span>}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete Address"
                style={{...styles.input, ...(errors.address ? styles.inputError : {})}}
              />
              {errors.address && <span style={styles.errorText}>{errors.address}</span>}
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@example.com"
                  style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09123456789"
                  style={{...styles.input, ...(errors.phoneNumber ? styles.inputError : {})}}
                />
                {errors.phoneNumber && <span style={styles.errorText}>{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>

          {/* ========== PRODUCT SELECTION ========== */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Product Selection</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Product *</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleProductChange}
                disabled={!!selectedProduct}
                style={{...styles.select, ...(errors.productId ? styles.inputError : {})}}
              >
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName} - ₱{product.price} 
                    ({product.stockAvailable} available)
                  </option>
                ))}
              </select>
              {errors.productId && <span style={styles.errorText}>{errors.productId}</span>}
            </div>

            {/* Show product details if selected */}
            {selectedProductData && (
              <div style={styles.productPreview}>
                <h3 style={styles.productPreviewTitle}>{selectedProductData.productName}</h3>
                <p style={styles.productPreviewDesc}>{selectedProductData.description}</p>
                <p style={styles.productPreviewPrice}>₱{selectedProductData.price} per unit</p>
              </div>
            )}

            {/* Size Selection - only show if product has sizes */}
            {selectedProductData?.sizeOptions?.length > 0 && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Size *</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.size ? styles.inputError : {})}}
                >
                  <option value="">Choose size</option>
                  {selectedProductData.sizeOptions.map((size, idx) => (
                    <option key={idx} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <span style={styles.errorText}>{errors.size}</span>}
              </div>
            )}

            {/* Color Selection - only show if product has colors */}
            {selectedProductData?.colorVariations?.length > 0 && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Color *</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.color ? styles.inputError : {})}}
                >
                  <option value="">Choose color</option>
                  {selectedProductData.colorVariations.map((color, idx) => (
                    <option key={idx} value={color}>{color}</option>
                  ))}
                </select>
                {errors.color && <span style={styles.errorText}>{errors.color}</span>}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={selectedProductData?.stockAvailable || 999}
                style={{...styles.input, ...(errors.quantity ? styles.inputError : {})}}
              />
              {errors.quantity && <span style={styles.errorText}>{errors.quantity}</span>}
            </div>

            {/* Total Price Display */}
            {selectedProductData && formData.quantity > 0 && (
              <div style={styles.totalBox}>
                <span style={styles.totalLabel}>Total Price:</span>
                <span style={styles.totalPrice}>₱{calculateTotal().toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* ========== PAYMENT INFORMATION ========== */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Information</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={formData.paymentMethod === 'Cash'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  Cash on Delivery
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={formData.paymentMethod === 'Online'}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  Online Payment
                </label>
              </div>
            </div>

            {/* Show online payment fields only if Online is selected */}
            {formData.paymentMethod === 'Online' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Online Payment Type *</label>
                  <select
                    name="onlinePaymentType"
                    value={formData.onlinePaymentType}
                    onChange={handleChange}
                    style={{...styles.select, ...(errors.onlinePaymentType ? styles.inputError : {})}}
                  >
                    <option value="">Select payment type</option>
                    <option value="GCash">GCash</option>
                    <option value="PayMaya">PayMaya</option>
                  </select>
                  {errors.onlinePaymentType && <span style={styles.errorText}>{errors.onlinePaymentType}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Reference Number *</label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    placeholder="Enter transaction reference number"
                    style={{...styles.input, ...(errors.referenceNumber ? styles.inputError : {})}}
                  />
                  {errors.referenceNumber && <span style={styles.errorText}>{errors.referenceNumber}</span>}
                </div>
              </>
            )}
          </div>

          {/* ========== SUBMIT BUTTON ========== */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ff7035')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#fe5c03')}
          >
            {loading ? 'Processing Order...' : 'Place Order'}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            style={styles.cancelButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8a3a3a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Cancel & Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#4c1515',
    padding: '3rem 1rem',
    fontFamily: 'Arial, sans-serif',
  },
  formWrapper: {
    maxWidth: '800px',
    margin: '0 auto ',
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2.5rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#fe5c03',
    marginBottom: '0.5rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#c0c0c0',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem' ,
    maxWidth : '560px',
      margin: '0 auto', 
  },
  section: {
    backgroundColor: '#732020',
    padding: '1.5rem',
    borderRadius: '0.8rem',
    border: '1px solid rgba(254, 92, 3, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    marginBottom: '1.2rem',
    fontWeight: 'bold',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
    paddingBottom: '0.5rem',
  },
  formGroup: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  label: {
    fontSize: '0.95rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '500',
  },
  input: {
    padding: '0.9rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#8a2a2a',
    color: '#f1f1f1',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  select: {
    padding: '0.9rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#8a2a2a',
    color: '#f1f1f1',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
  },
  inputError: {
    borderColor: '#f44336',
    boxShadow: '0 0 0 2px rgba(244, 67, 54, 0.2)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginTop: '0.3rem',
  },
  radioGroup: {
    display: 'flex',
    gap: '2rem',
    marginTop: '0.5rem',
  },
  radioLabel: {
    color: '#f1f1f1',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  productPreview: {
    backgroundColor: '#8a2a2a',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  productPreviewTitle: {
    color: '#fe5c03',
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  productPreviewDesc: {
    color: '#c0c0c0',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  productPreviewPrice: {
    color: '#f1f1f1',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  totalBox: {
    backgroundColor: '#8a2a2a',
    padding: '1.2rem',
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #fe5c03',
    marginTop: '1rem',
  },
  totalLabel: {
    color: '#f1f1f1',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  totalPrice: {
    color: '#fe5c03',
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    padding: '1.2rem',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
  submitButtonDisabled: {
    backgroundColor: '#7a2a2a',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#c0c0c0',
    border: '2px solid #7a2a2a',
    padding: '1rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  },
  // Success Screen Styles
  successCard: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '3rem',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    border: '2px solid'
  }
}

export default Order;