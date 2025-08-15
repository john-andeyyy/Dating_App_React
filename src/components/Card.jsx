import React from "react";

export default function Card({ name, bio, image }) {
    return (
        <div className="w-72 sm:w-[90vw] sm:max-w-sm rounded-2xl overflow-hidden shadow-lg bg-primary border-2 b
        order-primary text-black">
            <figure>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 sm:h-60 object-cover"
                />
            </figure>
            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl font-bold ">{name}</h2>
                <p className="text-sm sm:text-base text-darker">{bio}</p>
            </div>
        </div>
    );
}
