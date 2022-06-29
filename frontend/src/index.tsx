import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
