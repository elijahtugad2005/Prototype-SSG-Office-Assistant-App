import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.jsx'; 
import styles from './Sidebar.module.css';

   function Sidebar({ isOpen, toggleSidebar }) {
    const { currentUser, userRole, logout, loading, userName } = useAuth(); 
    const navigate = useNavigate();

    if (loading) {
      return null; 
    }

    const role = currentUser ? (userRole || 'public') : 'public'; 
    const name = currentUser ? (userName || 'user ') : 'name';
    
    const navItems = [
      { to: "/", text: "Home", icon: "🏠", roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/order", text: "Place Order", icon: "🛒", roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/admin", text: "Admin Dashboard", icon: "📊", roles: ['admin'] },
      { to: "/finance", text: "Finance", icon: "💰", roles: ['admin' , 'secretary'] },
      { to: "/reports", text: "Reports", icon: "📄", roles: ['admin'] },
      { to: "/inventory", text: "Inventory", icon: "📦", roles: ['admin' , 'representative'] },
      { to: "/announcement", text: "Announcements", icon: "📢", roles: ['admin', 'secretary', 'representative'] },
      { to: "/documents", text: "Documents", icon: "📁", roles: ['admin', 'secretary', 'representative'] }
    ];

    const closeSidebar = () => {
      if (window.innerWidth <= 768) {
        toggleSidebar();
      }
    };

    const handleLinkClick = () => {
      if (window.innerWidth <= 768) {
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

    return (
      <>
        {/* Mobile floating toggle button */}
        <button
          className={styles.mobileToggle}
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Overlay when sidebar is open */}
        {isOpen && (
          <div 
            className={styles.overlay} 
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        
        <nav className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}>
          <div className={styles.listContainer}>
            {/* Sidebar header */}
            <div className={styles.sidebarHeader}>
              <div className={styles.logoSection}>
                <button
                  className={styles.logoToggleButton}
                  onClick={toggleSidebar}
                  aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                  title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  <div className={styles.logo}>SSG</div>
                </button>
                {isOpen && <h2 className={styles.logoText}>Supremo Gobyerno</h2>}
              </div>
              
              {isOpen && (
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {String(name).charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.userDetails}>
                    <p className={styles.userName}>{currentUser ? String(name).charAt(0).toUpperCase() + String(name).slice(1) : 'Guest'}</p>
                    <span className={styles.userRole}>{String(role).toUpperCase()}</span>
                  </div>
                </div>
              )}
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
                      title={!isOpen ? item.text : ''}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      {isOpen && <span className={styles.linkText}>{item.text}</span>}
                    </NavLink>
                  </li>
              ))}
            </ul>
            
            <div className={styles.buttonSection}>
              {currentUser ? (
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  title={!isOpen ? 'Logout' : ''}
                >
                  <span className={styles.navIcon}>🚪</span>
                  {isOpen && <span>Logout</span>}
                </button>
              ) : (
                <NavLink 
                  to="/login"
                  className={styles.loginButton}
                  onClick={handleLinkClick}
                  title={!isOpen ? 'Login' : ''}
                >
                  <span className={styles.navIcon}>🔑</span>
                  {isOpen && <span>Login</span>}
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }

   
  export default Sidebar;