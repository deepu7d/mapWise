"use client";

import { Destination } from "@repo/types";
import { useState, useEffect, FormEvent } from "react";

type FormProps = {
  isAdmin: boolean;
  onSubmit: (data: {
    name: string;
    roomId?: string;
    destination?: Destination;
  }) => void;
  isLoading: boolean;
  roomParam: string | null;
};

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export default function RoomForm({
  isAdmin,
  onSubmit,
  isLoading,
  roomParam,
}: FormProps) {
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  useEffect(() => {
    if (roomParam) setRoomId(roomParam);
  }, []);

  const [destinationQuery, setDestinationQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  // Debounce effect for the destination search
  useEffect(() => {
    if (destinationQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destinationQuery}`
      )
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((error) => console.error("Error fetching locations:", error));
    }, 500); // Wait for 500ms after user stops typing

    return () => clearTimeout(handler); // Cleanup timeout
  }, [destinationQuery]);

  const handleDestinationSelect = (result: SearchResult) => {
    setSelectedDestination({
      name: result.display_name,
      position: [parseFloat(result.lat), parseFloat(result.lon)],
    });
    setDestinationQuery(result.display_name); // Update input with full name
    setSearchResults([]); // Hide results
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      if (name && selectedDestination) {
        onSubmit({ name, destination: selectedDestination });
      } else {
        alert("Please enter your name and select a destination.");
      }
    } else {
      if (name && roomId) {
        onSubmit({ name, roomId });
      } else {
        alert("Please enter your name and a Room ID.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isAdmin ? "Create a New Room" : "Join a Room"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
            required
            autoFocus
          />
        </div>

        {isAdmin ? (
          <div className="relative">
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700"
            >
              Destination
            </label>
            <input
              id="destination"
              type="text"
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for a location..."
              required
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
                {searchResults.map((result) => (
                  <li
                    key={result.place_id}
                    onClick={() => handleDestinationSelect(result)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : !roomId ? (
          <div>
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-700"
            >
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Room ID"
              required
            />
          </div>
        ) : (
          ""
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isLoading ? "Connecting..." : isAdmin ? "Create Room" : "Join Room"}
        </button>
      </form>
    </div>
  );
}
