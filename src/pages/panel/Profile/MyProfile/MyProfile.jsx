import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/context/UserContext'; // Using UserContext for authentication
// import styles from './MyProfile.module.css'; // We will create this CSS module - Temporarily relying on inline styles or global styles

const MyProfile = () => {
    const { user, updateUserProfile, uploadProfileImage } = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Inline styles for minimal and elegant design
    const profileContainerStyle = {
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        direction: 'rtl' // For RTL layout
    };

    const titleStyle = {
        textAlign: 'center',
        color: '#007bff', // Primary accent color
        marginBottom: '1.5rem',
        fontSize: '2rem'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    };

    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column'
    };

    const labelStyle = {
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#555'
    };

    const inputFieldStyle = {
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
        width: '100%', // Ensure full width
        boxSizing: 'border-box' // Include padding and border in the element's total width and height
    };

    const avatarSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
    };

    const avatarPreviewStyle = {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #007bff'
    };

    const uploadButtonStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        textAlign: 'center'
    };

    const fileInputStyle = {
        // Making the default input visible and functional
        // If styles.fileInput was hiding it, this should make it appear
        // Or, ensure it's not display:none if triggered by label
        // For now, let the browser default render it by removing className={styles.fileInput}
    };

    const submitButtonStyle = {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#28a745', // Green for save/submit
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: '1rem'
    };

    const messageStyle = {
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center'
    };

    const successMessageStyle = {
        ...messageStyle,
        backgroundColor: '#d4edda',
        color: '#155724'
    };

    const errorMessageStyle = {
        ...messageStyle,
        backgroundColor: '#f8d7da',
        color: '#721c24'
    };

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPreviewImage(user.avatarUrl || null);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!user) {
            setError('کاربر یافت نشد. لطفاً دوباره وارد شوید.');
            return;
        }

        try {
            let imageUrl = user.avatarUrl;
            if (profileImageFile) {
                imageUrl = await uploadProfileImage(profileImageFile);
            }
            
            await updateUserProfile({ ...user, name, email, avatarUrl: imageUrl });
            setMessage('پروفایل با موفقیت به‌روزرسانی شد!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.message || ' به‌روزرسانی پروفایل با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
        }
    };

    if (!user) {
        return <div style={{textAlign: 'center', padding: '2rem'}}>در حال بارگذاری پروفایل...</div>;
    }

    return (
        <div style={profileContainerStyle}>
            <h1 style={titleStyle}>پروفایل من</h1>
            {message && <p style={successMessageStyle}>{message}</p>}
            {error && <p style={errorMessageStyle}>{error}</p>}
            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={avatarSectionStyle}>
                    <img 
                        src={previewImage || 'https://via.placeholder.com/150?text=بدون+تصویر'}
                        alt="آواتار پروفایل"
                        style={avatarPreviewStyle}
                    />
                    <label htmlFor="profileImageUpload" style={uploadButtonStyle}>
                        تغییر عکس
                    </label>
                    <input 
                        type="file" 
                        id="profileImageUpload"
                        accept="image/*" 
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} // Ensure the default input is hidden
                        // className={styles.fileInput} // Temporarily removed to ensure visibility/functionality
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="name" style={labelStyle}>نام:</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputFieldStyle}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>ایمیل:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputFieldStyle}
                        disabled 
                    />
                </div>
                
                <button type="submit" style={submitButtonStyle}>ذخیره تغییرات</button>
            </form>
        </div>
    );
};

export default MyProfile;