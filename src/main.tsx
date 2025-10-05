import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './modules/app/App';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


