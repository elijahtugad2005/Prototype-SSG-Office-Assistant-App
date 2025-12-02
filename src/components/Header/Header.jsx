
import styles from './Header.module.css';
function Header() {
  return (
    <header className={styles.header}>
     
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


export default Header