import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react'
const Baseurl = import.meta.env.VITE_BASEURL;


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedUser = JSON.parse(localStorage.getItem('token'))
        return storedUser ? storedUser : null;
    })

    const [data, setData] = useState({});
    const [del, setDel] = useState(false)

    const login = async () => {
        try {
            const res = "ads"
            setData(res.data);
            setUser(res.data);
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };
    useEffect(() => {
        login()
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        setData({})
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ login, user, data, logout, del, setDel }}>
            {children}
        </AuthContext.Provider>
    )
}
// eto ginagamit para makuha ang mga {login, user, data, logout, del, setDel} sa auth context
export const useAuth = () => {
    return useContext(AuthContext)
}
