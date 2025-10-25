import { Routes, Route } from 'react-router-dom';
import { CardProvider } from './CardContext/CardContext.jsx';
import AdminPage from './admin/admin.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Document from './components/Document Page/Document.jsx';
import styles from './App.module.css';
import WorkinProgress from './components/WorkinProgress/WorkinProgress.jsx';
import MemberDashboard from './components/MemberDashboard.jsx';
import TestFirebase from './components/TestFirebase.jsx';
import Loginpage from './components/Login-Page/loginpage.jsx';
import Homepage from './Homepage/Homepage.jsx';
import Order from './components/Order/order.jsx';
function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.mainContent}>
      <Sidebar />
        <div className={styles.contentWrapper}>
          <CardProvider>
            
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/finance" element={<WorkinProgress />} />
              <Route path="/reports" element={<WorkinProgress />} />
              <Route path="/announcement" element={<WorkinProgress />} />
              <Route path="/order" element = {<Order/>}/>
            </Routes>

          </CardProvider>
          
          
        </div>
      </div>
    </div>
  );
}

export default App;