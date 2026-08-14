import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global PWA BeforeInstallPrompt listener
window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  (window as any).__pwaPrompt = e;
});

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('NFHA PWA ServiceWorker registered with scope:', registration.scope);
      },
      (err) => {
        console.log('NFHA PWA ServiceWorker registration failed:', err);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

