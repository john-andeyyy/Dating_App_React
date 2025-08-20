import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { showToast } from '../components/ToastNotif';
import { useAuth } from './AuthContext';

const getImageSrc = (imageBase64) => {
    if (!imageBase64) return "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";
    return `data:image/png;base64,${imageBase64}`;
};
const RandomListContext = createContext();

export const RandomProvider = ({ children }) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const { user } = useAuth();
    const userId = user?._id;

    const [profiles, setProfiles] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfiles = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await axios.get(`${Baseurl}/Matching/PeopleList/${userId}`);

            if (res.data?.data?.length) {
                const formattedProfiles = res.data.data.map((user) => ({
                    id: user._id,
                    name: user.Name,
                    bio: user.bio,
                    image: getImageSrc(user.Image),
                }));

                // Shuffle profiles
                setProfiles(formattedProfiles.sort(() => Math.random() - 0.5));
                setIsEmpty(false);
            } else {
                setProfiles([]);
                setIsEmpty(true);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                console.warn("No available matches");
                setIsEmpty(true);
            } else {
                console.error("Error fetching profiles:", err);
                showToast("error", err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [userId]);

    const refresh = fetchProfiles;

    return (
        <RandomListContext.Provider value={{ profiles, refresh, loading, isEmpty }}>
            {children}
        </RandomListContext.Provider>
    );
};

export const useRandomProvider = () => useContext(RandomListContext);
