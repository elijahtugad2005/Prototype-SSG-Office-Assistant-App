import { useState } from 'react';
import styles from './admin.module.css';
import Dashboard from './Dashboard';
import MemberDashboard from '../components/MemberDashboard';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import Data from '../components/Data/Data';

function Admin() {
    return (
        <>
            <div className={styles.container}>
           
                <div className={styles.pagetitle}>
                    <h1>ADMIN DASHBOARD</h1>
                </div>


                <div className={styles.member_container}>
                    <ProductManagement />
                     <Data />
                     <MemberDashboard />
                                            
                </div>

            </div>
        </>
    );
}

export default Admin;