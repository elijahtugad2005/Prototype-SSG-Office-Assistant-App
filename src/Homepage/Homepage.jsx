import React, { useState, useEffect} from 'react';
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css'; // Import CSS module
import CalendarWidget from '../components/CalendarWidget/CalendarWidget';
import { useRef } from 'react';
function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [expandedID, setExpandedId] = useState(null);

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

  // ✅ Fetch officers from Firebase
  useEffect(() => {
    const officerPositions = ["President", "Vice President", "Secretary", "Treasurer"];
    
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const officersData = snapshot.docs
        .map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }))
        .filter(member => officerPositions.includes(member.position));

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

  // ✅ Fetch announcements from Firebase
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "announcements"), (snapshot) => {
    const announcementsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Enhanced debugging
    
    
    setAnnouncements(announcementsData);
  }, (error) => {
    console.error("Error fetching announcements:", error);
  });

  return () => unsubscribe();
}, []);

  const handleOrderNow = (product) => {
    navigate('/order', {});
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Event': '#4CAF50',
      'Academic': '#2196F3',
      'Sports': '#FF9800',
      'Cultural': '#9C27B0',
      'General': '#607D8B'
    };
    return colors[category] || '#fe5c03';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };




      const sliderRef = useRef(null);

    const scrollSlider = (direction) => {
      if (sliderRef.current) {
        const scrollAmount = 320; // Width of slide + gap
        sliderRef.current.scrollLeft += direction * scrollAmount;
      }
    };


  // SVG Icons
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
    <div className={styles.pageWrapper}>
      {/* Hero Section */}  
      <section className={styles.heroSection}>
        <div className={styles.slideshowContainer}>
          <div className={`${styles.slide} ${styles.slide1}`}></div>
          <div className={`${styles.slide} ${styles.slide2}`}></div>
          <div className={`${styles.slide} ${styles.slide3}`}></div>
        </div>
            <div className={styles.heroOverlay}></div>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Welcome to Shirio</h1>
                <h2 className={styles.heroSubtitle}>Student Government Made Easier</h2>
                <p className={styles.heroDescription}>
                  A New Innovation to Learn, Collaborate, and Serve the students of Cebu Technological University - Daanbantayan Campus.
                  A project dedicating itself to create system that help students government to Track, Engage and Plan for University Activities and Events.
                  We Provide Commerce, Public Informations and Communication. The New Age Starts Now
                </p>
              </div>
       </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Our Products</h2>
        <p className={styles.sectionSubtitle}>
          Browse our collection of official lanyards and uniforms
        </p>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.noProductsContainer}>
            <p className={styles.noProductsText}>No products available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.productId} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'}
                    alt={product.productName}
                    className={styles.productImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop';
                    }}
                  />
                  {product.stockAvailable <= 10 && product.stockAvailable > 0 && (
                    <div className={styles.lowStockBadge}>Low Stock!</div>
                  )}
                  {product.stockAvailable === 0 && (
                    <div className={styles.outOfStockBadge}>Out of Stock</div>
                  )}
                </div>
                
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.productName}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  
                  <div className={styles.productDetails}>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceLabel}>Price:</span>
                      <span className={styles.price}>₱{product.price?.toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.stockContainer}>
                      <span className={styles.stockLabel}>Stock:</span>
                      <span className={styles.stock}>{product.stockAvailable || 0} available</span>
                    </div>
                  </div>

                  {product.sizeOptions && product.sizeOptions.length > 0 && (
                    <div className={styles.attributeContainer}>
                      <span className={styles.attributeLabel}>Sizes:</span>
                      <div className={styles.attributeTags}>
                        {product.sizeOptions.map((size, idx) => (
                          <span key={idx} className={styles.tag}>{size}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colorVariations && product.colorVariations.length > 0 && (
                    <div className={styles.attributeContainer}>
                      <span className={styles.attributeLabel}>Colors:</span>
                      <div className={styles.attributeTags}>
                        {product.colorVariations.map((color, idx) => (
                          <span key={idx} className={styles.tag}>{color}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleOrderNow(product)}
                    disabled={product.stockAvailable === 0}
                    className={`${styles.orderButton} ${product.stockAvailable === 0 ? styles.orderButtonDisabled : ''}`}
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

          {/* Announcements Section */}
<section className={styles.announcementsSection}>
  <h2 className={styles.sectionTitle}>Latest Announcements</h2>
  <p className={styles.sectionSubtitle}>
    Stay updated with recent events and activities
  </p>

  {announcements.length === 0 ? (
    <div className={styles.noAnnouncementsContainer}>
      <p className={styles.noAnnouncementsText}>No announcements at the moment.</p>
    </div>
  ) : (
    <div className={styles.announcementsSliderContainer}>
      <div className={styles.announcementsSlider} ref={sliderRef}>
        {announcements.map((announcement) => (
          <div key={announcement.id} className={styles.announcementSlide}>
            
            {/* HEADER - Always visible */}
            <div 
              className={styles.announcementHeader}
              onClick={() => setExpandedId(expandedID === announcement.id ? null : announcement.id)}
            >
              <div className={styles.announcementHeaderLeft}>
                <h4 className={styles.announcementTitle}>{announcement.title}</h4>
                <div className={styles.announcementMeta}>
                  <span 
                    className={styles.categoryBadge}
                    style={{ backgroundColor: getCategoryColor(announcement.category) }}
                  >
                    {announcement.category}
                  </span>
                  <span className={styles.announcementDate}>
                    📅 {formatDate(announcement.eventDate)} at {announcement.eventTime}
                  </span>
                </div>
              </div>
              <div className={styles.expandIcon}>
                {expandedID === announcement.id ? '▲' : '▼'}
              </div>
            </div>

            {/* IMAGE - Always visible if exists */}
            {announcement.imageBase64 && (
              <div className={styles.announcementImageWrapper}>
                <img 
                  src={announcement.imageBase64}
                  alt={announcement.title}
                  className={styles.announcementImage}
                  onError={(e) => {
                    e.target.src = '/AnnouncementPic/default.jpg';
                  }}
                />
              </div>
            )}

            {/* EXPANDED CONTENT - Shows on click */}
            
              <div className={styles.announcementBody}>
                
                {/* Description */}
                <div className={styles.announcementDetail}>
                  <strong className={styles.detailLabel}>Description:</strong>
                  <p className={styles.detailValue}>{announcement.description}</p>
                </div>

                {/* Venue */}
                <div className={styles.announcementDetail}>
                  <strong className={styles.detailLabel}>Venue:</strong>
                  <p className={styles.detailValue}>📍 {announcement.venue}</p>
                </div>

              </div>
            
          </div>
        ))}
      </div>
      
      {/* Optional: Add navigation arrows */}
      <button 
        className={`${styles.sliderNav} ${styles.sliderPrev}`}
        onClick={() => scrollSlider(-1)}
        aria-label="Previous announcement"
      >
        ‹
      </button>
      <button 
        className={`${styles.sliderNav} ${styles.sliderNext}`}
        onClick={() => scrollSlider(1)}
        aria-label="Next announcement"
      >
        ›
      </button>
    </div>
  )}
</section>

    {/*Calendar Section */}
    <section style={{ padding: '3rem 2rem', backgroundColor: '#4c1515' }}>
        <CalendarWidget />
      </section>

      {/* Officers Section */}
      {officers.length > 0 && (
        <section className={styles.officersSection}>
          <h2 className={styles.sectionTitle}>Meet Our Officers</h2>
          <p className={styles.sectionSubtitle}>
            Dedicated leaders committed to serving our student community
          </p>
          
          <div className={styles.officersGrid}>
            {officers.map((officer) => (
              <div key={officer.docId} className={styles.officerCard}>
                <div className={styles.officerImageWrapper}>
                  <img 
                    src={
                      officer.image64 
                        ? officer.image64 
                        : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop'
                    }
                    alt={officer.name}
                    className={styles.officerImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';
                    }}
                  />
                </div>

                <h3 className={styles.officerName}>{officer.name}</h3>
                <p className={styles.officerPosition}>{officer.position}</p>
                <p className={styles.officerDescription}>
                  {officer.description || 'No description available.'}
                </p>
                
                <div className={styles.socialLinks}>
                  <a href={officer.facebookLink || "#"} className={styles.socialLink}>
                    <FacebookIcon />
                  </a>
                  <a href={officer.twitterLink || "#"} className={styles.socialLink}>
                    <TwitterIcon />
                  </a>
                  <a href={officer.instagramLink || "#"} className={styles.socialLink}>
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2025 Shirio. All rights reserved. | Official Student Government E-Commerce Platform
        </p>
      </footer>
    </div>
  );
}

export default Homepage;

