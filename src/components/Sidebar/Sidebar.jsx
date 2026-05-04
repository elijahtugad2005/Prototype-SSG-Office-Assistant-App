import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.jsx'; 
import styles from './Sidebar.module.css';
// Professional icon imports from react-icons
import { 
  HiHome, 
  HiShoppingCart, 
  HiChartBar, 
  HiCurrencyDollar, 
  HiDocumentText, 
  HiCube, 
  HiSpeakerphone, 
  HiFolder,
  HiLogout,
  HiLogin,
  HiSearch,
  HiShoppingBag
} from 'react-icons/hi';
import { RiGovernmentFill } from 'react-icons/ri';

   function Sidebar({ isOpen, toggleSidebar }) {
    const { currentUser, userRole, logout, loading, userName } = useAuth(); 
    const navigate = useNavigate();

    if (loading) {
      return null; 
    }

    const role = currentUser ? (userRole || 'public') : 'public'; 
    const name = currentUser ? (userName || 'user ') : 'name';
    
    const navItems = [
      { to: "/", text: "Home", icon: HiHome, roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/order", text: "Place Order", icon: HiShoppingCart, roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/track-order", text: "Track Order", icon: HiSearch, roles: ['public', 'admin', 'secretary', 'representative'] },
      { to: "/admin", text: "Admin Dashboard", icon: HiChartBar, roles: ['admin'] },
      { to: "/commerce", text: "Commerce Hub", icon: HiShoppingBag, roles: ['admin', 'representative'] },
      { to: "/finance", text: "Finance", icon: HiCurrencyDollar, roles: ['admin' , 'secretary'] },
      { to: "/reports", text: "Reports", icon: HiDocumentText, roles: ['admin'] },
      { to: "/inventory", text: "Inventory", icon: HiCube, roles: ['admin' , 'representative'] },
      { to: "/announcement", text: "Announcements", icon: HiSpeakerphone, roles: ['admin', 'secretary', 'representative'] },
      { to: "/documents", text: "Documents", icon: HiFolder, roles: ['admin', 'secretary', 'representative'] }
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
                  <div className={styles.logo}>
                    <RiGovernmentFill className={styles.logoIcon} />
                  </div>
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
                .map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => 
                          isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                        onClick={() => {
                          /* Auto-close sidebar on any nav click */
                          if (isOpen) toggleSidebar();
                        }}
                        title={!isOpen ? item.text : ''}
                      >
                        <IconComponent className={styles.navIcon} />
                        {isOpen && <span className={styles.linkText}>{item.text}</span>}
                      </NavLink>
                    </li>
                  );
              })}
            </ul>
            
            <div className={styles.buttonSection}>
              {currentUser ? (
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                  title={!isOpen ? 'Logout' : ''}
                >
                  <HiLogout className={styles.navIcon} />
                  {isOpen && <span>Logout</span>}
                </button>
              ) : (
                <NavLink 
                  to="/login"
                  className={styles.loginButton}
                  onClick={() => { if (isOpen) toggleSidebar(); }}
                  title={!isOpen ? 'Login' : ''}
                >
                  <HiLogin className={styles.navIcon} />
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