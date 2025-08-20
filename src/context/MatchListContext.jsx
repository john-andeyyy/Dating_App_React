import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { initSocket } from '../utils/Socket-Notif';

const getImageSrc = (imageBuffer) => {
    if (!imageBuffer?.data) return null;
    const byteArray = new Uint8Array(imageBuffer.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    return URL.createObjectURL(blob);
};

const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
};

const MatchListContext = createContext();

export const MatchListProvider = ({ children }) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const { user } = useAuth();
    const userId = user?._id;

    const [matchesList, setMatchesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const socket = initSocket(userId);
        const handleNewMatch = (newMatch) => {
            alert("uwu")
            const transformed = {
                _id: newMatch.senderId,
                id: newMatch.senderId,
                name: newMatch.name || "Unknown",
                age: newMatch.Birthday ? calculateAge(newMatch.Birthday) : "N/A",
                bio: newMatch.bio || "No bio",
                img: getImageSrc(newMatch.Image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            };
            setMatchesList(prev => [transformed, ...prev]);
        };

        socket.on("Recive_NewMatch", handleNewMatch);

        return () => {
            socket.off("Recive_NewMatch", handleNewMatch);
        };
    }, [userId]);

    const fetchMatches = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`${Baseurl}/Matching/MatchedList/${userId}`);
            const transformed = res.data.data.map((item) => ({
                _id: item._id,
                id: item.userSuggestion._id,
                name: item.userSuggestion.Name || "Unknown",
                age: item.userSuggestion.Birthday ? calculateAge(item.userSuggestion.Birthday) : "N/A",
                bio: item.userSuggestion.bio || "No bio",
                img: getImageSrc(item.userSuggestion.Image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }));
            setMatchesList(transformed);
        } catch (err) {
            console.error("Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    };

    const removeMatch = (removedId) => {
        setMatchesList((prev) => prev.filter((match) => match.id !== removedId));
    };

    useEffect(() => {
        fetchMatches();
    }, [userId]);

    return (
        <MatchListContext.Provider value={{ matchesList, loading, fetchMatches, removeMatch }}>
            {children}
        </MatchListContext.Provider>
    );
};

export const useMatchList = () => useContext(MatchListContext);
