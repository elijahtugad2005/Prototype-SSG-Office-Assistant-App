import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [expandedID, setExpandedId]= useState(null);

  /*FIREBASE*/
  
  // ✅ Fetch products from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch officers from Firebase (for "Meet Our Team" section)
  useEffect(() => {
    const officerPositions = ["President", "Vice President", "Secretary", "Treasurer"];
    
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const officersData = snapshot.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter(member => officerPositions.includes(member.position));

      // Sort by position hierarchy
      const positionOrder = {
        "President": 1,
        "Vice President": 2,
        "Secretary": 3,
        "Treasurer": 4
      };

      officersData.sort((a, b) => {
        return (positionOrder[a.position] || 999) - (positionOrder[b.position] || 999);
      });

      setOfficers(officersData);
    });

    return () => unsubscribe();
  }, []);

  const handleOrderNow = (product) => {
    // Navigate to Order page with product details
    navigate('/order', { });
  };

  // Simple SVG Icons
  const ShoppingBagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}  
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
        
          <h1 style={styles.heroTitle}>Welcome to Shirio</h1>
          <h2 style={styles.heroSubtitle}>Student Government Made Easier</h2>
          <p style={styles.heroDescription}>
            A New Innovation  to Learn, Collaborate, and Serve the students of Cebu Technological University - Daanbantayan Campus
            .A project dedicating itself to create system that help students government to Track,Engage and Plan for University Activities and Events.
            We Provide Commerce, Public Informations and Communication. The New Age of Starts Now
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Our Products</h2>
        <p style={styles.sectionSubtitle}>
          Browse our collection of official lanyards and uniforms
        </p>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.noProductsContainer}>
            <p style={styles.noProductsText}>No products available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div 
                key={product.productId} 
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 92, 3, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
              >
                <div style={styles.productImageWrapper}>
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'}
                    alt={product.productName}
                    style={styles.productImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop';
                    }}
                  />
                  {product.stockAvailable <= 10 && product.stockAvailable > 0 && (
                    <div style={styles.lowStockBadge}>Low Stock!</div>
                  )}
                  {product.stockAvailable === 0 && (
                    <div style={styles.outOfStockBadge}>Out of Stock</div>
                  )}
                </div>
                
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.productName}</h3>
                  <p style={styles.productDescription}>{product.description}</p>
                  
                  <div style={styles.productDetails}>
                    <div style={styles.priceContainer}>
                      <span style={styles.priceLabel}>Price:</span>
                      <span style={styles.price}>₱{product.price?.toFixed(2)}</span>
                    </div>
                    
                    <div style={styles.stockContainer}>
                      <span style={styles.stockLabel}>Stock:</span>
                      <span style={styles.stock}>{product.stockAvailable || 0} available</span>
                    </div>
                  </div>

                  {product.sizeOptions && product.sizeOptions.length > 0 && (
                    <div style={styles.attributeContainer}>
                      <span style={styles.attributeLabel}>Sizes:</span>
                      <div style={styles.attributeTags}>
                        {product.sizeOptions.map((size, idx) => (
                          <span key={idx} style={styles.tag}>{size}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colorVariations && product.colorVariations.length > 0 && (
                    <div style={styles.attributeContainer}>
                      <span style={styles.attributeLabel}>Colors:</span>
                      <div style={styles.attributeTags}>
                        {product.colorVariations.map((color, idx) => (
                          <span key={idx} style={styles.tag}>{color}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleOrderNow(product)}
                    disabled={product.stockAvailable === 0}
                    style={{
                      ...styles.orderButton,
                      ...(product.stockAvailable === 0 ? styles.orderButtonDisabled : {})
                    }}
                    onMouseEnter={(e) => {
                      if (product.stockAvailable > 0) {
                        e.currentTarget.style.backgroundColor = '#ff7035';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.stockAvailable > 0) {
                        e.currentTarget.style.backgroundColor = '#fe5c03';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <ShoppingBagIcon />
                    <span>{product.stockAvailable === 0 ? 'Out of Stock' : 'Order Now'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

        {/*AnnounceMent*/}
          
          <section style={styles.announcementsWrapper}>
              <h3 style={styles.sectionTitle}>All Announcements</h3>
              
              {announcements.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No announcements yet. Create your first one above!</p>
                </div>
              ) : (
                <div style={styles.announcementsList}>
                  {announcements.map((announcement) => (
                    <div key={announcement.id} style={styles.announcementCard}>
                      <div 
                        style={styles.announcementHeader}
                        onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                      >
                        <div style={styles.announcementHeaderLeft}>
                          <h4 style={styles.announcementTitle}>{announcement.title}</h4>
                          <div style={styles.announcementMeta}>
                            <span 
                              style={{
                                ...styles.categoryBadge,
                                backgroundColor: getCategoryColor(announcement.category)
                              }}
                            >
                              {announcement.category}
                            </span>
                            <span style={styles.announcementDate}>
                              📅 {formatDate(announcement.eventDate)} at {announcement.eventTime}
                            </span>
                          </div>
                        </div>
                        <div style={styles.expandIcon}>
                          {expandedId === announcement.id ? '▲' : '▼'}
                        </div>
                      </div>


                                              {/* ADD THIS BLOCK */}
                          {announcement.imageUrl && (
                              <div style={styles.announcementImageWrapper}>
                                  <img 
                                      src={announcement.imageUrl}
                                      alt={announcement.title}
                                      style={styles.announcementImage}
                                      onError={(e) => {
                                          e.target.src = '/AnnouncementPic/default.jpg';
                                      }}
                                  />
                              </div>
                          )}

                      {expandedId === announcement.id && (
                        <div style={styles.announcementBody}>
                          <div style={styles.announcementDetail}>
                            <strong style={styles.detailLabel}>Description:</strong>
                            <p style={styles.detailValue}>{announcement.description}</p>
                          </div>

                          <div style={styles.announcementDetail}>
                            <strong style={styles.detailLabel}>Venue:</strong>
                            <p style={styles.detailValue}>📍 {announcement.venue}</p>
                          </div>
                          
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

      {/* Officers Section */}
      {officers.length > 0 && (
        <section style={styles.officersSection}>
          <h2 style={styles.sectionTitle}>Meet Our Officers</h2>
          <p style={styles.sectionSubtitle}>
            Dedicated leaders committed to serving our student community
          </p>
          
          <div style={styles.officersGrid}>
            {officers.map((officer) => (
              <div 
                key={officer.docId} 
                style={styles.officerCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(254, 92, 3, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.officerImageWrapper}>
                 <img 
                            // 🌟 MODIFIED LOGIC: Check for and use the Base64 string first
                            src={
                                officer.image64 ? officer.image64 // Use Base64 data directly as the source
                                    : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop' // Fallback image
                            }
                            alt={officer.name}
                            style={styles.officerImage}
                            onError={(e) => {
                                // If Base64 somehow fails (rare), fall back to the default image
                                e.target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';
                            }}
                        />
                </div>




                <h3 style={styles.officerName}>{officer.name}</h3>
                <p style={styles.officerPosition}>{officer.position}</p>
                              
                {/* 🌟 NEW: Description Display */}
                <p style={styles.officerDescription}>
                        {officer.description || 'No description available.'}
                    </p>
                
                <div style={styles.socialLinks}>
                  <a href={officer.facebookLink || "#"} style={styles.socialLink}>
                    <FacebookIcon />
                  </a>
                  <a href={officer.twitterLink || "#"} style={styles.socialLink}>
                    <TwitterIcon />
                  </a>
                  <a href={officer.instagramLink || "#"} style={styles.socialLink}>
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Shirio. All rights reserved. | Official Student Government E-Commerce Platform
        </p>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: '100%',
    backgroundColor: '#4c151534',
    minHeight: '100vh',
  },
  heroSection: {
    position: 'relative',
    height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url(images/heroimage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'scroll',
    marginBottom: '20px'
  },
 
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 21, 21, 0.8)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '900px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  heroSubtitle: {
    fontSize: '1.6rem',
    color: '#f1f1f1',
    marginBottom: '1.5rem',
    fontWeight: '300',
  },
  heroDescription: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    lineHeight: '1.8',
    maxWidth: '700px',
    margin: '0 auto',
    fontFamily: 'Arial, san-serif',
  },
  productsSection: {
    padding: '5rem 2rem',
    backgroundColor: '#5a1a1a',
    marginBottom: '10px'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    color: '#fe5c03',
    textAlign: 'center',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#c0c0c0',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
  },
  loadingText: {
    color: '#fe5c03',
    fontSize: '1.2rem',
  },
  noProductsContainer: {
    textAlign: 'center',
    padding: '3rem',
  },
  noProductsText: {
    color: '#c0c0c0',
    fontSize: '1.1rem',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  productCard: {
    backgroundColor: '#732020',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid rgba(254, 92, 3, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  productImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    backgroundColor: '#8a2a2a',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  lowStockBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#ff9800',
    color: '#000',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  productInfo: {
    padding: '1.5rem',
  },
  productName: {
    fontSize: '1.5rem',
    color: '#f1f1f1',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: '0.95rem',
    color: '#c0c0c0',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  productDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(254, 92, 3, 0.2)',
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: '0.85rem',
    color: '#c0c0c0',
    marginBottom: '0.2rem',
  },
  price: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    fontWeight: 'bold',
  },
  stockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: '0.85rem',
    color: '#c0c0c0',
    marginBottom: '0.2rem',
  },
  stock: {
    fontSize: '1rem',
    color: '#f1f1f1',
    fontWeight: '500',
  },
  attributeContainer: {
    marginBottom: '0.8rem',
  },
  attributeLabel: {
    fontSize: '0.9rem',
    color: '#fe5c03',
    fontWeight: '600',
    display: 'block',
    marginBottom: '0.4rem',
  },
  attributeTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: 'rgba(254, 92, 3, 0.2)',
    color: '#f1f1f1',
    padding: '0.3rem 0.7rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    border: '1px solid rgba(254, 92, 3, 0.3)',
  },
  orderButton: {
    width: '100%',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    padding: '1rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  orderButtonDisabled: {
    backgroundColor: '#5a1a1a',
    color: '#7a2a2a',
    cursor: 'not-allowed',
    border: '1px solid #7a2a2a',
  },


  announcementsWrapper: {
  backgroundColor: '#5a1a1a',
  borderRadius: '1rem',
  padding: '2rem',
  border: '1px solid rgba(254, 92, 3, 0.2)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  marginBottom: '10px',
},
sectionTitle: {
  fontSize: '1.5rem',
  color: '#fe5c03',
  marginBottom: '1.5rem',
  fontWeight: 'bold',
  borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
  paddingBottom: '0.5rem',
},
emptyState: {
  textAlign: 'center',
  padding: '3rem',
  backgroundColor: '#732020',
  borderRadius: '0.8rem',
  border: '1px solid rgba(254, 92, 3, 0.1)',
},
emptyText: {
  color: '#c0c0c0',
  fontSize: '1.1rem',
},
announcementsList: {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
},
announcementCard: {
  backgroundColor: '#732020',
  borderRadius: '1rem',
  border: '1px solid rgba(254, 92, 3, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
},
announcementHeader: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  borderBottom: '1px solid rgba(254, 92, 3, 0.1)',
},
announcementHeaderLeft: {
  flex: 1,
},
announcementTitle: {
  fontSize: '1.4rem',
  color: '#f1f1f1',
  marginBottom: '0.8rem',
  fontWeight: 'bold',
},
announcementMeta: {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
},
categoryBadge: {
  padding: '0.4rem 1rem',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  color: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
},
announcementDate: {
  fontSize: '0.95rem',
  color: '#c0c0c0',
  fontWeight: '500',
},
expandIcon: {
  fontSize: '1.3rem',
  color: '#fe5c03',
  marginLeft: '1rem',
  transition: 'transform 0.3s ease',
},
announcementImageWrapper: {
  width: '100%',
  height: '300px',
  overflow: 'hidden',
  backgroundColor: '#8a2a2a',
  position: 'relative',
},
announcementImage: {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
},
announcementBody: {
  padding: '1.5rem',
  backgroundColor: '#8a2a2a',
  borderTop: '2px solid rgba(254, 92, 3, 0.2)',
},
announcementDetail: {
  marginBottom: '1.5rem',
  padding: '1rem',
  backgroundColor: '#9a3a3a',
  borderRadius: '0.5rem',
  borderLeft: '4px solid #fe5c03',
},
detailLabel: {
  color: '#fe5c03',
  fontSize: '1rem',
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
},
detailValue: {
  color: '#f1f1f1',
  fontSize: '1rem',
  lineHeight: '1.7',
  margin: 0,
},
announcementActions: {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
  paddingTop: '1.5rem',
  borderTop: '1px solid rgba(254, 92, 3, 0.2)',
},
editButton: {
  flex: 1,
  padding: '0.9rem',
  backgroundColor: '#fe5c03',
  color: '#000',
  border: 'none',
  borderRadius: '50px',
  fontSize: '0.95rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
},
deleteButton: {
  flex: 1,
  padding: '0.9rem',
  backgroundColor: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '50px',
  fontSize: '0.95rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
},
  officersSection: {
    padding: '5rem 2rem',
    backgroundColor: '#4c1515',
  },
  officersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  officerCard: {
    backgroundColor: '#732020',
    borderRadius: '1rem',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid rgba(254, 92, 3, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  officerImageWrapper: {
    width: '120px',
    height: '120px',
    margin: '0 auto 1.2rem',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #fe5c03',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  officerImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  officerName: {
    fontSize: '1.2rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: 'bold',
  },
  officerPosition: {
    fontSize: '0.95rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: '500',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.8rem',
  },
  socialLink: {
    color: '#f1f1f1',
    padding: '0.4rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(254, 92, 3, 0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#3a1010',
    padding: '2rem',
    textAlign: 'center',
  },
  footerText: {
    color: '#c0c0c0',
    fontSize: '0.95rem',
  },

  officerDescription: {
        fontSize: '0.9em',
        color: '#ffe5e5ff',
        margin: '10px 0 15px',
        lineHeight: '1.4em', // Defines line height
        maxHeight: '4.2em', // Limits height to approx. 3 lines (1.4em * 3)
        overflow: 'hidden', // Crops text if it exceeds maxHeight
        textAlign: 'center',
        padding: '0 15px',
    },
};

export default Homepage;