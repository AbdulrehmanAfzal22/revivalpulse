import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/theme.css';
import './styles/layout.css';
import './styles/print.css';
import './assets/fonts/fonts.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { installGlobalErrorLogging } from 'services/errorLogging';
import { useDevModeStore } from 'stores/devModeStore';
import {
  assertValidRecitationConfig,
  warnIfRecitationAudioMissing,
} from 'config/recitationConfig';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element with id "root" was not found.');
}

// Phase 1 + Phase 3 hardening, development builds only: validate the Immersive
// Recitation media config ONCE at app start — an invalid URL/empty field fails
// here with the field named, and a missing audio file gets a loud console
// warning — before any <video>/<audio> element can request it.
if (process.env.NODE_ENV === 'development') {
  assertValidRecitationConfig();
  void warnIfRecitationAudioMissing();
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
