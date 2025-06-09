import { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './AppFooter.module.css';

const AppFooter = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`${styles.footer} ${styles[theme]}`}>
      <p className={styles.text}>
        &copy; {new Date().getFullYear()} فرابالان. تمامی حقوق محفوظ است.
      </p>
      <p className={styles.text}>
        تماس با ما:{' '}
        <a 
          href="mailto:saadatii.parsa@gmail.com" 
          className={`${styles.emailLink} ${styles[theme]}`}
        >
          saadatii.parsa@gmail.com
        </a>
      </p>
    </footer>
  );
};

AppFooter.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark'])
};

export default AppFooter;
