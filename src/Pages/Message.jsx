import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Message() {
    const { user, userdata } = useAuth();
    const Baseurl = import.meta.env.VITE_BASEURL;

    const [matchedList, setMatchedList] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messages, setMessages] = useState({});
    const [inputText, setInputText] = useState("");

    const userId = user?._id;

    // Fetch matched list
    useEffect(() => {
        if (!userId) return;
        axios
            .get(`${Baseurl}/Msg/MatchedListMsg/${userId}`)
            .then((res) => setMatchedList(res.data?.data || []))
            .catch((err) => console.error("Error fetching matched list:", err));
    }, [userId, Baseurl]);

    // Fetch messages for selected match
    const handleSelectMatch = async (match) => {
        setSelectedMatch(match);
        if (!userId) return;

        try {
            const res = await axios.get(`${Baseurl}/Msg/MessageList/${userId}/${match._id}`);
            const conversation = res.data?.data || [];
            setMessages((prev) => ({
                ...prev,
                [match._id]: conversation.map((m) => ({
                    sender: m.sender,
                    senderName: m.senderName,
                    text: m.message,
                    date: m.date,
                    time: m.time,
                })),
            }));
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    // Send message
    const handleSend = async () => {
        if (!inputText.trim() || !selectedMatch || !userdata) return;

        const newMessage = {
            senderId: userdata._id,
            receiverId: selectedMatch._id,
            message: inputText.trim(),
        };

        setMessages((prev) => ({
            ...prev,
            [selectedMatch._id]: [
                ...(prev[selectedMatch._id] || []),
                {
                    sender: userdata.Email,
                    senderName: userdata.Name,
                    text: inputText.trim(),
                    date: "Today",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
            ],
        }));
        setInputText("");

        try {
            await axios.post(`${Baseurl}/Msg/Send`, newMessage);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const getImageSrc = (imageBuffer) => {
        if (!imageBuffer || !imageBuffer.data) return null;
        const byteArray = new Uint8Array(imageBuffer.data);
        const blob = new Blob([byteArray], { type: "image/png" });
        return URL.createObjectURL(blob);
    };
    
    if (!userId || !userdata) return <div className="flex items-center justify-center h-screen ">Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Left Panel */}
            <div className="w-full lg:w-1/3 border-r border-dark flex flex-col bg-base-200 ">
                <h2 className="p-4 text-lg font-semibold border-b border-dark text-base-content ">Matches</h2>
                <div className="flex-grow overflow-y-auto">
                    <ul className="bg-base-300">
                        {matchedList.map((match) => (
                            <li
                                key={match._id}
                                onClick={() => handleSelectMatch(match)}
                                className={`cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-base-100/20 transition-colors rounded ${selectedMatch?._id === match._id ? "bg-base-100/20 font-semibold text-white" : ""
                                    }`}
                            >
                                <img
                                    src={
                                        getImageSrc(match.image) ||
                                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                                    }
                                    alt={match.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-dark"
                                />
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base-content/80">{match.name}</span>
                                        {match.lastMessageAt && (
                                            <span className="text-xs ">
                                                {new Date(match.lastMessageAt).toLocaleDateString()}{" "}
                                                {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs  truncate max-w-[160px]">
                                        {match.lastMessage || "No messages yet"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col flex-1 p-4 lg:p-6  bg-base-100">
                {selectedMatch ? (
                    <>
                        <h3 className="text-xl font-bold mb-4 ">Messages with<span className="text-base-content"> {selectedMatch.name}</span></h3>

                        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-base-200 rounded-lg shadow-inner flex flex-col gap-2">
                            {(messages[selectedMatch._id] || []).map((msg, i) => {
                                const isSent = msg.sender === userdata.Email;
                                return (
                                    <div
                                        key={i}
                                        className={`max-w-xs px-4 py-2 rounded-xl shadow-sm ${isSent ? "bg-base-300 text-white self-end" : "bg-base-300 self-start"
                                            }`}
                                    >
                                        {/* <div className="text-xs font-semibold mb-1">{msg.senderName}</div> */}
                                        <div className="text-sm break-words">{msg.text}</div>
                                        <div className="text-xs text-base-content mt-1 text-right ">
                                            {msg.date} • {msg.time}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-2">
                            <textarea
                                rows={2}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-grow resize-none p-2 border  rounded focus:ring-2 focus:ring-accent bg-base-200"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={handleSend}
                                className="bg-accent text-black px-10 rounded hover:bg-green-400"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full  italic">
                        Select a match to view messages
                    </div>
                )}
            </div>
        </div>
    );
}
