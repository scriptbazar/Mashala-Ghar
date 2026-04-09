import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Defensive check for environments where fetch is read-only
if (typeof window !== 'undefined' && !('fetch' in window)) {
  console.warn('Native fetch not found, but avoiding global overwrite to prevent TypeError.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
