import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/theme.css';
import './styles/print.css';
import './assets/fonts/fonts.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { installGlobalErrorLogging } from 'services/errorLogging';
import { useDevModeStore } from 'stores/devModeStore';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element with id "root" was not found.');
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

installGlobalErrorLogging();
reportWebVitals((metric) => useDevModeStore.getState().recordWebVital(metric));
serviceWorkerRegistration.register();
