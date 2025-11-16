import { Share2 } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ roomId }: { roomId: string }) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const handleCopy = () => {
    const websiteUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const link = `${websiteUrl}/form/?admin=false&roomId=${roomId}`;
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
    <button
      onClick={handleCopy}
      className="rounded-xl bg-blue-500 p-2 font-bold text-white hover:bg-blue-600"
    >
      {isCopied ? "copied" : <Share2 />}
    </button>
  );
}
