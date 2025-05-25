import ContextProvider from "@/context";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeContext"; // Import ThemeProvider

const AppProvider = ({children}) => {
    return (
        <BrowserRouter>
            <ThemeProvider> {/* Add ThemeProvider here */}
                <ContextProvider>
                    {children}
                </ContextProvider>
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default AppProvider;