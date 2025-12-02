import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CardProvider } from './CardContext/CardContext.jsx'; // ✅ import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      {/* ✅ Wrap App in CardProvider */}
      <CardProvider>
        <App />
      </CardProvider>
    </HashRouter>
  </StrictMode>
);
