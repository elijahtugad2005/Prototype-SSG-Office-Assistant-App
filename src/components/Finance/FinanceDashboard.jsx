import React from 'react';
import BudgetManager from '../BudgetManager/BudgetManagement.jsx'; // Adjust path as needed
import BudgetAnalytics from '../BudgetAnalytics/BudgetAnalytics.jsx'; // Adjust path as needed
import styles from './FinanceDashboard.module.css';
import BudgetForm from '../BudgetForm/BudgetForm.jsx';

/**
 * @component
 * @description Combines Budget Analytics and Budget Management into a single,
 * cohesive Finance dashboard view for easy integration into App.jsx routes.
 */
const FinanceDashboard = () => {
  return (
    <div className={styles.financeDashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.mainTitle}> Financial Control Center</h1>
        <p className={styles.subtitle}>
          Visualize, manage, and audit all organizational budget allocations.
        </p>
      </header>
      
      {/* The Budget Analytics component provides the overview and graphs */}
      <section className={styles.analyticsSection}>
        <BudgetAnalytics />
      </section>


      <section className = {styles.formSection}>
        <BudgetForm/>
      </section>

      {/* The Budget Manager component provides the editing and deletion interface */}
      <section className={styles.managerSection}>
        <BudgetManager />
      </section>
      
    </div>
  );
};

export default FinanceDashboard;