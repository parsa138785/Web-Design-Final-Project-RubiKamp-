import { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '@/context/ThemeContext';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppFooter from '@/components/AppFooter/AppFooter';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './ClientLayout.module.css';

const ClientLayout = ({ children, breadcrumbItems }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`${styles.layout} ${styles[theme]}`}>
      <AppHeader />
      {breadcrumbItems && (
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      )}
      <main className={styles.main}>
        {children}
      </main>
      <AppFooter />
    </div>
  );
};

ClientLayout.propTypes = {
  children: PropTypes.node.isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string
    })
  )
};

export default ClientLayout;
