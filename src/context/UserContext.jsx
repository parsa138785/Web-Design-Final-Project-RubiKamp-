import { createContext, useState } from "react";

export const UserContext = createContext(undefined);

const UserProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const uploadProfileImage = async (file) => {
        // TODO: Implement actual API call to backend to upload the image
        // and return the image URL from the backend response.
        console.log('Uploading file:', file.name);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Return a dummy URL for now
        return `https://example.com/uploads/${file.name}`;
    };

    const updateUserProfile = async (updatedUser) => {
        // TODO: Implement actual API call to backend to update user profile
        console.log('Updating user profile:', updatedUser);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update local storage and state with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser: (value) => {
                localStorage.setItem('user', JSON.stringify(value));
                setUser(value);
            },
            updateUserProfile,
            uploadProfileImage
        }}>{children}</UserContext.Provider>
    )
}

export default UserProvider;
