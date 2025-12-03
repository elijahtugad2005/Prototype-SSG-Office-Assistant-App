import { useState, useEffect } from 'react';
import styles from './Header.module.css';

function Header() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down (and not at top) - shrink the header
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsShrunk(true);
      }
      // If scrolling up - show the full header
      else if (currentScrollY < lastScrollY) {
        setIsShrunk(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle the scroll event for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`${styles.header} ${isShrunk ? styles.shrink : ''}`}>
     
      <div className={styles.titleWrapper}>
        <h1 className={styles.ssgtitle}>SUPREME STUDENT GOVERNMENT</h1>
      </div>

      <div className={styles.textContainer}>
        <h1>DAANBANTAYAN CAMPUS</h1>
        <h2>Agujo Medellin Cebu</h2>
      </div>
      
    </header>
  );
}

export default Header;