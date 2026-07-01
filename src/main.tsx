import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<p style="font-family: system-ui; padding: 2rem;">PF2Model failed to start: root element was not found.</p>';
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
