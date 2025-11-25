import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Function to handle link clicks on mobile
  const handleLinkClick = () => {
    if (window.innerWidth <= 600) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      <nav className={`${styles.container} ${isOpen ? styles.open : ''}`}>
        <button
          className={styles.hamburger}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          aria-expanded={isOpen}
        >
          ☰
        </button>
        
        <div className={styles.listContainer}>
          <div className={styles.sidebarHeader}>
            <button
              className={styles.closeButton}
              onClick={closeSidebar}
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          </div>
          
          <ul className={styles.navList}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={handleLinkClick}
              >
                <span className={styles.linkText}>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={handleLinkClick}
              >
                <span className={styles.linkText}>Admin</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/finance"
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={handleLinkClick}
              >
                <span className={styles.linkText}>Finance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={handleLinkClick}
              >
                <span className={styles.linkText}>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/announcement"
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={handleLinkClick}
              >
                <span className={styles.linkText}>Announcement</span>
              </NavLink>
            </li>
          </ul>
          
          {/* Additional buttons section */}
          <div className={styles.buttonSection}>
            <button className={styles.sidebarButton}>
              Settings
            </button>
            <button className={styles.sidebarButton}>
              Help & Support
            </button>
            <button className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;