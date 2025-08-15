import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react'


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const Baseurl = import.meta.env.VITE_BASEURL;

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userId')
        return storedUser ? storedUser : null;
    })

    const [userdata, setuserData] = useState({});
    const [del, setDel] = useState(false)

    const login = async () => {
        const userid = localStorage.getItem('userId')
        console.log("user id: " + userid);
        
        try {
            const res = await axios.get(`${Baseurl}/user/auth/retrive/${userid}`);
            
            setuserData(res.data.Data);
            setUser(res.data.Data);
            
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };
    useEffect(() => {
        login()
    }, [])

    const logout = () => {
        localStorage.clear()
        setuserData({})
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ login, user, userdata, logout, del, setDel }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext)
}
