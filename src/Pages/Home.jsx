import React, { useState, useRef, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/ToastNotif";

export default function Home() {
  const { user } = useAuth();
  const userId = user?._id;
  const Baseurl = import.meta.env.VITE_BASEURL;

  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!userId) return;

    const fetchProfiles = async () => {
      try {
        const res = await axios.get(`${Baseurl}/Matching/PeopleList/${userId}`);
        if (res.data?.data) {
          const formatted = res.data.data.map((user) => ({
            id: user._id,
            name: user.Name,
            bio: user.bio,
            image: getImageSrc(user.Image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          }));
          setProfiles(formatted.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };

    fetchProfiles();
  }, [userId, Baseurl]);

  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer?.data) return null;
    const byteArray = new Uint8Array(imageBuffer.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    return URL.createObjectURL(blob);
  };

  const handleStart = (x, y) => {
    startPos.current = { x, y };
    setIsDragging(true);
  };

  const handleMove = (x, y) => {
    if (!isDragging || isLeaving) return;
    setPosition({ x: x - startPos.current.x, y: y - startPos.current.y });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (position.x > 120) return swipe("right");
    if (position.x < -120) return swipe("left");

    setPosition({ x: 0, y: 0 });
  };

  const swipe = async (direction) => {
    const profile = profiles[currentIndex];
    if (!profile) return;

    const isLike = direction === "right";
    const msg = isLike ? `You liked ${profile.name}!` : `You skipped ${profile.name}.`;
    const msgType = isLike ? "info" : "warn";

    try {
      const res = await axios.post(`${Baseurl}/Matching/Like_unlike`, {
        Userid: userId,
        MatchingId: profile.id,
        isLike,
      });

      showToast(msg, msgType, { position: "top-center" });

      if (res.data.match) {
        showToast(`It's a match with ${profile.name}!`, "success", { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      showToast("Error sending swipe", "error", { position: "top-center" });
    }

    setIsLeaving(true);
    setPosition({
      x: isLike ? window.innerWidth : -window.innerWidth,
      y: position.y,
    });

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setPosition({ x: 0, y: 0 });
      setIsLeaving(false);
    }, 300);
  };

  const likeOpacity = position.x > 0 ? Math.min(position.x / 120, 1) : 0;
  const nopeOpacity = position.x < 0 ? Math.min(-position.x / 120, 1) : 0;
  const blurEffect = Math.min(Math.abs(position.x) / 50, 5);

  if (!profiles.length || currentIndex >= profiles.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-darker flex-col px-4 text-[#E2E2B6]">
        <h2 className="text-2xl font-bold mb-4">No more profiles</h2>
        <p className="text-[#6EACDA]">Check back later for more people to meet!</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen overflow-hidden px-4 bg-darker"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="relative w-full max-w-sm h-[500px] flex items-center justify-center">
        {profiles
          .slice(currentIndex, currentIndex + 3)
          .reverse()
          .map((profile, i, arr) => {
            const isTop = i === arr.length - 1;
            return (
              <div
                key={profile.id}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  transform: isTop
                    ? `translate(${position.x}px, ${position.y}px) rotate(${position.x / 20}deg)`
                    : `scale(${1 - i * 0.05}) translateY(${i * 15}px)`,
                  transition: isTop && (isDragging || isLeaving) ? "none" : "transform 0.3s ease",
                  zIndex: i,
                }}
              >
                {isTop && (
                  <>
                    <div
                      className="absolute top-6 left-6 z-50 font-extrabold text-3xl border-4 px-4 py-2 rounded-lg shadow-lg bg-[#E2E2B6]/50 backdrop-blur-sm text-[#6EACDA] border-[#6EACDA]"
                      style={{ opacity: likeOpacity, transform: "rotate(-15deg)" }}
                    >
                      LIKE
                    </div>
                    <div
                      className="absolute top-6 right-6 z-50 font-extrabold text-3xl border-4 px-4 py-2 rounded-lg shadow-lg bg-[#E2E2B6]/50 backdrop-blur-sm text-[#03346E] border-[#03346E]"
                      style={{ opacity: nopeOpacity, transform: "rotate(15deg)" }}
                    >
                      SKIP
                    </div>
                  </>
                )}
                <div style={{ filter: isTop ? `blur(${blurEffect}px)` : "none" }}>
                  <Card name={profile.name} bio={profile.bio} image={profile.image} bgColor="#E2E2B6" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

