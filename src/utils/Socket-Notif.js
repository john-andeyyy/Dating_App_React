import { io } from "socket.io-client";
import { showToast } from "../components/ToastNotif";
import React from "react";

const Baseurl = import.meta.env.VITE_BASEURL;
let socket;

export const initSocket = (userId) => {
    if (socket) return socket;

    socket = io(Baseurl, {
        transports: ["websocket"],
        withCredentials: true,
    });

    socket.on("connect", () => {

        if (userId) {
            socket.emit("join", userId);
            console.log(`Joined room: ${userId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
    });

    socket.on("New_Notif", (data) => {
        const MsgData = data.message
        showToast(MsgData)

    });

    return socket;
};

export default socket;
