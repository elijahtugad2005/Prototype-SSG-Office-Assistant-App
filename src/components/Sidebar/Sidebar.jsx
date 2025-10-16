import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
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
        <img src="/path/to/logo.png" alt="Sidebar Logo" className={styles.logo} />
        <button
          className={styles.closeButton}
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          ✕
        </button>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/finance"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Finance
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/announcement"
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              Announcement
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;