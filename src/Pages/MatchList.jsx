import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "../components/List";
import { useAuth } from "../context/AuthContext";
const Baseurl = import.meta.env.VITE_BASEURL;

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();
  const userId = user._id


  const fetchMatches = () => {
    console.log("fetchMatches");

    if (!userId) return;
    axios
      .get(`${Baseurl}/Matching/MatchedList/${userId}`)
      .then((res) => {
        const transformed = res.data.data.map((item) => ({
          _id: item._id,
          id: item.userSuggestion._id,
          name: item.userSuggestion.Name || "Unknown",
          age: item.userSuggestion.Birthday ? calculateAge(item.userSuggestion.Birthday) : "N/A",
          bio: item.userSuggestion.bio || "No bio",
          img: getImageSrc(item.userSuggestion.Image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
        }));
        setMatches(transformed);
      })
      .catch((err) => console.error(err));
  };


  useEffect(() => {
    if (userId) {
      fetchMatches();
    }
  }, [userId]);


  const getImageSrc = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return null;
    const byteArray = new Uint8Array(imageBuffer.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    return URL.createObjectURL(blob);
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="p-4 pb-2 text-xl opacity-60 tracking-wide flex-shrink-0">
        All current matches
      </h1>
      <div className="flex-grow overflow-y-auto">
        {matches.length > 0 ? (
          matches.map((match) => (
            <List
              key={match._id}
              id={match.id}
              name={match.name}
              age={match.age}
              bio={match.bio}
              img={match.img}
              onRemoved={fetchMatches}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No matches found
          </div>
        )}
      </div>
    </div>

  );
}
