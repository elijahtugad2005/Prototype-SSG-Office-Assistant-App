
import styles from './Header.module.css';
import logotext from '../assets/logotext.png'
function Header() {
  return (
    <header className={styles.header}>
     
       <div className={styles.logo}>
        <img src= {logotext} className = {styles.img} alt="SSG Logo" />
      </div>

      <div className={styles.textContainer}>
        <h1>DAANBANTAYAN CAMPUS</h1>
        <h2>Agujo Medellin Cebu</h2>
      </div>
      
    
    </header>
  );
}


export default Header