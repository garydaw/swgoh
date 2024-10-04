import { createContext, useContext, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [admin, setAdmin] = useLocalStorage("admin", null);
    const [token, setToken] = useLocalStorage("token", null);
    //const navigate = useNavigate();

    const login = async (userData) => {
        setUser(userData.user.ally_code);
        setAdmin(userData.user.access);
        setToken(userData.token);
        //navigate("/units");
    };

    const logout = () => {
        setUser(null);
        setAdmin(null);
        setToken(null);
        //navigate("/", {replace: true});
    };

    const value = useMemo(
        () => ({
            user,
            admin,
            token,
            login,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};

export const useAuth = () => {
    return useContext(AuthContext);
}