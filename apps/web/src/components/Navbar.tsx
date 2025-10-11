import { LogOut, Share2 } from "lucide-react";
import { redirect } from "next/navigation";
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
  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      sessionStorage.clear();
      redirect("/");
    }
  };
  return (
    <div className="w-full max-w-md flex items-center justify-between rounded-lg p-4">
      <p className="text-lg font-bold text-gray-800">MapWise</p>
      <div className="flex gap-4">
        <button
          onClick={handleCopy}
          className="bg-blue-500 rounded-xl text-white font-bold p-2 hover:bg-blue-600"
        >
          {isCopied ? "copied" : <Share2 />}
        </button>
        <button
          onClick={handleExit}
          className="bg-red-500 p-2 rounded-xl text-white"
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
}
