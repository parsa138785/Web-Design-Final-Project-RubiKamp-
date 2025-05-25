import ProductLayoutPage from "@/layout/ClientLayout/ProductLayoutPage";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";

const ProductDetailPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const { theme } = useContext(ThemeContext); // Using theme for potential dark/light mode specific styles

    // Inline styles for a minimal and elegant design
    const pageContainerStyle = (currentTheme) => ({
        direction: 'rtl',
        fontFamily: 'Arial, sans-serif', // Consider a more elegant Persian-friendly font
        backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#f9fafb', // Dark:bg-gray-800, Light:bg-gray-50
        color: currentTheme === 'dark' ? '#e5e7eb' : '#111827', // Dark:text-gray-200, Light:text-gray-900
        minHeight: 'calc(100vh - 100px)', // Adjust based on header/footer height
        padding: '2rem 1rem' // Responsive padding
    });

    const contentWrapperStyle = (currentTheme) => ({
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    });

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
        '@media (min-width: 768px)': {
            gridTemplateColumns: '1fr 1fr',
        }
    };

    const imageSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const mainImageStyle = {
        width: '100%',
        maxWidth: '450px',
        height: 'auto',
        maxHeight: '500px',
        objectFit: 'contain',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '1rem'
    };

    const infoSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const productNameStyle = (currentTheme) => ({
        fontSize: '2.25rem', // text-3xl or text-4xl
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: currentTheme === 'dark' ? '#60a5fa' : '#2563eb', // Accent color (e.g., blue)
    });

    const categoryStyle = (currentTheme) => ({
        fontSize: '0.9rem',
        color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280', // Dark:text-gray-400, Light:text-gray-500
        marginBottom: '0.25rem'
    });

    const priceStyle = (currentTheme) => ({
        fontSize: '1.8rem',
        fontWeight: '600',
        color: currentTheme === 'dark' ? '#f59e0b' : '#d97706', // Accent color (e.g., orange/amber)
        margin: '1rem 0'
    });

    const descriptionStyle = (currentTheme) => ({
        marginBottom: '1.5rem',
        lineHeight: '1.7',
        fontSize: '0.95rem',
        color: currentTheme === 'dark' ? '#d1d5db' : '#374151'
    });

    const quantitySelectorStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
    };

    const quantityButtonStyle = (currentTheme) => ({
        padding: '0.5rem 0.75rem',
        border: `1px solid ${currentTheme === 'dark' ? '#4b5563' : '#d1d5db'}`, 
        backgroundColor: currentTheme === 'dark' ? '#374151' : '#f3f4f6',
        color: currentTheme === 'dark' ? '#e5e7eb' : '#1f2937',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out'
    });

    const quantityInputStyle = (currentTheme) => ({
        width: '50px',
        textAlign: 'center',
        padding: '0.5rem',
        borderTop: `1px solid ${currentTheme === 'dark' ? '#4b5563' : '#d1d5db'}`, 
        borderBottom: `1px solid ${currentTheme === 'dark' ? '#4b5563' : '#d1d5db'}`, 
        backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
        color: currentTheme === 'dark' ? '#e5e7eb' : '#1f2937',
        fontSize: '1rem'
    });

    const addToCartButtonStyle = (currentTheme) => ({
        width: '100%',
        backgroundColor: currentTheme === 'dark' ? '#10b981' : '#059669', // Green accent
        color: 'white',
        fontWeight: 'bold',
        padding: '0.85rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1.1rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        marginBottom: '1.5rem'
    });

    const sectionTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
        borderTop: `1px solid ${theme === 'dark' ? '#4b5563' : '#e0e0e0'}`, 
        paddingTop: '1rem',
        marginTop: '1rem'
    };

    const specListStyle = {
        listStyleType: 'disc',
        paddingRight: '1.5rem', // For RTL list bullets
        spaceY: '0.25rem',
        fontSize: '0.9rem'
    };

    const breadcrumbItems = product ? [
        { label: "خانه", link: "/" },
        { label: "محصولات", link: "/" }, // Assuming a general products page link
        { label: product.name, link: `/product/${id}` }
    ] : [
        { label: "خانه", link: "/" },
        { label: "محصولات", link: "/" }
    ];

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/products/${id}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`خطای HTTP! وضعیت: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("خطا در دریافت محصول:", err);
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    // Responsive adjustments for grid using a more direct approach if @media in JS is complex
    // For simplicity, we'll rely on Tailwind-like classes if they were available, or simple CSS.
    // The gridStyle above includes a conceptual @media query.

    if (loading) {
        return <ProductLayoutPage breadcrumbItems={breadcrumbItems}><div style={{textAlign: 'center', padding: '2.5rem', fontSize: '1.2rem'}}>درحال بارگذاری جزئیات محصول...</div></ProductLayoutPage>;
    }

    if (error) {
        return <ProductLayoutPage breadcrumbItems={breadcrumbItems}><div style={{textAlign: 'center', padding: '2.5rem', color: 'red'}}>خطا در بارگذاری محصول: {error}</div></ProductLayoutPage>;
    }

    if (!product) {
        return <ProductLayoutPage breadcrumbItems={breadcrumbItems}><div style={{textAlign: 'center', padding: '2.5rem'}}>محصول یافت نشد.</div></ProductLayoutPage>;
    }

    return (
        <ProductLayoutPage breadcrumbItems={breadcrumbItems}>
            <div style={pageContainerStyle(theme)}>
                <div style={contentWrapperStyle(theme)}>
                    {/* Applying a basic grid for layout, can be enhanced with media queries in CSS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"> {/* Retaining Tailwind for grid for now, or use gridStyle */}
                        <div style={imageSectionStyle}>
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/400?text=بدون+تصویر'}
                                alt={product.name}
                                style={mainImageStyle}
                            />
                        </div>

                        <div style={infoSectionStyle}>
                            <div>
                                <h1 style={productNameStyle(theme)}>{product.name}</h1>
                                <p style={categoryStyle(theme)}>دسته بندی: {product.category}</p>
                                <p style={priceStyle(theme)}>{product.price.toLocaleString('fa-IR')} تومان</p>
                                <h3 style={{...sectionTitleStyle, borderTop: 'none', paddingTop: 0, marginTop: 0, marginBottom: '0.5rem'}}>توضیحات</h3>
                                <p style={descriptionStyle(theme)}>{product.description}</p>

                                <div style={quantitySelectorStyle}>
                                    <span style={{ marginRight: '0.75rem', fontWeight: '500' }}>تعداد:</span>
                                    <button 
                                        onClick={() => handleQuantityChange(-1)} 
                                        style={{...quantityButtonStyle(theme), borderRadius: '0 4px 4px 0'}}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        readOnly
                                        value={quantity} 
                                        style={quantityInputStyle(theme)}
                                    />
                                    <button 
                                        onClick={() => handleQuantityChange(1)} 
                                        style={{...quantityButtonStyle(theme), borderRadius: '4px 0 0 4px'}}
                                    >
                                        +
                                    </button>
                                </div>

                                <button style={addToCartButtonStyle(theme)}>
                                    افزودن به سبد خرید
                                </button>
                            </div>

                            <div style={{ borderTop: `1px solid ${theme === 'dark' ? '#4b5563' : '#e0e0e0'}`, paddingTop: '1rem', marginTop: '1rem' }}>
                                <h3 style={{...sectionTitleStyle, borderTop: 'none', paddingTop: 0, marginTop: 0}}>مشخصات محصول</h3>
                                <ul style={specListStyle}>
                                    <li>موجودی: {product.stock > 0 ? `${product.stock} عدد` : <span style={{color: theme === 'dark' ? '#f87171' : '#ef4444'}}>ناموجود</span>}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProductLayoutPage>
    );
};

export default ProductDetailPage;
