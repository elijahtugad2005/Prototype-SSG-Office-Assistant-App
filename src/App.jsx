import { Routes, Route } from 'react-router-dom';
import { CardProvider } from './CardContext/CardContext.jsx';
import AdminPage from './admin/admin.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Document from './components/Document Page/Document.jsx';
import styles from './App.module.css';
import WorkinProgress from './components/WorkinProgress/WorkinProgress.jsx';
import MemberDashboard from './components/MemberDashboard.jsx';
function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.mainContent}>
      <Sidebar />
        <div className={styles.contentWrapper}>
          <CardProvider>
            
            <Routes>
              <Route path="/" element={<MemberDashboard />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/finance" element={<WorkinProgress />} />
              <Route path="/reports" element={<WorkinProgress />} />
              <Route path="/announcement" element={<WorkinProgress />} />
            </Routes>

          </CardProvider>
          
          
        </div>
      </div>
    </div>
  );
}

export default App;