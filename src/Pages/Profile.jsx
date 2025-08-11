import React, { useState } from "react";

export default function Profile() {
    const [user, setUser] = useState({
        name: "Andrei",
        bio: "I love coding and Kuromi 🖤",
        photo: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser((prev) => ({ ...prev, photo: file }));
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        alert(user.name)
    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="bg-[#191E24] backdrop-blur-lg shadow-xl rounded-2xl p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>

                <div className="flex flex-col items-center gap-4">
                    <img
                        src={
                            previewPhoto ||
                            (user.photo
                                ? URL.createObjectURL(user.photo)
                                : "https://via.placeholder.com/150")
                        }
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                    />

                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="text-sm text-gray-500"
                        />
                    )}

                    <div className="w-full text-center">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <textarea
                                    name="bio"
                                    value={user.bio}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full transition-all duration-200"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-gray-600 mb-3">{user.bio}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg w-full transition-all duration-200"
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
