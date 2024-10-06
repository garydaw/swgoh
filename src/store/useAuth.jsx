import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [admin, setAdmin] = useState(false);

    const login = async (userData) => {
        setIsLoggedIn(true);
        setUsername(userData.user.ally_code);
        setAdmin(userData.user.access);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername(null);
        setAdmin(null);
    };

    const value = useMemo(
        () => ({
            isLoggedIn,
            username,
            admin,
            login,
            logout,
        }),
        [username]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};

export const useAuth = () => {
    return useContext(AuthContext);
}