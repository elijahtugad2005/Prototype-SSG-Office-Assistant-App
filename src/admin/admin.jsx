import { useState } from 'react';
import styles from './admin.module.css';
import Dashboard from './Dashboard';
import MemberDashboard from '../components/MemberDashboard';
import ProductManagement from '../components/ProductManagement/ProductManagement';

function admin (){

    return (

        <>
            <div className={styles.container}>
           
            <div className={styles.pagetitle}>
                <h1>ADMIN DASHBOARD</h1>
            </div>

            <div className={styles.dashboard}>
                <Dashboard />
            </div>

            <div className ={styles.member_container}>  
                <MemberDashboard />
            </div>

            <div>
                <ProductManagement></ProductManagement>
            </div>
        </div>
        </>
        
    
    );
}

export default admin;