import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.tsx';

const GOOGLE_CLIENT_ID = "808477696231-s5vkd4i518p1ler7n9cmbqbs1f87gvp0.apps.googleusercontent.com";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
