import React from "react";

export default function Card({ name, bio, image }) {
    return (
        <div className="w-72 sm:w-[90vw] sm:max-w-sm rounded-2xl overflow-hidden shadow-lg 
        bg-base-100 border-2 border-base-300 text-black min-h-[28rem]">
            <figure>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 sm:h-60 object-cover"
                />
            </figure>
            <div className="p-4 flex flex-col gap-2 bg-base-100 text-base-content">
                <h2 className="text-lg sm:text-xl font-bold">{name}</h2>
                <p className="text-sm text-info-content sm:text-base break-words">{bio}</p>
            </div>
        </div>
    );
}
