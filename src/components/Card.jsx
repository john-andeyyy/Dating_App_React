import React from "react";

export default function Card({ name, bio, image }) {
    return (
        <div className="card bg-base-100 w-72 sm:w-[90vw] sm:max-w-sm shadow-sm">
            <figure>
                <img
                    src={image}
                    alt={name}
                    className="w-full h-48 sm:h-60 object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title text-lg sm:text-xl">{name}</h2>
                <p className="text-sm sm:text-base">{bio}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm sm:btn-md">View Profile</button>
                </div>
            </div>
        </div>
    );
}
