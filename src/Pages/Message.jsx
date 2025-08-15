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

    useEffect(() => {
        if (!userId) return;

        axios
            .get(`${Baseurl}/Msg/MatchedListMsg/${userId}`)
            .then((res) => setMatchedList(res.data?.data || []))
            .catch((err) => console.error("Error fetching matched list:", err));
    }, [userId, Baseurl]);

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

    if (!userId || !userdata) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex h-screen">
            {/* Left Panel */}
            <div className="w-1/3 border-r border-gray-300 flex flex-col">
                <h2 className="p-4 text-lg font-semibold border-b border-gray-300">Matches</h2>
                <div className="flex-grow overflow-y-auto">
                    <ul>
                        {matchedList.map((match) => (
                            <li
                                key={match._id}
                                onClick={() => handleSelectMatch(match)}
                                className={`cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-gray-500 ${selectedMatch?._id === match._id ? "bg-gray-600 font-semibold" : ""
                                    }`}
                            >
                                <img
                                    src={
                                        match.image ||
                                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                                    }
                                    alt={match.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-center">
                                        <span>{match.name}</span>
                                        {match.lastMessageAt && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(match.lastMessageAt).toLocaleDateString()}{" "}
                                                {new Date(match.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 truncate max-w-[160px]">
                                        {match.lastMessage || "No messages yet"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col flex-1 p-6 bg-gray-600">
                {selectedMatch ? (
                    <>
                        <h3 className="text-xl font-bold mb-4">Messages with {selectedMatch.name}</h3>

                        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 rounded shadow-inner flex flex-col">
                            {(messages[selectedMatch._id] || []).map((msg, i) => (
                                <div
                                    key={i}
                                    className={`max-w-xs px-4 py-2 my-1 rounded-lg ${msg.sender === userdata.Email ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
                                        }`}
                                    style={{ alignSelf: msg.sender === userdata.Email ? "flex-end" : "flex-start" }}
                                >
                                    <div className="text-xs font-semibold mb-1">{msg.senderName}</div>
                                    {msg.text}
                                    <div className="text-xs text-gray-200 mt-1">
                                        {msg.date} • {msg.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <textarea
                                rows={2}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-grow resize-none p-2 border border-gray-300 rounded"
                                placeholder="Type your message..."
                            />
                            <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                        Select a match to view messages
                    </div>
                )}
            </div>
        </div>
    );
}
