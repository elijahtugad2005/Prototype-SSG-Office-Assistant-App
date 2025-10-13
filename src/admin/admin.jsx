import { useState } from 'react';
import styles from './admin.module.css';
import Dashboard from './Dashboard';


function admin (){

    return (

     



        <div className={styles.container}>
           
            <div className={styles.pagetitle}>
                <h1>ADMIN DASHBOARD</h1>
            </div>

            <div className={styles.dashboard}>
                <Dashboard />
            </div>
        </div>
    
    );
}

export default admin;