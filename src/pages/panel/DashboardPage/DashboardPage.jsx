import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';
import { ThemeContext } from '@/context/ThemeContext';
import links from '@/routes/links';

const DashboardPage = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  // Define styles based on theme
  const getCardStyle = () => ({
    backgroundColor: theme === 'light' ? '#ffffff' : '#2c3e50',
    color: theme === 'light' ? '#2c3e50' : '#ecf0f1',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    minHeight: '150px', // Ensure cards have a minimum height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const getContainerStyle = () => ({
    padding: '2rem',
    backgroundColor: theme === 'light' ? '#f4f6f8' : '#1a202c',
    minHeight: 'calc(100vh - 120px)', // Adjust based on header/footer height
    direction: 'rtl', // Ensure right-to-left layout
  });

  const getGridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  });

  const getTitleStyle = () => ({
    color: theme === 'light' ? '#34495e' : '#ecf0f1',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  });

  const getWelcomeMessageStyle = () => ({
    color: theme === 'light' ? '#34495e' : '#ecf0f1',
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '1.5rem',
  });

  const dashboardItems = [
    { name: 'پروفایل من', path: links.panel.profile, icon: '👤' },
    // Add more items as needed
  ];

  if (user?.isAdmin) {
    dashboardItems.push({ name: 'مدیریت کاربران', path: links.panel.users, icon: '👥' });
    dashboardItems.push({ name: 'مدیریت محصولات', path: links.panel.productManagement, icon: '📦' });
  }

  return (
    <div style={getContainerStyle()}>
      <h1 style={getTitleStyle()}>داشبورد پنل کاربری</h1>
      {user && <p style={getWelcomeMessageStyle()}>خوش آمدید، {user.firstName} {user.lastName}!</p>}
      <div style={getGridStyle()}>
        {dashboardItems.map((item) => (
          <Link key={item.name} to={item.path} style={getCardStyle()}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <span style={{ fontSize: '3rem', marginBottom: '10px' }}>{item.icon}</span>
            <h2 style={{ fontSize: '1.5rem', margin: '0' }}>{item.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;