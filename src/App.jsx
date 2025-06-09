import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '@/context/UserContext';
import { ThemeContext } from '@/context/ThemeContext';
import PanelLayout from '@/layout/PanelLayout/PanelLayout';
import ClientLayout from '@/layout/ClientLayout/ClientLayout';
import HomePage from '@/pages/client/Home/HomePage';
import ProductDetailPage from '@/pages/client/ProductDetailPage/ProductDetailPage';
import AuthPage from '@/pages/panel/Auth/Auth';
import DashboardPage from '@/pages/panel/DashboardPage/DashboardPage';
import MyProfile from '@/pages/panel/Profile/MyProfile/MyProfile';
import ProfileUsers from '@/pages/panel/Profile/Users/ProfileUsers';
import ProductManagement from '@/pages/panel/ProductManagement/ProductManagement';
import links from '@/routes/links';
import styles from './App.module.css';

const ErrorMessage = ({ message }) => (
  <div className={styles.errorMessage}>{message}</div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

const CLIENT_PAGES = [
  {
    path: links.client.home,
    element: <HomePage />
  },
  {
    path: links.client.auth,
    element: <AuthPage />
  },
  {
    path: links.client.product,
    element: <ProductDetailPage />
  }
];

const PANEL_PAGES = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
    isIndex: true
  },
  {
    path: links.panel.profile,
    element: <MyProfile />,
    requireAdminRule: false
  },
  {
    path: links.panel.users,
    element: <ProfileUsers />,
    requireAdminRule: true
  },
  {
    path: links.panel.productManagement,
    element: <ProductManagement />,
    requireAdminRule: true
  }
];

const App = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const isAuth = Boolean(localStorage.getItem('token'));

  return (
    <div className={`${styles.appContainer} ${styles[theme]}`}>
      <Routes>
        {CLIENT_PAGES.map((page) => (
          <Route 
            key={page.path} 
            path={page.path} 
            element={
              page.path === links.client.home ? page.element : (
                <ClientLayout>
                  {page.element}
                </ClientLayout>
              )
            } 
          />
        ))}
        {isAuth && (
          <Route path="/panel" element={<PanelLayout />}>
            {PANEL_PAGES.map((page) => {
              if (page.isIndex) {
                return (
                  <Route 
                    key={page.path || 'index-panel'} 
                    index={page.isIndex} 
                    path={page.isIndex ? undefined : page.path} 
                    element={page.element} 
                  />
                );
              }
              if (page.requireAdminRule && !user?.isAdmin) {
                return (
                  <Route 
                    key={page.path} 
                    path={page.path} 
                    element={<ErrorMessage message="Admin access required" />} 
                  />
                );
              }
              return (
                <Route key={page.path} path={page.path} element={page.element} />
              );
            })}
          </Route>
        )}
        <Route path="*" element={<ErrorMessage message="404 - Page Not Found" />} />
      </Routes>
    </div>
  );
};

export default App;
