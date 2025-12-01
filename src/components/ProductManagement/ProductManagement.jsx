import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import styles from './productmanagement.module.css';

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
    supplier: '',
    price: 0,
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
// HANDLE IMAGE UPLOAD (Using Compression)
// ========================================
const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
        setProductData(prev => ({ ...prev, imageBase64: '' }));
        setImagePreview(null);
        return;
    }

    // Input validation (remains the same)
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    // Check size *before* compression to give early feedback for huge files
    // If the file is > 5MB, we might skip processing to save user time.
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB before processing.');
        // We will still attempt compression, but warn the user.
    }
    
    try {
        // CALL THE COMPRESSION FUNCTION
        const compressedBase64 = await CompressImage(file, 1000, 0.8);

        // Update state with the COMPRESSED Base64 string
        setProductData(prev => ({
            ...prev,
            imageBase64: compressedBase64,
        }));
        
        // Set the image preview
        setImagePreview(compressedBase64);

    } catch (error) {
        console.error("Error during image compression:", error);
        alert("Failed to process image. Please try a different file.");
        setProductData(prev => ({ ...prev, imageBase64: '' }));
        setImagePreview(null);
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
        imageUrl: productData.imageBase64 || '/products/default.jpg',
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
  // ========================================
// HANDLE EDIT PRODUCT
// ========================================
const handleEditClick = (product) => {
    // 1. CRITICAL: Set the editingProductId to the Firestore Document ID (docId)
    setEditingProductId(product.docId);

    // 2. Populate the productData state with the selected product's details
    setProductData({
        // Spread the main document fields
        productName: product.productName,
        stockAvailable: product.stockAvailable,
        hasVariations: product.hasVariations,
        description: product.description,
        price: product.price,
        supplier: product.supplier,
        
        // Ensure array fields are present, defaulting to empty arrays if null/undefined
        sizeOptions: product.sizeOptions || [],
        colorVariations: product.colorVariations || [],

        // Set the image data
        imageBase64: product.imageBase64 || '',
        
        // The original custom productId field (optional, but good for display/history)
        productId: product.productId, 
        
        // Reset file to null as a file input cannot be programmatically set
        imageFile: null, 
    });
    
    // 3. Set the image preview from the Base64 string
    setImagePreview(product.imageBase64);

    // 4. Switch to the 'add/edit' tab and scroll to top
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
      imageBase64: productData.imageBase64 || '/products/default.jpg', // ✅ FIXED: was imagePath
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(productRef, updatedProduct);

    alert('✅ Product updated successfully!');

    resetForm();
    setEditingProductId(null);
    setActiveTab('manage');

  } catch (error) {
    console.error('Error updating product:', error);
    alert('Error updating product. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ========================================
// HANDLE DELETE PRODUCT - FIXED
// ========================================
const handleDeleteProduct = async (docId, productName) => { // ✅ FIXED: parameter name
  if (!window.confirm(`Are you sure you want to delete "${productName}"?\nThis action cannot be undone.`)) {
    return;
  }

  try {
    await deleteDoc(doc(db, 'products', docId)); // ✅ FIXED: use docId
    alert('🗑️ Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product. Please try again.');
  }
};




    useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        docId: doc.id,           // ✅ Firestore document ID
        productId: doc.data().productId, // ✅ Your custom ID
        ...doc.data(),
      }));
      setProducts(productsData);
    }, (error) => {
      console.error('Error fetching products:', error);
    });

    return () => unsubscribe();
  }, []);

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
      imageBase64: '',
    });
    setImagePreview(null);
    setTempSize('');
    setTempColor('');
    setEditingProductId(null);
  };


  // ========================================
// IMAGE COMPRESSION UTILITY
// ========================================

/**
 * Compresses an image file (e.g., JPEG) using the Canvas API to generate 
 * a smaller Base64 string, helping to keep it under Firestore's 1MB limit.
 * @param {File} file - The original image file selected by the user.
 * @param {number} maxWidth - Maximum width for the resized image.
 * @param {number} quality - JPEG quality (0.0 to 1.0).
 * @returns {Promise<string>} A promise that resolves with the compressed Base64 Data URL.
 */
const CompressImage = (file, maxWidth = 1000, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // 1. Create a canvas element
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 2. Calculate new dimensions if image exceeds maxWidth
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // 3. Draw the image onto the canvas with new dimensions
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 4. Generate the new Base64 string (JPEG) with compression quality
                // The output format is 'image/jpeg' to ensure maximum compression.
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

                // Simple check: If the resulting string is still too large, 
                // you might need to try lower quality or a smaller maxWidth.
                // We'll trust the 1000px/0.8 setting is usually enough.
                if (compressedBase64.length > 1024 * 1024) {
                    console.warn("Base64 string still exceeds 1MB after compression. Consider lowering quality or resizing further.");
                }

                resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};






  // ========================================
  // RENDER
  // ========================================
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Product Management</h2>
        <p className={styles.headerSubtitle}>Manage lanyards, uniforms and other products</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('add')}
          className={{
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
          className={{
            ...styles.tab,
            ...(activeTab === 'manage' ? styles.tabActive : {})
          }}
        >
          📦 Manage Products ({products.length})
        </button>
      </div>

      {/* ADD/EDIT PRODUCT FORM */}
      {activeTab === 'add' && (
        <div className={styles.formWrapper}>
          <h3 className={styles.sectionTitle}>
            {editingProductId ? 'Edit Product Details' : 'Add New Product'}
          </h3>

          <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct} className={styles.form}>
            
            {/* Product Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Name *</label>
              <input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="e.g., COED Lanyard"
                className={styles.input}
                required
              />
            </div>

            {/* Stock and Price */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  name="stockAvailable"
                  value={productData.stockAvailable}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 100"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Price (₱) *</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 150.00"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {/* Supplier */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Supplier Name *</label>
              <input
                type="text"
                name="supplier"
                value={productData.supplier}
                onChange={handleChange}
                placeholder="e.g., ABC Manufacturing Inc."
                className={styles.input}
                required
              />
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Description *</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                placeholder="Describe the product features, materials, etc."
                rows="4"
                className={styles.textarea}
                required
              />
            </div>

            {/* Has Variations Checkbox */}
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="hasVariations"
                  checked={productData.hasVariations}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>This product has variations (sizes/colors)</span>
              </label>
            </div>

            {/* Variations Section - Only show if hasVariations is true */}
            {productData.hasVariations && (
              <div className={styles.variationsSection}>
                <h4 className={styles.variationsTitle}>Product Variations</h4>

                {/* Size Options */}
                <div className={styles.variationGroup}>
                  <label className={styles.label}>Size Options</label>
                  <div className={styles.addVariationContainer}>
                    <input
                      type="text"
                      value={tempSize}
                      onChange={(e) => setTempSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                      placeholder="e.g., Small, Medium, Large"
                      className={styles.variationInput}
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className={styles.addButton}
                    >
                      + Add
                    </button>
                  </div>

                  {productData.sizeOptions.length > 0 && (
                    <div className={styles.tagsList}>
                      {productData.sizeOptions.map((size, index) => (
                        <div key={index} className={styles.tag}>
                          <span>{size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(index)}
                            className={styles.removeTagButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Variations */}
                <div className={styles.variationGroup}>
                  <label className={styles.label}>Color Variations</label>
                  <div className={styles.addVariationContainer}>
                    <input
                      type="text"
                      value={tempColor}
                      onChange={(e) => setTempColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                      placeholder="e.g., Red, Blue, Black"
                      className={styles.variationInput}
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className={styles.addButton}
                    >
                      + Add
                    </button>
                  </div>

                  {productData.colorVariations.length > 0 && (
                    <div className={styles.tagsList}>
                      {productData.colorVariations.map((color, index) => (
                        <div key={index} className={styles.tag}>
                          <span>{color}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(index)}
                            className={styles.removeTagButton}
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
            <div className={styles.formGroup}>
              <label className={styles.label}>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              <p className={styles.helperText}>
                Image will be saved to: <code>/products/[filename]</code>
              </p>
              
              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <p className={styles.imagePreviewText}>Image Preview</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                className={{
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
                  className={styles.cancelButton}
                >
                  ❌ Cancel
                </button>
              )}

              <button
                type="button"
                onClick={resetForm}
                className={styles.resetButton}
              >
                🔄 Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE PRODUCTS TAB */}
      {activeTab === 'manage' && (
        <div className={styles.manageWrapper}>
          <h3 className={styles.sectionTitle}>Product Inventory</h3>
          
          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>No products added yet.</p>
              <button
                onClick={() => setActiveTab('add')}
                className={styles.addFirstButton}
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product.docId} className={styles.productCard}>
                  {/* Product Image */}
                  <div className={styles.productImageWrapper}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'}
                      alt={product.productName}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop';
                      }}
                    />
                    {product.stockAvailable <= 10 && (
                      <div className={styles.lowStockBadge}>
                        ⚠️ Low Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={styles.productCardContent}>
                    <h4 className={styles.productCardTitle}>{product.productName}</h4>
                    <p className={styles.productCardDesc}>{product.description}</p>

                    <div className={styles.productCardDetails}>
                      <div className={styles.productCardRow}>
                        <span className={styles.detailLabel}>ID:</span>
                        <span className={styles.detailValue}>{product.productId}</span>
                      </div>
                      <div className={styles.productCardRow}>
                        <span className={styles.detailLabel}>Price:</span>
                        <span className={styles.priceValue}>₱{product.price?.toFixed(2)}</span>
                      </div>
                      <div className={styles.productCardRow}>
                        <span className={styles.detailLabel}>Stock:</span>
                        <span className={styles.stockValue}>{product.stockAvailable} units</span>
                      </div>
                      <div className={styles.productCardRow}>
                        <span className={styles.detailLabel}>Supplier:</span>
                        <span className={styles.detailValue}>{product.supplier}</span>
                      </div>
                    </div>

                    {/* Variations */}
                    {product.hasVariations && (
                      <div className={styles.variationsDisplay}>
                        {product.sizeOptions?.length > 0 && (
                          <div className={styles.variationDisplay}>
                            <span className={styles.variationLabel}>Sizes:</span>
                            <div className={styles.variationTags}>
                              {product.sizeOptions.map((size, idx) => (
                                <span key={idx} className={styles.variationTag}>{size}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.colorVariations?.length > 0 && (
                          <div className={styles.variationDisplay}>
                            <span className={styles.variationLabel}>Colors:</span>
                            <div className={styles.variationTags}>
                              {product.colorVariations.map((color, idx) => (
                                <span key={idx} className={styles.variationTag}>{color}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => handleEditClick(product)}
                        className={styles.editButton}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.docId, product.productName)}
                        className={styles.deleteButton}
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


export default ProductManagement;