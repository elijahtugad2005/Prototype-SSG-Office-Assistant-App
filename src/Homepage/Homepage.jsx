import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";

function Homepage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState('');
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch officers from Firebase
  useEffect(() => {
    // Query only members with officer positions (President, VP, Secretary, Treasurer)
    const officerPositions = ["President", "Vice President", "Secretary", "Treasurer"];
    
    const q = query(
      collection(db, "members"),
      where("position", "in", officerPositions)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const officersData = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      // Sort officers by position hierarchy
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
      setLoading(false);
    }, (error) => {
      console.error("Error fetching officers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setSubmitStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Simple SVG Icons
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

  const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M22 7l-10 7L2 7"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );

  const MapPinIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
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
            Shirio is built to bridge the gap between student leaders and their communities. 
            Our platform empowers transparency, simplifies governance, and fosters meaningful 
            engagement. With tools designed for efficiency and collaboration, we're transforming 
            how student governments operate—making leadership accessible, accountable, and impactful.
          </p>
        </div>
      </section>

      {/* Officers Section */}
      <section style={styles.officersSection}>
        <h2 style={styles.sectionTitle}>Meet Our Officers</h2>
        <p style={styles.sectionSubtitle}>
          Dedicated leaders committed to serving our student community
        </p>
        
        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading officers...</p>
          </div>
        ) : officers.length === 0 ? (
          <div style={styles.noOfficersContainer}>
            <p style={styles.noOfficersText}>No officers added yet.</p>
          </div>
        ) : (
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
                    src={
                      officer.photoPath 
                        ? officer.photoPath.startsWith('/studentpics/')
                          ? officer.photoPath
                          : `/studentpics/${officer.photoPath}`
                        : '/studentpics/default.jpg'
                    }
                    alt={officer.name}
                    style={styles.officerImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';
                    }}
                  />
                </div>
                <h3 style={styles.officerName}>{officer.name}</h3>
                <p style={styles.officerPosition}>{officer.position}</p>
                {officer.address && (
                  <p style={styles.officerAddress}>{officer.address}</p>
                )}
                <div style={styles.socialLinks}>
                  <a 
                    href={officer.facebook || "#"} 
                    style={styles.socialLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fe5c03';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(254, 92, 3, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FacebookIcon />
                  </a>
                  <a 
                    href={officer.twitter || "#"} 
                    style={styles.socialLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fe5c03';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(254, 92, 3, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <TwitterIcon />
                  </a>
                  <a 
                    href={officer.instagram || "#"} 
                    style={styles.socialLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fe5c03';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(254, 92, 3, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section style={styles.contactSection}>
        <div style={styles.contactContainer}>
          <div style={styles.contactInfo}>
            <h2 style={styles.contactTitle}>Get in Touch</h2>
            <p style={styles.contactDescription}>
              Have questions or suggestions? We'd love to hear from you. 
              Reach out to us and we'll respond as soon as possible.
            </p>
            <div style={styles.contactDetails}>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <MailIcon />
                </div>
                <div>
                  <h4 style={styles.contactItemTitle}>Email</h4>
                  <p style={styles.contactItemText}>ssg@shirio.edu</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <PhoneIcon />
                </div>
                <div>
                  <h4 style={styles.contactItemTitle}>Phone</h4>
                  <p style={styles.contactItemText}>+63 123 456 7890</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>
                  <MapPinIcon />
                </div>
                <div>
                  <h4 style={styles.contactItemTitle}>Office</h4>
                  <p style={styles.contactItemText}>Student Center, 2nd Floor</p>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.contactFormWrapper}>
            <div style={styles.contactForm}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={styles.formInput}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                style={styles.formInput}
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows="5"
                style={{...styles.formInput, ...styles.formTextarea}}
              />
              <button 
                onClick={handleSubmit} 
                style={styles.submitButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff7035';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fe5c03';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Send Message
              </button>
              {submitStatus && (
                <p style={styles.successMessage}>{submitStatus}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Shirio. All rights reserved. | Building transparent governance together.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: '100%',
    backgroundColor: '#4c1515',
    minHeight: '100vh',
  },
  heroSection: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
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
    fontSize: '4rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  heroSubtitle: {
    fontSize: '1.8rem',
    color: '#f1f1f1',
    marginBottom: '2rem',
    fontWeight: '300',
  },
  heroDescription: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    lineHeight: '1.8',
    maxWidth: '800px',
    margin: '0 auto',
  },
  officersSection: {
    padding: '5rem 2rem',
    backgroundColor: '#5a1a1a',
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
  noOfficersContainer: {
    textAlign: 'center',
    padding: '3rem',
  },
  noOfficersText: {
    color: '#c0c0c0',
    fontSize: '1.1rem',
  },
  officersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    cursor: 'pointer',
  },
  officerImageWrapper: {
    width: '150px',
    height: '150px',
    margin: '0 auto 1.5rem',
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
    fontSize: '1.4rem',
    color: '#f1f1f1',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  officerPosition: {
    fontSize: '1rem',
    color: '#fe5c03',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  officerAddress: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
    marginBottom: '1.5rem',
    fontStyle: 'italic',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  socialLink: {
    color: '#f1f1f1',
    padding: '0.5rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(254, 92, 3, 0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  contactSection: {
    padding: '5rem 2rem',
    backgroundColor: '#4c1515',
  },
  contactContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
  },
  contactInfo: {
    color: '#f1f1f1',
  },
  contactTitle: {
    fontSize: '2.5rem',
    color: '#fe5c03',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  contactDescription: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '2rem',
    color: '#c0c0c0',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  contactIcon: {
    color: '#fe5c03',
    marginTop: '0.2rem',
  },
  contactItemTitle: {
    fontSize: '1.1rem',
    color: '#fe5c03',
    marginBottom: '0.3rem',
  },
  contactItemText: {
    fontSize: '1rem',
    color: '#c0c0c0',
  },
  contactFormWrapper: {
    backgroundColor: '#5a1a1a',
    padding: '2rem',
    borderRadius: '1rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  contactForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formInput: {
    padding: '1rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
    outline: 'none',
  },
  formTextarea: {
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'Arial, sans-serif',
  },
  submitButton: {
    backgroundColor: '#fe5c03',
    color: '#000000',
    border: 'none',
    padding: '1rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  successMessage: {
    color: '#4ade80',
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '0.95rem',
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
};

export default Homepage;