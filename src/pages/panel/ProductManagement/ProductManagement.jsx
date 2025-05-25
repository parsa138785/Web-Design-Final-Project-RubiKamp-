import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Modal from "@/components/Modal/Modal";

const makeBorderStyleByError = (bool) =>  
    ({
        border: '1px solid ' + (bool ? 'red' : '#e0e0e0'), // Softer border color
        color: bool ? 'red' : '#333', // Darker text color, red for error
        borderRadius: '8px', // Consistent border radius
        margin: '8px 0', // Adjusted margin for better spacing
        padding: '10px 12px', // Added padding
        width: '100%', // Make inputs take full width
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
    })

const ProductFormManagement = ({onSubmit, data, onCancel, hideCloseButton = false, cancelButtonText = 'انصراف', isDeleteForm = false}) => {
    const isCreateMode = !data;
    const [error, setError] = useState({
        name: false,
        description: false,
        price: false,
        category: false,
        stock: false,
        imageUrl: false
    });

    const [form, setForm] = useState({
        name: data?.name || '',
        description: data?.description || '',
        price: data?.price || '',
        category: data?.category || '',
        stock: data?.stock || 0,
        imageUrl: data?.imageUrl || ''
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // Basic validation (can be extended)
        let hasError = false;
        if (name === 'name' && value.trim() === '') {
            hasError = true;
        }
        if (name === 'description' && value.trim() === '') {
            hasError = true;
        }
        if (name === 'price' && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
            hasError = true;
        }
        if (name === 'category' && value.trim() === '') {
            hasError = true;
        }
        if (name === 'stock' && (isNaN(parseInt(value)) || parseInt(value) < 0)) {
            hasError = true;
        }
        // Basic URL validation for imageUrl (optional, can be more robust)
        if (name === 'imageUrl' && value.trim() !== '' && !value.startsWith('http')) {
            hasError = true;
        }

        setError(pre => ({...pre, [name]: hasError}));
        setForm({...form, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = isCreateMode ? 'http://localhost:8000/api/products' : `http://localhost:8000/api/products/${data.id}`;
        const method = isCreateMode ? 'POST' : 'PUT';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                }).catch(() => {
                    throw new Error(`HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(responseData => {
            if (responseData.product) {
                onSubmit(responseData.product);
            } else {
                console.error(`Error ${isCreateMode ? 'creating' : 'updating'} product: 'product' key missing in response`, responseData);
                alert(`Failed to ${isCreateMode ? 'create' : 'update'} product. Unexpected response from server.`);
            }
        })
        .catch(err => {
            console.error(`Error ${isCreateMode ? 'creating' : 'updating'} product:`, err);
            alert(`Failed to ${isCreateMode ? 'create' : 'update'} product: ${err.message}`);
        });
    }

    const isSubmitDisabled = Object.values(error).some(err => err) || !form.name || !form.description || !form.price || !form.category;
    
    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        width: isDeleteForm ? '400px' : '600px', // Increased width for create/edit, specific width for delete
        margin: 'auto' // Center the form in the modal
    };

    if (isDeleteForm) {
        return (
            <div style={formStyle}>
                <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#333', direction: 'rtl'}}>آیا از حذف محصول "{data?.name}" مطمئن هستید؟</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                        onClick={() => onSubmit(data.id)} 
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flexGrow: 1
                        }}
                    >حذف</button>
                    <button
                        type="button"
                        onClick={() => onCancel()} 
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flexGrow: 1
                        }}
                    >{cancelButtonText}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input style={makeBorderStyleByError(error.name)} value={form.name} placeholder="نام محصول" name="name" onChange={handleChange} />
            <input style={makeBorderStyleByError(error.description)} value={form.description} placeholder="توضیحات" name="description" onChange={handleChange} />
            <input type="number" style={makeBorderStyleByError(error.price)} value={form.price} placeholder="قیمت" name="price" onChange={handleChange} />
            <input style={makeBorderStyleByError(error.category)} value={form.category} placeholder="دسته بندی" name="category" onChange={handleChange} />
            <input type="number" style={makeBorderStyleByError(error.stock)} value={form.stock} placeholder="موجودی" name="stock" onChange={handleChange} />
            <input style={makeBorderStyleByError(error.imageUrl)} value={form.imageUrl} placeholder="آدرس تصویر" name="imageUrl" onChange={handleChange} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                    disabled={isSubmitDisabled} 
                    type="submit"
                    style={{
                        backgroundColor: isSubmitDisabled ? '#ccc' : '#007bff',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                        flexGrow: 1
                    }}
                >{isCreateMode ? 'ایجاد' : 'به روز رسانی'}</button>
                {!hideCloseButton && 
                    <button
                        type="button"
                        onClick={() => onCancel()} 
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flexGrow: 1
                        }}
                    >{cancelButtonText}
                    </button>
                }
            </div>
        </form>
    )
}

const ProductManagement = () => {
    const {user} = useContext(UserContext);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
    const [deleteProductInfo, setDeleteProductInfo] = useState(null); // Stores product to be deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls delete confirmation modal

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if(response.ok) {
                setProducts(data);
            } else {
                console.error("Error fetching products:", data.message)
                setProducts([]) // Set to empty array on error
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]) // Set to empty array on error
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?.isAdmin) {
            fetchProducts();
        }
    }, [user]);

    const handleDeleteProduct = (id) => {
        setLoading(true)
        fetch(`http://localhost:8000/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.success || res.message === "Product deleted successfully" || res.message === "محصول با موفقیت حذف شد") { // Handle different success messages
                fetchProducts();
                setShowDeleteModal(false); // Close modal on successful deletion
                setDeleteProductInfo(null);
            } else {
                alert(res.message || "خطا در حذف محصول");
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    if (!user?.isAdmin) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc3545' }}>شما مجوز دسترسی به این صفحه را ندارید.</div>
    }

    const filteredProducts = products.filter(product => 
        (product.name && product.name.toLowerCase().includes(search.toLowerCase())) || 
        (product.category && product.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>مدیریت محصولات</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="جستجو بر اساس نام یا دسته بندی..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '300px'
                    }}
                />
                <button 
                    onClick={() => setOpenCreateProductModal(true)}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ایجاد محصول جدید
                </button>
            </div>

            {showDeleteModal && deleteProductInfo && (
                <Modal 
                    isOpen={showDeleteModal} 
                    onClose={() => { setShowDeleteModal(false); setDeleteProductInfo(null); }}
                    title={`حذف محصول: ${deleteProductInfo.name}`}
                >
                    <ProductFormManagement 
                        data={deleteProductInfo} 
                        onSubmit={() => handleDeleteProduct(deleteProductInfo.id)} 
                        onCancel={() => { setShowDeleteModal(false); setDeleteProductInfo(null); }}
                        isDeleteForm={true}
                        cancelButtonText="لغو"
                    />
                </Modal>
            )}
            {openCreateProductModal && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title="ایجاد محصول جدید" 
                    description={
                        <ProductFormManagement 
                            data={null}
                            onSubmit={(product) => {
                                fetchProducts(); // Refresh products list
                                setOpenCreateProductModal(false)
                            }} 
                            onCancel={() => setOpenCreateProductModal(false)} 
                        />
                    }
                />
            }
            {editProduct && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title={`ویرایش محصول: ${editProduct.name}`} 
                    description={
                        <ProductFormManagement 
                            data={editProduct}
                            onSubmit={(updatedProduct) => {
                                fetchProducts(); // Refresh products list
                                setEditProduct(null)
                            }} 
                            onCancel={() => setEditProduct(null)} 
                        />
                    }
                />
            }

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>در حال بارگذاری محصولات...</div>
            ) : filteredProducts.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>نام</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>توضیحات</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>قیمت</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>دسته بندی</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>موجودی</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>تصویر</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} style={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.description}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.price} تومان</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.category}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{product.stock}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                    {product.imageUrl ? 
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : 
                                        'ندارد'
                                    }
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setEditProduct(product)}
                                        style={{
                                            backgroundColor: '#ffc107',
                                            color: 'black',
                                            padding: '8px 12px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '5px'
                                        }}
                                    >
                                        ویرایش
                                    </button>
                                    <button 
                                        onClick={() => { setDeleteProductInfo(product); setShowDeleteModal(true); }}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            padding: '8px 12px',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#777' }}>محصولی یافت نشد.</div>
            )}
        </div>
    )
}

export default ProductManagement;