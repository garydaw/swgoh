import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [guildID, setGuildID] = useState('');
    const [admin, setAdmin] = useState(false);

    const login = async (userData) => {
        localStorage.setItem('isLoggedIn', true);
        setIsLoggedIn(true);
        setUsername(userData.user.ally_code);
        setGuildID(userData.user.guild_id);
        setAdmin(userData.user.access);
    };

    const logout = () => {
        localStorage.setItem('isLoggedIn', false);
        setIsLoggedIn(false);
        setUsername(null);
        setGuildID('');
        setAdmin(null);
    };

    const value = useMemo(
        () => ({
            isLoggedIn,
            username,
            guildID,
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