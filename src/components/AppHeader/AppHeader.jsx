import { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className={`${styles.header} ${styles[theme]}`}>
      <Link to="/" className={styles.logoLink}>
        <img 
          src={theme === 'light' ? "/logo.jpg" : "/dark-logo.jpg"} 
          alt="فرابالان" 
          className={styles.logoImage} 
        />
      </Link>
      <nav>
        <Link to="/" className={`${styles.navLink} ${styles[theme]}`}>خانه</Link>
        <Link to="/panel" className={`${styles.navLink} ${styles[theme]}`}>پنل کاربری</Link>
        <button 
          onClick={toggleTheme} 
          className={`${styles.themeButton} ${styles[theme]}`}
        >
          {theme === 'light' ? 'تم تیره' : 'تم روشن'}
        </button>
      </nav>
    </header>
  );
};

AppHeader.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  toggleTheme: PropTypes.func,
};

export default AppHeader;
