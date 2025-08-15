import React, { useState, useRef, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const { user } = useAuth();
  const userId = user._id
  const Baseurl = import.meta.env.VITE_BASEURL;

  // Fetch profiles from backend
  useEffect(() => {
    if (userId) {
      axios
        .get(`${Baseurl}/Matching/PeopleList/${userId}`)
        .then((res) => {
          if (res.data?.data) {
            const shuffleArray = (array) => {
              return array
                .map((a) => ({ sort: Math.random(), value: a }))
                .sort((a, b) => a.sort - b.sort)
                .map((a) => a.value);
            };

            const formatted = res.data.data.map((user) => ({
              id: user._id,
              name: user.Name,
              bio: user.bio,
              image: getImageSrc(user.Image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg",
            }));

            setProfiles(shuffleArray(formatted)); 
          }
        })
        .catch((err) => {
          console.error("Error fetching profiles:", err);
        });
    }
  }, [userId]);



  // Handlers
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

    try {
      const res = await axios.post(`${Baseurl}/Matching/Like_unlike`, {
        Userid: userId,
        MatchingId: profile.id,
        isLike
      });

      alert(res.data.message);
      if (res.data.match) {
        alert(` It's a match with ${profile.name}!`);
      }

    } catch (error) {
      console.error(error);
      alert("Error sending swipe");
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

  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return null;
    const byteArray = new Uint8Array(imageBuffer.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    return URL.createObjectURL(blob);
  };

  const likeOpacity = position.x > 0 ? Math.min(position.x / 120, 1) : 0;
  const nopeOpacity = position.x < 0 ? Math.min(-position.x / 120, 1) : 0;
  const blurEffect = Math.min(Math.abs(position.x) / 50, 5);

  return (
    <div
      className="flex items-center justify-center min-h-screen overflow-hidden px-4"
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
                      className="absolute top-6 left-6 z-50 text-green-500 font-extrabold text-3xl border-4 border-green-500 px-4 py-2 rounded-lg shadow-lg bg-white/30 backdrop-blur-sm"
                      style={{ opacity: likeOpacity, transform: "rotate(-15deg)" }}
                    >
                      LIKE
                    </div>
                    <div
                      className="absolute top-6 right-6 z-50 text-purple-500 font-extrabold text-3xl border-4 border-purple-500 px-4 py-2 rounded-lg shadow-lg bg-white/30 backdrop-blur-sm"
                      style={{ opacity: nopeOpacity, transform: "rotate(15deg)" }}
                    >
                      SKIP
                    </div>
                  </>
                )}
                <div style={{ filter: isTop ? `blur(${blurEffect}px)` : "none" }}>
                  <Card name={profile.name} bio={profile.bio} image={profile.image} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

}
