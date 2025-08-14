import React, { useState } from "react";

const exampleMatches = [
    { id: 1, name: "Andrei", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Betina", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "John", img: "https://randomuser.me/api/portraits/men/12.jpg" },
    { id: 4, name: "Mika", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    // Added more unique entries for demo
    { id: 5, name: "Liam", img: "https://randomuser.me/api/portraits/men/55.jpg" },
    { id: 6, name: "Sofia", img: "https://randomuser.me/api/portraits/women/29.jpg" },
    { id: 7, name: "Noah", img: "https://randomuser.me/api/portraits/men/8.jpg" },
    { id: 8, name: "Isabella", img: "https://randomuser.me/api/portraits/women/14.jpg" },
];

export default function Message() {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [messages, setMessages] = useState({
        1: [
            { from: "match", text: "Hey there! How are you?" },
            { from: "me", text: "Hi Andrei! I'm good, thanks." },
        ],
        2: [{ from: "match", text: "Are you coming to the trip?" }],
        3: [],
        4: [{ from: "me", text: "Hello Mika!" }],
    });
    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (!inputText.trim() || !selectedMatch) return;

        setMessages((prev) => ({
            ...prev,
            [selectedMatch.id]: [
                ...(prev[selectedMatch.id] || []),
                { from: "me", text: inputText.trim() },
            ],
        }));
        setInputText("");
    };

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/3 border-r border-gray-300 flex flex-col">
                <h2 className="p-4 text-lg font-semibold border-b border-gray-300 ">
                    Matches
                </h2>

                <div className="flex-grow overflow-y-auto ">
                    <ul>
                        {exampleMatches.map((match) => (
                            <li
                                key={match.id}
                                onClick={() => setSelectedMatch(match)}
                                className={`cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-gray-500 ${selectedMatch?.id === match.id ? "bg-gray-600 font-semibold" : ""
                                    }`}
                            >
                                <img
                                    src={match.img}
                                    alt={match.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span>{match.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col flex-1 p-6 bg-gray-600">
                {selectedMatch ? (
                    <>
                        <h3 className="text-xl font-bold mb-4">Messages with {selectedMatch.name}</h3>

                        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 rounded shadow-inner flex flex-col">
                            {(messages[selectedMatch.id] || []).length === 0 && (
                                <p className="text-gray-500 italic">No messages yet.</p>
                            )}

                            {(messages[selectedMatch.id] || []).map((msg, i) => (
                                <div
                                    key={i}
                                    className={`max-w-xs px-4 py-2 my-1 rounded-lg ${msg.from === "me"
                                            ? "bg-blue-500 text-white self-end"
                                            : "bg-gray-300 text-gray-800 self-start"
                                        }`}
                                    style={{ alignSelf: msg.from === "me" ? "flex-end" : "flex-start" }}
                                >
                                    {msg.text}
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
                            <button
                                onClick={handleSend}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
                            >
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
