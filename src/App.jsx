import { UserContext } from '@/context/UserContext';
import { ThemeContext } from '@/context/ThemeContext'; // Import ThemeContext
import PanelLayout from '@/layout/PanelLayout/PanelLayout';
import HomePage from '@/pages/client/Home/HomePage';
import ProductDetailPage from '@/pages/client/ProductDetailPage/ProductDetailPage';
import AuthPage from '@/pages/panel/Auth/Auth';
import DashboardPage from '@/pages/panel/DashboardPage/DashboardPage'; // Import DashboardPage
import MyProfile from '@/pages/panel/Profile/MyProfile/MyProfile';
import ProfileUsers from '@/pages/panel/Profile/Users/ProfileUsers';
import ProductManagement from '@/pages/panel/ProductManagement/ProductManagement';
import links from '@/routes/links';
import { useContext, useEffect } from 'react'; // Added useEffect
// import Header from '@/layout/ClientLayout/Header/Header'; // Removed
// import Footer from '@/layout/ClientLayout/Footer/Footer'; // Removed
import { Link, Routes, Route } from 'react-router-dom'; // Added Link here

// Internal Header Component
const AppHeader = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // Basic inline styles, can be moved to a CSS file or module later
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: theme === 'light' ? '#ffffff' : '#212529', // Dynamic background
    borderBottom: theme === 'light' ? '1px solid #dee2e6' : '1px solid #343a40', // Dynamic border
    color: theme === 'light' ? '#212529' : '#f8f9fa', // Dynamic text color
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)' // Subtle shadow for depth
  };
  const logoLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  };
  const logoImageStyle = {
    height: '40px', // Adjust as needed
    marginRight: '10px'
  };

  const navLinkStyle = {
    marginLeft: '20px', // Increased margin
    textDecoration: 'none',
    color: theme === 'light' ? '#495057' : '#adb5bd', // Dynamic nav link color
    fontSize: '1rem',
    fontWeight: '500'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    marginLeft: '20px',
    cursor: 'pointer',
    backgroundColor: theme === 'light' ? '#007bff' : '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '500'
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoLinkStyle}>
        <img src={theme === 'light' ? "/logo.jpg" : "/dark-logo.jpg"} alt="لوگوی فرابالان" style={logoImageStyle} />
        {/* <span style={logoTextStyle}>فرابالان</span> */}
      </Link>
      <nav>
        <Link to="/" style={navLinkStyle}>خانه</Link>
        <Link to="/panel" style={navLinkStyle}>پنل کاربری</Link>
        {/* Add other navigation links here as needed */}
        <button onClick={toggleTheme} style={buttonStyle}>
          {theme === 'light' ? 'تم تیره' : 'تم روشن'}
        </button>
      </nav>
    </header>
  );
};

// Internal Footer Component
const AppFooter = () => {
  const { theme } = useContext(ThemeContext);
  // Basic inline styles
  const footerStyle = {
    padding: '2.5rem 1rem', // Increased padding
    textAlign: 'center',
    backgroundColor: theme === 'light' ? '#f8f9fa' : '#343a40', // Dynamic background
    color: theme === 'light' ? '#212529' : '#f8f9fa',           // Dynamic text color
    marginTop: 'auto', // Pushes footer to bottom if content is short
    borderTop: theme === 'light' ? '1px solid #dee2e6' : '1px solid #495057' // Dynamic border
  };
  const textStyle = {
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  };
  const emailLinkStyle = {
    color: theme === 'light' ? '#007bff' : '#17a2b8', // Dynamic email link color
    textDecoration: 'none',
    fontWeight: '500'
  };

  return (
    <footer style={footerStyle}>
      <p style={textStyle}>&copy; {new Date().getFullYear()} فرابالان. تمامی حقوق محفوظ است.</p>
      <p style={textStyle}>
        تماس با ما: <a href="mailto:saadatii.parsa@gmail.com" style={emailLinkStyle}>saadatii.parsa@gmail.com</a>
      </p>
    </footer>
  );
};

const client_pages = [
  {
    path: links.client.home,
    element: <HomePage />,
  },
  {
    path: links.client.auth,
    element: <AuthPage />,
  },
  {
    path: links.client.product,
    element: <ProductDetailPage />,
  },
]

const panel_pages = [
  {
    path: 'dashboard', // New path for the dashboard
    element: <DashboardPage />,
    isIndex: true, // Keep as index for /panel
  },
  {
    path: links.panel.profile,
    element: <MyProfile />,
    requireAdminRule: false,
  },
  {
    path: links.panel.users,
    element: <ProfileUsers />,
    requireAdminRule: true,
  },
  {
    path: links.panel.productManagement,
    element: <ProductManagement />,
    requireAdminRule: true,
  }
]
 
const App = () => {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#fff' : '#121212'; // Example dark background
    document.body.style.color = theme === 'light' ? '#212529' : '#f8f9fa';
  }, [theme]);

  const isAuth = localStorage.getItem('token') ? true : false;
  const {user} = useContext(UserContext);
  console.log("user from context: ", user);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Wrapper for sticky footer */}
      <AppHeader /> {/* Use internal AppHeader */}
      <Routes>
        {client_pages.map((page) => (
          <Route key={page.path} path={page.path} element={page.element} />
        ))}
        {isAuth && (
          <Route path="/panel" element={<PanelLayout />}>
            {panel_pages.map((page) => {
              if (page.isIndex) {
                return (
                  <Route key={page.path || 'index-panel'} index={page.isIndex} path={page.isIndex ? undefined : page.path} element={page.element} />
                )
              }
              if (page.requireAdminRule) {
                if (user?.isAdmin) {
                  return (
                    <Route key={page.path} path={page.path} element={page.element} />
                  )
                } else {
                  return (
                    <Route key={page.path} path={page.path} element={<div>Admin access required</div>} />
                  )
                }
              }
              return (
                <Route key={page.path} path={page.path} element={page.element} />
              )
            })}
          </Route>
        )}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <AppFooter /> 
    </div>
  )
}

export default App
