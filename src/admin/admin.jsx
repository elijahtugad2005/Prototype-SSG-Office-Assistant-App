
import { useState } from 'react';
import styles from './admin.module.css';
import MemberDashboard from '../components/MemberDashboard';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import Data from '../components/Data/OrderManagement.jsx';

function Admin() {
    return (
        <div className={styles.container}>
            {/* 1. Page Title */}
            <header className={styles.pagetitle}>
                <h1>Admin Dashboard</h1>
                <h2>Welcome back, Administrator</h2>
            </header>

            {/* 2. Main Metric Cards (Example: Sales, Users, Orders) */}
            

            {/* 3. Large Management Components (Tables, Forms, etc.) */}
            <div className={styles.member_container}>
                {/* Apply the general card styling for a unified look */}
                <div className={styles.dashboard_card}>
                    <ProductManagement />
                </div>
                
                <div className={styles.dashboard_card}>
                    <Data /> {/* Order Management */}
                </div>
                
                <div className={styles.dashboard_card}>
                    <MemberDashboard />
                </div>
            </div>

        </div>
    );
}

export default Admin;