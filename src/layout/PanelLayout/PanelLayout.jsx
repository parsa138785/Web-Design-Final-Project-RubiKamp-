import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppFooter from '@/components/AppFooter/AppFooter';
import links from '@/routes/links';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './PanelLayout.module.css';

const PANEL_LINKS = [
    { label: 'Rubikmap', link: '/' },
    ...Object.entries(links.panel).map(([key, value]) => ({
        label: key,
        link: value
    }))
];

const PanelLayout = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`${styles.layout} ${styles[theme]}`}>
            <AppHeader />
            <header className={styles.header}>
                <Breadcrumbs items={PANEL_LINKS} />
            </header>
            <main className={styles.main}>
                <Outlet />
            </main>
            <AppFooter />
        </div>
    );
};

export default PanelLayout;