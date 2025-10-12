import { Routes, Route } from 'react-router-dom';
import { CardProvider } from './CardContext/CardContext.jsx';
import AdminPage from './admin/admin.jsx';
import Header from './Header/Header.jsx';
import Sidebar from './Sidebar/Sidebar.jsx';
import Document from './Document Page/Document.jsx';
import styles from './App.module.css';
import WorkinProgress from './WorkinProgress/WorkinProgress.jsx';
function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.mainContent}>
      <Sidebar />
        <div className={styles.contentWrapper}>
          <CardProvider>
            
            <Routes>
              <Route path="/" element={<Document />} />
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