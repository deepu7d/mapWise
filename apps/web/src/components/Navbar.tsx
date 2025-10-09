import { Share2 } from "lucide-react";
import React, { useState } from "react";

export default function Navbar({ roomId }: { roomId: string }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopy = () => {
    const websiteUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const link = `${websiteUrl}?roomId=${roomId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log("failed to copy", err);
      });
  };
  return (
    <div className="text-center w-full h-[5%] max-w-5xl">
      <div className="flex items-center justify-center gap-x-4 rounded-lg">
        <p className="w-[80%] lg:w-fit truncate text-sm text-gray-600 font-bold">
          Invite Others
        </p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 bg-blue-500 rounded-xl text-white font-bold p-2 hover:bg-blue-600"
        >
          {isCopied ? "copied" : <Share2 />}
        </button>
      </div>
    </div>
  );
}
