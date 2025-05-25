import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";

const makeBorderStyleByError = (bool) =>  
    ({
        border: '1px solid ' + (bool ? 'red' : '#e0e0e0'),
        color: bool ? 'red' : '#333',
        borderRadius: '8px',
        margin: '8px 0',
        padding: '10px 12px',
        width: '100%',
        boxSizing: 'border-box',
    })

const UserFormManagement = ({onSubmit, data, onCancel, hideCloseButton = false, cancelButtonText = 'انصراف'}) => {
    const isCreateMode = !data;
    const [error, setError] = useState({
        email: false,
        name: false
    });

    const [form, setForm] = useState({
        email: data?.email || '',
        name: data?.name || '',
    })

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === 'email') {
            // Validate email with regex
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                setError(pre => ({...pre, email: true}));
            } else {
                setError(pre => ({...pre, email: false}));
            }
            
            // setting value here
            setForm({...form, [name]: value})
        } else {
            // handle name changes
            const numberRegex = /\d+/;
            if (numberRegex.test(value)) {
                setError(pre => ({...pre, name: true}));
            } else {
                setError(pre => ({...pre, name: false}));
            }
            
            setForm({...form, [name]: value})
        }
    }

    const handleSubmit = (e) => {
        console.log('log');
        
        e.preventDefault()
        if (isCreateMode) {
            // create user
            fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form)
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.user) {
                    console.log('success');
                    onSubmit(res.user)
                } else {
                    console.log('error');
                }
            })
        } else {
            // update user
             // create user
             fetch('http://localhost:8000/api/users/'+ data.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(form)
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.user) {
                    console.log('success');
                    onSubmit(res.user)
                } else {
                    console.log('error');
                }
            })
        }
    }

    const isSubmitDisabled = error.email || error.name;
    
    
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <input style={makeBorderStyleByError(error.email)} value={form.email} placeholder="ایمیل" name="email" onChange={handleChange} />
            <input style={makeBorderStyleByError(error.name)} value={form.name} placeholder="نام" name="name" onChange={handleChange} />
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
                        type="button" // Important: Set type to button to prevent form submission
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

const ProfileUsers = () => {
    const {user} = useContext(UserContext);
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:8000/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        setUsers(data);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = (id) => {
        setLoading(true)
        fetch(`http://localhost:8000/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                fetchUsers()
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    if (!user.isAdmin) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc3545' }}>شما مجوز دسترسی به این صفحه را ندارید.</div>
    }

    const filteredUsers = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>مدیریت کاربران</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="جستجو بر اساس نام یا ایمیل..."
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
                    onClick={() => setOpenCreateUserModal(true)}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ایجاد کاربر جدید
                </button>
            </div>

            {deleteUser && 
                <Modal 
                    onClose={() => setDeleteUser(null)} 
                    onSubmit={() => {
                        handleDeleteUser(deleteUser.id)
                        setDeleteUser(null)
                    }} 
                    title="حذف کاربر" 
                    description={`آیا از حذف کاربر ${deleteUser.name} مطمئن هستید؟`}
                    submitButtonText="حذف"
                    cancelButtonText="انصراف"
                />
            }
            {openCreateUserModal && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title="ایجاد کاربر جدید" 
                    description={
                        <UserFormManagement 
                            data={null}
                            onSubmit={(newUser) => {
                                fetchUsers(); // Refresh users list
                                setOpenCreateUserModal(false)
                            }} 
                            onCancel={() => setOpenCreateUserModal(false)} 
                        />
                    }
                />
            }
            {editUser && 
                <Modal 
                    hideCloseButton={true}
                    hideSubmitButton={true}
                    title={`ویرایش کاربر: ${editUser.name}`} 
                    description={
                        <UserFormManagement 
                            data={editUser}
                            onSubmit={(updatedUser) => {
                                fetchUsers(); // Refresh users list
                                setEditUser(null)
                            }} 
                            onCancel={() => setEditUser(null)} 
                        />
                    }
                />
            }

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>در حال بارگذاری کاربران...</div>
            ) : filteredUsers.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>نام</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>ایمیل</th>
                            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} style={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{u.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px' }}>{u.email}</td>
                                <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setEditUser(u)}
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
                                        onClick={() => setDeleteUser(u)}
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
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#777' }}>کاربری یافت نشد.</div>
            )}
        </div>
    )
}

export default ProfileUsers;