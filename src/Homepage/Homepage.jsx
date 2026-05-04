import React, { useState, useEffect} from 'react';
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css'; // Import CSS module
import CalendarWidget from '../components/CalendarWidget/CalendarWidget';
import { useRef } from 'react';
function Homepage({ toggleSidebar, sidebarOpen }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [expandedID, setExpandedId] = useState(null);
  const sliderRef = useRef(null);
 
  /* ── Firebase: Products ── */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ productId: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);
 
  /* ── Firebase: Officers ── */
  useEffect(() => {
    const order = {
      "President": 1, "Vice President": 2, "Secretary": 3, "Treasurer": 4,
      "COTE Governor": 5, "COED Governor": 6, "Senator": 7,
      "Multimedia Director": 8, "Multimedia": 9, "Activity Officer": 10,
      "BSHM Representative": 11, "BSIT Representative": 12,
      "BSFI Representative": 13, "BEED MATH Representative": 14,
      "BSED Representative": 15, "BIT Representative": 16, "BSIE Representative": 17,
    };
    const positions = Object.keys(order);
    const unsub = onSnapshot(collection(db, "members"), (snap) => {
      const data = snap.docs
        .map((d) => ({ docId: d.id, ...d.data() }))
        .filter((m) => positions.includes(m.position))
        .sort((a, b) => (order[a.position] || 999) - (order[b.position] || 999));
      setOfficers(data);
    });
    return () => unsub();
  }, []);
 
  /* ── Firebase: Announcements ── */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "announcements"), (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);
 
  /* ── Helpers ── */
  const handleOrderNow = () => navigate('/order', {});
 
  const formatDate = (ds) => {
    if (!ds) return 'Date TBA';
    return new Date(ds).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
 
  const getCategoryLabel = (cat) => (cat || 'General').toUpperCase();
 
  /* ── Icons ── */
  const ShoppingBagIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
  const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  const TwitterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );
  const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
 
  /* ─────────────────────────────────────────── */
  return (
    <div className={styles.pageWrapper}>
 
      {/* ══════════════════════════════════════
          HERO — editorial masthead
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        {/* Slideshow */}
        <div className={styles.slideContainer}>
          {['slide1','slide2','slide3','slide4','slide5','slide6'].map((s) => (
            <div key={s} className={`${styles.slide} ${styles[s]}`}></div>
          ))}
        </div>
        <div className={styles.heroOverlay}></div>
        {/* Diagonal texture */}
        <div className={styles.diagonalTexture}></div>
 
        <div className={styles.heroContentWrapper}>
          <div className={styles.heroContent}>
            {/* Eyebrow label */}
            <span className={styles.heroEyebrow}>Official Student Government Platform</span>
            <h1 className={styles.heroTitle}>SUPREMO<br/>GOBYERNO</h1>
            <div className={styles.heroRule}></div>
            <p className={styles.heroDescription}>
              <em>Centralizing Student Government for a Connected Future.</em>{' '}
              Track, engage, and plan university events with unprecedented efficiency.
            </p>
            <button className={styles.exploreButton}>EXPLORE SERVICES</button>
          </div>
 
          {/* Quick Access */}
          <div className={styles.quickAccessSection}>
            <p className={styles.quickAccessEyebrow}>QUICK ACCESS</p>
            <div className={styles.quickAccessGrid}>
              {[
                { icon: '📦', label: 'Track My Order', action: () => navigate('/track-order') },
                { icon: '👥', label: 'Student Engagement Portal', action: null },
                { icon: '📅', label: 'Event & Activity Planning', action: null },
              ].map(({ icon, label, action }) => (
                <div 
                  key={label} 
                  className={`${styles.quickAccessCard} ${action ? styles.quickAccessCardClickable : ''}`}
                  onClick={action}
                  role={action ? 'button' : 'div'}
                  tabIndex={action ? 0 : undefined}
                >
                  <span className={styles.quickAccessIcon}>{icon}</span>
                  <span className={styles.quickAccessLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      <hr className={styles.sectionRule} />
 
      {/* ══════════════════════════════════════
          PRODUCTS
      ══════════════════════════════════════ */}
      <section className={styles.productsSection}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>CATALOGUE</span>
          <h2 className={styles.sectionTitle}>Our Products</h2>
          <p className={styles.sectionSubtitle}>
            Official lanyards &amp; uniforms for the student body
          </p>
        </header>
 
        {loading ? (
          <p className={styles.stateText}>Loading products…</p>
        ) : products.length === 0 ? (
          <p className={styles.stateText}>No products available at the moment. Check back soon!</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <article key={product.productId} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop'}
                    alt={product.productName}
                    className={styles.productImage}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&h=600&fit=crop'; }}
                  />
                  {product.stockAvailable <= 10 && product.stockAvailable > 0 && (
                    <span className={styles.badgeLow}>Low Stock</span>
                  )}
                  {product.stockAvailable === 0 && (
                    <span className={styles.badgeOut}>Out of Stock</span>
                  )}
                </div>
 
                <div className={styles.productInfo}>
                  <span className={styles.productCategoryLabel}>MERCHANDISE</span>
                  <h3 className={styles.productName}>{product.productName}</h3>
                  {product.description && (
                    <p className={styles.productDescription}>{product.description}</p>
                  )}
 
                  <div className={styles.productMeta}>
                    <span className={styles.price}>₱{product.price?.toFixed(2)}</span>
                    <span className={styles.stock}>{product.stockAvailable || 0} in stock</span>
                  </div>
 
                  {product.sizeOptions?.length > 0 && (
                    <div className={styles.tagRow}>
                      <span className={styles.tagRowLabel}>Sizes</span>
                      {product.sizeOptions.map((s, i) => <span key={i} className={styles.tag}>{s}</span>)}
                    </div>
                  )}
                  {product.colorVariations?.length > 0 && (
                    <div className={styles.tagRow}>
                      <span className={styles.tagRowLabel}>Colors</span>
                      {product.colorVariations.map((c, i) => <span key={i} className={styles.tag}>{c}</span>)}
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
              </article>
            ))}
          </div>
        )}
      </section>
 
      <hr className={styles.sectionRule} />
 
      {/* ══════════════════════════════════════
          ANNOUNCEMENTS — editorial news grid
      ══════════════════════════════════════ */}
      <section className={styles.announcementsSection}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>BULLETIN</span>
          <h2 className={styles.sectionTitle}>Latest Announcements</h2>
          <p className={styles.sectionSubtitle}>Stay updated with recent events and activities</p>
        </header>
 
        {announcements.length === 0 ? (
          <p className={styles.stateText}>No announcements at the moment.</p>
        ) : (
          <div className={styles.announcementsGrid}>
            {/* Featured — first item large */}
            {announcements[0] && (
              <article
                className={`${styles.announcementCard} ${styles.announcementFeatured}`}
                onClick={() => setExpandedId(expandedID === announcements[0].id ? null : announcements[0].id)}
              >
                {announcements[0].imageBase64 && (
                  <div className={styles.announcementFeaturedImage}>
                    <img
                      src={announcements[0].imageBase64}
                      alt={announcements[0].title}
                      className={styles.announcementImage}
                      onError={(e) => { e.target.src = '/AnnouncementPic/default.jpg'; }}
                    />
                    <div className={styles.announcementImageOverlay}></div>
                  </div>
                )}
                <div className={styles.announcementCardBody}>
                  <span className={styles.announcementCategory}>{getCategoryLabel(announcements[0].category)}</span>
                  <h3 className={styles.announcementTitle}>{announcements[0].title}</h3>
                  <p className={styles.announcementDateLine}>
                    <em>{formatDate(announcements[0].eventDate)}{announcements[0].eventTime ? ` · ${announcements[0].eventTime}` : ''}</em>
                  </p>
                  <div className={styles.announcementToggle}>
                    <span>{expandedID === announcements[0].id ? '−' : '+'}</span>
                    <span>{expandedID === announcements[0].id ? 'Collapse' : 'Read More'}</span>
                  </div>
                  {expandedID === announcements[0].id && (
                    <div className={styles.announcementExpanded}>
                      {announcements[0].description && (
                        <p className={styles.announcementExpandedDesc}>{announcements[0].description}</p>
                      )}
                      {announcements[0].venue && (
                        <p className={styles.announcementVenue}>📍 {announcements[0].venue}</p>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )}
 
            {/* Remaining items — list style */}
            <div className={styles.announcementList}>
              {announcements.slice(1).map((ann) => (
                <article
                  key={ann.id}
                  className={styles.announcementListItem}
                  onClick={() => setExpandedId(expandedID === ann.id ? null : ann.id)}
                >
                  <div className={styles.announcementListLeft}>
                    {ann.imageBase64 && (
                      <div className={styles.announcementListThumb}>
                        <img src={ann.imageBase64} alt={ann.title}
                          onError={(e) => { e.target.src = '/AnnouncementPic/default.jpg'; }} />
                      </div>
                    )}
                    <div className={styles.announcementListMeta}>
                      <span className={styles.announcementCategory}>{getCategoryLabel(ann.category)}</span>
                      <h4 className={styles.announcementListTitle}>{ann.title}</h4>
                      <p className={styles.announcementDateLine}>
                        <em>{formatDate(ann.eventDate)}{ann.eventTime ? ` · ${ann.eventTime}` : ''}</em>
                      </p>
                    </div>
                  </div>
                  <div className={styles.announcementListToggle}>
                    {expandedID === ann.id ? '−' : '+'}
                  </div>
 
                  {expandedID === ann.id && (
                    <div className={styles.announcementExpanded}>
                      {ann.description && <p className={styles.announcementExpandedDesc}>{ann.description}</p>}
                      {ann.venue && <p className={styles.announcementVenue}>📍 {ann.venue}</p>}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
 
      <hr className={styles.sectionRule} />
 
      {/* ══════════════════════════════════════
          CALENDAR
      ══════════════════════════════════════ */}
      <section className={styles.calendarSection}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>SCHEDULE</span>
          <h2 className={styles.sectionTitle}>Academic Calendar</h2>
        </header>
        <div className={styles.calendarWrapper}>
          <CalendarWidget />
        </div>
      </section>
 
      <hr className={styles.sectionRule} />
 
      {/* ══════════════════════════════════════
          OFFICERS
      ══════════════════════════════════════ */}
      {officers.length > 0 && (
        <section className={styles.officersSection}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>LEADERSHIP</span>
            <h2 className={styles.sectionTitle}>Meet Our Officers</h2>
            <p className={styles.sectionSubtitle}>
              Dedicated leaders committed to serving our student community
            </p>
          </header>
 
          <div className={styles.officersGrid}>
            {officers.map((officer) => (
              <article key={officer.docId} className={styles.officerCard}>
                <div className={styles.officerImageWrapper}>
                  <img
                    src={officer.image64 || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop'}
                    alt={officer.name}
                    className={styles.officerImage}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop'; }}
                  />
                </div>
                <span className={styles.officerPosition}>{officer.position}</span>
                <h3 className={styles.officerName}>{officer.name}</h3>
                {officer.description && (
                  <p className={styles.officerDescription}>{officer.description}</p>
                )}
                <div className={styles.socialLinks}>
                  <a href={officer.facebookLink || '#'} className={styles.socialLink} target="_blank" rel="noreferrer"><FacebookIcon /></a>
                  <a href={officer.twitterLink || '#'} className={styles.socialLink} target="_blank" rel="noreferrer"><TwitterIcon /></a>
                  <a href={officer.instagramLink || '#'} className={styles.socialLink} target="_blank" rel="noreferrer"><InstagramIcon /></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
 
      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className={styles.footer}>
        <hr className={styles.footerRule} />
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>SUPREMO GOBYERNO</span>
          <p className={styles.footerText}>
            © 2025 Shirio. All rights reserved. &nbsp;|&nbsp; Official Student Government E-Commerce Platform
          </p>
        </div>
      </footer>
 
    </div>
  );
}
 
export default Homepage;

