import React from 'react';
import styles from './WorkinProgress.module.css';

function WorkinProgress() {
  return (
    <div className={styles.adminPage}>
      <img src="/images/platelets.png" alt="" />
      <h2>Work in Progress 0w0</h2>
      <p>Opps Page Not Found</p>
      {/* Add admin-specific content here, e.g., forms, tables */}
    </div>
  );
}

export default WorkinProgress;