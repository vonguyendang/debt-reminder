import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Customers } from './pages/Customers.tsx';
import { Receivables } from './pages/Receivables.tsx';
import { Rules } from './pages/Rules.tsx';
import { Templates } from './pages/Templates.tsx';
import { ApiClient } from './api/client.ts';
import { ToastProvider } from './components/Toast.tsx';
import { ThemeLangProvider } from './contexts/ThemeLangContext.tsx';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  if (!ApiClient.getToken()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeLangProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="receivables" element={<Receivables />} />
            <Route path="rules" element={<Rules />} />
            <Route path="templates" element={<Templates />} />
            <Route path="*" element={<div>Coming Soon</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </ThemeLangProvider>
  );
}

export default App;
