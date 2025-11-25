import { Routes, Route } from 'react-router-dom';
import { CardProvider } from './CardContext/CardContext.jsx';
import AdminPage from './admin/admin.jsx';
import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import styles from './App.module.css';
import WorkinProgress from './components/WorkinProgress/WorkinProgress.jsx';
import Homepage from './Homepage/Homepage.jsx';
import Order from './components/Order/order.jsx';
import Announcement from './components/Announcement.jsx';
import ClassUpload from './components/ClassUpload.jsx';
import Playground from './components/playground.jsx';
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
              <Route path="/reports" element={<ClassUpload />} />
              <Route path="/announcement" element={<Announcement />} />
              <Route path="/order" element = {<Order/>}/>
            </Routes>

          </CardProvider>
          
          
        </div>
      </div>
    </div>
  );
}

export default App;