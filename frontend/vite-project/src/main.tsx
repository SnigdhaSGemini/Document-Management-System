import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/index.tsx';
import 'react-toastify/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoaderProvider } from './context/loaderContext';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Provider store={store}>
        <LoaderProvider>
          <App/>
          <ToastContainer />
        </LoaderProvider>
      </Provider>
    </BrowserRouter>
)
