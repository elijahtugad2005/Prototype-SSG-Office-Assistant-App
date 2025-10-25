import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

function ProductManagement() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Product form data
  const [productData, setProductData] = useState({
    productName: '',
    stockAvailable: 0,
    hasVariations: false,
    sizeOptions: [],
    colorVariations: [],
    description: '',
    price: 0,
    supplier: '',
    imageFile: null,
    imagePath: '',
  });

  // Temporary inputs for adding variations
  const [tempSize, setTempSize] = useState('');
  const [tempColor, setTempColor] = useState('');

  // Products list from Firebase
  const [products, setProducts] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'

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
    }, (error) => {
      console.error('Error fetching products:', error);
    });

    return () => unsubscribe();
  }, []);

  // ========================================
  // GENERATE UNIQUE PRODUCT ID
  // ========================================
  const generateProductId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PROD-${timestamp}-${random}`;
  };

  // ========================================
  // HANDLE INPUT CHANGES
  // ========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ========================================
  // HANDLE IMAGE UPLOAD
  // ========================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProductData(prev => ({
        ...prev,
        imageFile: file,
        imagePath: `/products/${file.name}`
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ========================================
  // ADD SIZE TO LIST
  // ========================================
  const handleAddSize = () => {
    if (tempSize.trim()) {
      setProductData(prev => ({
        ...prev,
        sizeOptions: [...prev.sizeOptions, tempSize.trim()]
      }));
      setTempSize('');
    }
  };

  // ========================================
  // REMOVE SIZE FROM LIST
  // ========================================
  const handleRemoveSize = (index) => {
    setProductData(prev => ({
      ...prev,
      sizeOptions: prev.sizeOptions.filter((_, i) => i !== index)
    }));
  };

  // ========================================
  // ADD COLOR TO LIST
  // ========================================
  const handleAddColor = () => {
    if (tempColor.trim()) {
      setProductData(prev => ({
        ...prev,
        colorVariations: [...prev.colorVariations, tempColor.trim()]
      }));
      setTempColor('');
    }
  };

  // ========================================
  // REMOVE COLOR FROM LIST
  // ========================================
  const handleRemoveColor = (index) => {
    setProductData(prev => ({
      ...prev,
      colorVariations: prev.colorVariations.filter((_, i) => i !== index)
    }));
  };

  // ========================================
  // VALIDATE FORM
  // ========================================
  const validateForm = () => {
    if (!productData.productName.trim()) {
      alert('Product name is required');
      return false;
    }
    if (productData.stockAvailable < 0) {
      alert('Stock quantity cannot be negative');
      return false;
    }
    if (!productData.description.trim()) {
      alert('Product description is required');
      return false;
    }
    if (productData.price <= 0) {
      alert('Product price must be greater than 0');
      return false;
    }
    if (!productData.supplier.trim()) {
      alert('Supplier name is required');
      return false;
    }
    return true;
  };

  // ========================================
  // HANDLE ADD PRODUCT
  // ========================================
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const productId = generateProductId();

      // Prepare product data
      const newProduct = {
        productId: productId,
        productName: productData.productName,
        stockAvailable: parseInt(productData.stockAvailable),
        hasVariations: productData.hasVariations,
        sizeOptions: productData.hasVariations ? productData.sizeOptions : [],
        colorVariations: productData.hasVariations ? productData.colorVariations : [],
        description: productData.description,
        price: parseFloat(productData.price),
        supplier: productData.supplier,
        imageUrl: productData.imagePath || '/products/default.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Firebase
      await addDoc(collection(db, 'products'), newProduct);

      alert(`✅ Product "${productData.productName}" added successfully!\nProduct ID: ${productId}`);

      // Reset form
      resetForm();
      setLoading(false);

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
      setLoading(false);
    }
  };

  // ========================================
  // HANDLE EDIT PRODUCT
  // ========================================
  const handleEditClick = (product) => {
    setEditingProductId(product.productId);
    setProductData({
      productName: product.productName,
      stockAvailable: product.stockAvailable,
      hasVariations: product.hasVariations,
      sizeOptions: product.sizeOptions || [],
      colorVariations: product.colorVariations || [],
      description: product.description,
      price: product.price,
      supplier: product.supplier,
      imageFile: null,
      imagePath: product.imageUrl || '',
    });
    setImagePreview(product.imageUrl);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========================================
  // HANDLE UPDATE PRODUCT
  // ========================================
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const productRef = doc(db, 'products', editingProductId);

      const updatedProduct = {
        productName: productData.productName,
        stockAvailable: parseInt(productData.stockAvailable),
        hasVariations: productData.hasVariations,
        sizeOptions: productData.hasVariations ? productData.sizeOptions : [],
        colorVariations: productData.hasVariations ? productData.colorVariations : [],
        description: productData.description,
        price: parseFloat(productData.price),
        supplier: productData.supplier,
        imageUrl: productData.imagePath || '/products/default.jpg',
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(productRef, updatedProduct);

      alert('✅ Product updated successfully!');

      resetForm();
      setEditingProductId(null);
      setLoading(false);
      setActiveTab('manage');

    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
      setLoading(false);
    }
  };

  // ========================================
  // HANDLE DELETE PRODUCT
  // ========================================
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      alert('🗑️ Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  // ========================================
  // RESET FORM
  // ========================================
  const resetForm = () => {
    setProductData({
      productName: '',
      stockAvailable: 0,
      hasVariations: false,
      sizeOptions: [],
      colorVariations: [],
      description: '',
      price: 0,
      supplier: '',
      imageFile: null,
      imagePath: '',
    });
    setImagePreview(null);
    setTempSize('');
    setTempColor('');
    setEditingProductId(null);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Product Management</h2>
        <p style={styles.headerSubtitle}>Manage lanyards, uniforms and other products</p>
      </div>

      {/* TAB NAVIGATION */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            ...styles.tab,
            ...(activeTab === 'add' ? styles.tabActive : {})
          }}
        >
          {editingProductId ? '✏️ Edit Product' : '➕ Add Product'}
        </button>
        <button
          onClick={() => {
            setActiveTab('manage');
            resetForm();
          }}
          style={{
            ...styles.tab,
            ...(activeTab === 'manage' ? styles.tabActive : {})
          }}
        >
          📦 Manage Products ({products.length})
        </button>
      </div>

      {/* ADD/EDIT PRODUCT FORM */}
      {activeTab === 'add' && (
        <div style={styles.formWrapper}>
          <h3 style={styles.sectionTitle}>
            {editingProductId ? 'Edit Product Details' : 'Add New Product'}
          </h3>

          <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct} style={styles.form}>
            
            {/* Product Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="e.g., COED Lanyard"
                style={styles.input}
                required
              />
            </div>

            {/* Stock and Price */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  name="stockAvailable"
                  value={productData.stockAvailable}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 100"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₱) *</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 150.00"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Supplier */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Supplier Name *</label>
              <input
                type="text"
                name="supplier"
                value={productData.supplier}
                onChange={handleChange}
                placeholder="e.g., ABC Manufacturing Inc."
                style={styles.input}
                required
              />
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Description *</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Describe the product features, materials, etc."
                rows="4"
                style={styles.textarea}
                required
              />
            </div>

            {/* Has Variations Checkbox */}
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="hasVariations"
                  checked={productData.hasVariations}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span>This product has variations (sizes/colors)</span>
              </label>
            </div>

            {/* Variations Section - Only show if hasVariations is true */}
            {productData.hasVariations && (
              <div style={styles.variationsSection}>
                <h4 style={styles.variationsTitle}>Product Variations</h4>

                {/* Size Options */}
                <div style={styles.variationGroup}>
                  <label style={styles.label}>Size Options</label>
                  <div style={styles.addVariationContainer}>
                    <input
                      type="text"
                      value={tempSize}
                      onChange={(e) => setTempSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                      placeholder="e.g., Small, Medium, Large"
                      style={styles.variationInput}
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      style={styles.addButton}
                    >
                      + Add
                    </button>
                  </div>

                  {productData.sizeOptions.length > 0 && (
                    <div style={styles.tagsList}>
                      {productData.sizeOptions.map((size, index) => (
                        <div key={index} style={styles.tag}>
                          <span>{size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(index)}
                            style={styles.removeTagButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Variations */}
                <div style={styles.variationGroup}>
                  <label style={styles.label}>Color Variations</label>
                  <div style={styles.addVariationContainer}>
                    <input
                      type="text"
                      value={tempColor}
                      onChange={(e) => setTempColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                      placeholder="e.g., Red, Blue, Black"
                      style={styles.variationInput}
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      style={styles.addButton}
                    >
                      + Add
                    </button>
                  </div>

                  {productData.colorVariations.length > 0 && (
                    <div style={styles.tagsList}>
                      {productData.colorVariations.map((color, index) => (
                        <div key={index} style={styles.tag}>
                          <span>{color}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            style={styles.removeTagButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.fileInput}
              />
              <p style={styles.helperText}>
                Image will be saved to: <code>/products/[filename]</code>
              </p>
              
              {imagePreview && (
                <div style={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                  <p style={styles.imagePreviewText}>Image Preview</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
              >
                {loading 
                  ? 'Processing...' 
                  : editingProductId 
                    ? '💾 Update Product' 
                    : '➕ Add Product'}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('manage');
                  }}
                  style={styles.cancelButton}
                >
                  ❌ Cancel
                </button>
              )}

              <button
                type="button"
                onClick={resetForm}
                style={styles.resetButton}
              >
                🔄 Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE PRODUCTS TAB */}
      {activeTab === 'manage' && (
        <div style={styles.manageWrapper}>
          <h3 style={styles.sectionTitle}>Product Inventory</h3>
          
          {products.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyStateText}>No products added yet.</p>
              <button
                onClick={() => setActiveTab('add')}
                style={styles.addFirstButton}
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.productId} style={styles.productCard}>
                  {/* Product Image */}
                  <div style={styles.productImageWrapper}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'}
                      alt={product.productName}
                      style={styles.productImage}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop';
                      }}
                    />
                    {product.stockAvailable <= 10 && (
                      <div style={styles.lowStockBadge}>
                        ⚠️ Low Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={styles.productCardContent}>
                    <h4 style={styles.productCardTitle}>{product.productName}</h4>
                    <p style={styles.productCardDesc}>{product.description}</p>

                    <div style={styles.productCardDetails}>
                      <div style={styles.productCardRow}>
                        <span style={styles.detailLabel}>ID:</span>
                        <span style={styles.detailValue}>{product.productId}</span>
                      </div>
                      <div style={styles.productCardRow}>
                        <span style={styles.detailLabel}>Price:</span>
                        <span style={styles.priceValue}>₱{product.price?.toFixed(2)}</span>
                      </div>
                      <div style={styles.productCardRow}>
                        <span style={styles.detailLabel}>Stock:</span>
                        <span style={styles.stockValue}>{product.stockAvailable} units</span>
                      </div>
                      <div style={styles.productCardRow}>
                        <span style={styles.detailLabel}>Supplier:</span>
                        <span style={styles.detailValue}>{product.supplier}</span>
                      </div>
                    </div>

                    {/* Variations */}
                    {product.hasVariations && (
                      <div style={styles.variationsDisplay}>
                        {product.sizeOptions?.length > 0 && (
                          <div style={styles.variationDisplay}>
                            <span style={styles.variationLabel}>Sizes:</span>
                            <div style={styles.variationTags}>
                              {product.sizeOptions.map((size, idx) => (
                                <span key={idx} style={styles.variationTag}>{size}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.colorVariations?.length > 0 && (
                          <div style={styles.variationDisplay}>
                            <span style={styles.variationLabel}>Colors:</span>
                            <div style={styles.variationTags}>
                              {product.colorVariations.map((color, idx) => (
                                <span key={idx} style={styles.variationTag}>{color}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleEditClick(product)}
                        style={styles.editButton}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.productId, product.productName)}
                        style={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    width: '100%',
    padding: '2rem',
    backgroundColor: '#4c1515',
    borderRadius: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '2rem',
  },
  mainTitle: {
    fontSize: '2rem',
    color: '#fe5c03',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: '#c0c0c0',
  },
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#732020',
    color: '#c0c0c0',
    border: '2px solid transparent',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    backgroundColor: '#fe5c03',
    color: '#000',
    borderColor: '#fe5c03',
  },
  formWrapper: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif',
  },
  checkboxGroup: {
    padding: '1rem',
    backgroundColor: '#732020',
    borderRadius: '0.5rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  variationsSection: {
    backgroundColor: '#732020',
    padding: '1.2rem',
    borderRadius: '0.8rem',
    border: '2px solid rgba(254, 92, 3, 0.3)',
  },
  variationsTitle: {
    fontSize: '1.1rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  variationGroup: {
    marginBottom: '1.2rem',
  },
  addVariationContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.8rem',
  },
  variationInput: {
    flex: 1,
    padding: '0.7rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#8a2a2a',
    color: '#f1f1f1',
    fontSize: '0.9rem',
    outline: 'none',
  },
  addButton: {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(254, 92, 3, 0.2)',
    color: '#f1f1f1',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    border: '1px solid rgba(254, 92, 3, 0.4)',
    fontSize: '0.85rem',
  },
  removeTagButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff6b6b',
    fontSize: '1.3rem',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
  },
  fileInput: {
    padding: '0.7rem',
    border: '2px dashed #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  helperText: {
    fontSize: '0.8rem',
    color: '#c0c0c0',
    marginTop: '0.4rem',
  },
  imagePreviewContainer: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  imagePreview: {
    maxWidth: '250px',
    maxHeight: '250px',
    borderRadius: '0.5rem',
    border: '3px solid #fe5c03',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  imagePreviewText: {
    color: '#c0c0c0',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'click'
  }
}

export default ProductManagement;