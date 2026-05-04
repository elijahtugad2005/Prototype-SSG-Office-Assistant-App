// --- CORE IMPORTS ---
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

// --- CONTEXT IMPORTS ---
import { AuthProvider } from './components/AuthContext/AuthContext.jsx'; // Make sure this path is correct
import { InventoryProvider , useInventory } from './components/InventoryContext/InventoryProvider.jsx'; 
import { FinanceProvider } from './components/FinanceContext/FinanceProvider.jsx';
import { ThemeProvider } from './contexts/ThemeContext';

// --- COMPONENT IMPORTS (Your Original Files) ---
import AdminPage from './admin/admin.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import WorkinProgress from './components/WorkinProgress/WorkinProgress.jsx';
import Homepage from './Homepage/Homepage.jsx';
import Order from './components/Order/order.jsx';
import TrackOrder from './components/TrackOrder/TrackOrder.jsx';
import CommerceHub from './components/CommerceHub/CommerceHub.jsx';
import Announcement from './components/Announcement.jsx';
import ClassUpload from './components/ClassUpload.jsx';
import Login from './components/Login/Login.jsx'; 
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes.jsx'; 
import FinanceDashboard from './components/Finance/FinanceDashboard.jsx';
import InventoryManagement from './components/InventoryDashboard/InventoryManagement.jsx';
import PDFDashboard from './components/Document/PDFDahsboard.jsx';
// --- STYLES ---
import './styles/themes.css';

import styles from './App.module.css';


// --- LAYOUT COMPONENT ---
// This preserves your exact design for dashboard pages
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(
    window.innerWidth > 768 // Open by default on desktop
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.app}>
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`${styles.contentWrapper} ${!sidebarOpen ? styles.contentWrapperSidebarClosed : ''}`}>
          {React.cloneElement(children, { toggleSidebar, sidebarOpen })}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    // NOTE: Removed <BrowserRouter> and <CardProvider> here as they are now in main.jsx
    <ThemeProvider>
      <AuthProvider> 
        <InventoryProvider> 
        <FinanceProvider>
        <Routes>
        {/* ========================================
            PUBLIC ROUTES (No Sidebar/Header)
            ======================================== */}
        <Route path="/login" element={<Login />} />

        {/* ========================================
            DASHBOARD ROUTES (Wrapped in Layout)
            ======================================== */}
        
        {/* 1. Public Dashboard Pages */}
        <Route path="/" element={
          <DashboardLayout>
            <Homepage />
          </DashboardLayout>
        } />

        <Route path="/order" element={
          <DashboardLayout>
            <Order />
          </DashboardLayout>
        } />

        <Route path="/track-order" element={
          <DashboardLayout>
            <TrackOrder />
          </DashboardLayout>
        } />

        {/* 2. ADMIN ONLY ROUTES */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/finance" element={
          <ProtectedRoute allowedRoles={['admin', 'secretary']}>
            <DashboardLayout>
              <FinanceDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />


        <Route path= "/inventory" element={
          <ProtectedRoute allowedRoles={['admin', 'representative']}>
            <DashboardLayout>
             <InventoryManagement/>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/commerce" element={
          <ProtectedRoute allowedRoles={['admin', 'representative']}>
            <DashboardLayout>
              <CommerceHub />
            </DashboardLayout>
          </ProtectedRoute>
        } />



         <Route path="/documents" element={
              <ProtectedRoute allowedRoles={['admin', 'secretary', 'representative']}>
                <DashboardLayout>
                  <PDFDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />


        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <ClassUpload />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* 3. ADMIN + SECRETARY ROUTES */}
        <Route path="/announcement" element={
          <ProtectedRoute allowedRoles={['admin', 'secretary' ,'representative']}>
            <DashboardLayout>
              <Announcement />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* 4. CATCH ALL */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />

      </Routes>
      </FinanceProvider>
      </InventoryProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;