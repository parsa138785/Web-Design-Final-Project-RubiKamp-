import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/" className={styles.logoLink}>
                    <span className={styles.logoText}>Rubikamp</span>
                </Link>
            </div>
            <nav className={styles.navLinks}>
                <Link to="/" className={styles.navLink}>Home</Link>
            </nav>
        </header>
    );
}

export default Header;