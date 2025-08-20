import React from "react";
import List from "../components/List";
import { useMatchList } from "../context/MatchListContext";

export default function MatchList() {
  const { matchesList, loading, removeMatch } = useMatchList();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-info-content">
        Loading matches...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-200">
      <h1 className="p-4 pb-2 text-xl font-bold tracking-wide flex-shrink-0 text-base-content">
        All current matches
      </h1>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {matchesList.length > 0 ? (
          matchesList.map((match) => (
            <List
              key={match._id}
              id={match.id}
              name={match.name}
              age={match.age}
              bio={match.bio}
              img={match.img}
              onRemoved={removeMatch}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-info-content">
            No matches found
          </div>
        )}
      </div>
    </div>
  );
}
