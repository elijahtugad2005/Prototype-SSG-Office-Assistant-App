import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.jsx'; 
import styles from './Sidebar.module.css';

   function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser, userRole, logout, loading, userName } = useAuth(); 
    const navigate = useNavigate();

    if (loading) {
      return null; 
    }

    const role = currentUser ? (userRole || 'public') : 'public'; 
    const name = currentUser ? (userName || 'user ') : 'name';
    
    const navItems = [
      { to: "/", text: "Home", roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/order", text: "Place Order", roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/admin", text: "Admin Dashboard", roles: ['admin'] },
      { to: "/finance", text: "Finance (WIP)", roles: ['admin'] },
      { to: "/reports", text: "Reports / Uploads", roles: ['admin'] },
      { to: "/inventory", text: "Inventory", roles: ['admin'] },
      { to: "/announcement", text: "Announcements", roles: ['admin', 'secretary'] },
    ];

    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
      setIsOpen(false);
    };

    const handleLinkClick = () => {
      if (window.innerWidth <= 600) {
        closeSidebar();
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
        navigate('/login');
        closeSidebar();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    console.log('Sidebar Debug:', { currentUser, userRole, role, loading });

    return (
      <>
        {/* Hamburger menu button - visible on mobile */}
        {!isOpen && window.innerWidth <= 600 && (
          <button
            className={styles.hamburger}
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        )}
        
        {/* Overlay for mobile when sidebar is open */}
        {isOpen && (
          <div 
            className={styles.overlay} 
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        
        <nav className={`${styles.container} ${isOpen ? styles.open : ''}`}>
          <div className={styles.listContainer}>
            {/* UPDATED: Sidebar header with improved role display */}
            <div className={styles.sidebarHeader}>
              <div className={styles.roleInfo}>
                <p className={styles.roleLabel}>Current Role:</p>
                <div className={styles.roleValue}>
                  {String(role).toUpperCase()}
                </div>
              </div>
              <h3 className={styles.welcomeText}>
                {currentUser ? `Welcome, ${String(name).charAt(0).toUpperCase() + String(name).slice(1)}` : 'Guest Mode'}
              </h3>
              
              <button
                className={styles.closeButton}
                onClick={closeSidebar}
                aria-label="Close Sidebar"
              >
                ✕
              </button>
            </div>
            
            <ul className={styles.navList}>
              {navItems
                .filter(item => item.roles.includes(role))
                .map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => 
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                      }
                      onClick={handleLinkClick}
                    >
                      <span className={styles.linkText}>{item.text}</span>
                    </NavLink>
                  </li>
              ))}
            </ul>
            
            <div className={styles.buttonSection}>
              <button className={styles.sidebarButton}>
                Settings
              </button>
              <button className={styles.sidebarButton}>
                Help & Support
              </button>
              
              {currentUser ? (
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <NavLink 
                  to="/login"
                  className={styles.loginButton}
                  onClick={handleLinkClick}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }

   
  export default Sidebar;