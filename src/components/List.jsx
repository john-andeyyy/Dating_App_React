import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function List({ id, name, age, bio, img, onRemoved }) {
    const { user } = useAuth();
    const userId = user?._id || "";

    const handleRemoveClick = async () => {
        try {
            const res = await axios.put("http://localhost:3000/Matching/Unlike", {
                Userid: userId,
                MatchingId: id,
            });
            console.log("Remove response:", res.data);

            if (onRemoved) onRemoved();

        } catch (err) {
            console.error("Error removing match:", err);
        }
    };

    return (
        <div className="bg-base-100 rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition">
            <img
                className="w-16 h-16 rounded-lg object-cover"
                src={img}
                alt={`${name}'s profile`}
            />

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <span className="text-sm text-gray-500">{age} yrs old</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{bio}</p>
            </div>
            <div className="flex gap-2">
                <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={handleRemoveClick}
                >
                    <img src="../../delete.png" alt="Remove" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
