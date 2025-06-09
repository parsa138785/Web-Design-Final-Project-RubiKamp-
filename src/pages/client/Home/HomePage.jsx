import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '@/context/ThemeContext';
import { UserContext } from '@/context/UserContext';
import AppHeader from '@/components/AppHeader/AppHeader';
import AppFooter from '@/components/AppFooter/AppFooter';
import styles from './HomePage.module.css';

const HomePage = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(UserContext); // Assuming user object { name, isAdmin, ... }
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            setLoading(true);
            try {
                const productsResponse = await fetch('/api/products');
                if (!productsResponse.ok) throw new Error(`HTTP error! status: ${productsResponse.status}`);
                const productsData = await productsResponse.json();
                setProducts(productsData);
                setFilteredProducts(productsData);

                // Extract unique categories
                const uniqueCategories = [...new Set(productsData.map(p => p.category))];
                setCategories(uniqueCategories);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProductsAndCategories();
    }, []);

    useEffect(() => {
        let tempProducts = products;
        if (searchTerm) {
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory) {
            tempProducts = tempProducts.filter(product => product.category === selectedCategory);
        }
        setFilteredProducts(tempProducts);
    }, [searchTerm, selectedCategory, products]);

    if (loading) {
        return (
            <>
                <AppHeader />
                <div className={theme === 'light' ? styles.loadingLight : styles.loadingDark}>Loading products...</div>
                <AppFooter />
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppHeader />
                <div className={theme === 'light' ? styles.errorLight : styles.errorDark}>Error: {error}</div>
                <AppFooter />
            </>
        );
    }

    // Admin View
    if (user && user.isAdmin) {
        return (
            <>
                <AppHeader />
                <div className={`${styles.page} ${theme === 'light' ? styles.lightTheme : styles.darkTheme}`}>
                    <h1 className={styles.pageTitle}>Admin Dashboard</h1>
                    <p>Welcome, Admin {user.name}!</p>
                    <p>Here you can manage products, users, and other settings.</p>
                    <div className={styles.adminLinksContainer}>
                        <Link to="/panel/products" className={styles.adminLink}>Manage Products</Link>
                        {/* Add more admin links as needed */}
                    </div>
                    {/* Product display section for admin can also be here or a separate component */}
                    <h2 className={styles.subTitle}>All Products (Admin View)</h2>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.input}
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    {filteredProducts.length > 0 ? (
                        <div className={styles.productGrid}>
                            {filteredProducts.map(product => (
                                <Link to={`/product/${product.id}`} key={product.id} className={styles.productLink}>
                                    <div className={styles.productCard}>
                                        <img 
                                            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={product.name} 
                                            className={styles.productImage} 
                                        />
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <p className={styles.productCategory}>Category: {product.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noProducts}>No products found matching your criteria.</p>
                    )}
                </div>
                <AppFooter />
            </>
        );
    }

    // Regular User View (Onboarding or Product List)
    return (
        <>
            <AppHeader />
            <div className={`${styles.page} ${theme === 'light' ? styles.lightTheme : styles.darkTheme}`}>
                <h1 className={styles.pageTitle}>Welcome to Rubikamp!</h1>
                <p className={styles.onboardingText}>
                    Discover our amazing collection of products. Use the search and filter options below to find what you're looking for!
                </p>
                
                <h2 className={styles.subTitle}>Our Products</h2>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.input}
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className={styles.productGrid}>
                        {filteredProducts.map(product => (
                            <Link to={`/product/${product.id}`} key={product.id} className={styles.productLink}>
                                <div className={styles.productCard}>
                                    <img 
                                        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={product.name} 
                                        className={styles.productImage} 
                                    />
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.productCategory}>Category: {product.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className={styles.noProducts}>No products found matching your criteria.</p>
                )}
            </div>
            <AppFooter />
        </>
    );
};

export default HomePage;