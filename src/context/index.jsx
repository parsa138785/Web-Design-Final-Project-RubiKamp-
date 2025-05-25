import UserProvider from "./UserContext";

const ContextProvider = ({children}) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    )
}

export default ContextProvider;