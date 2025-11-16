import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import CopyButton from "./Buttons/copy-button";
import { useSocketContext } from "@repo/hooks";

export default function Navbar({ roomId }: { roomId: string }) {
  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      sessionStorage.clear();
      redirect("/form");
    }
  };
  const { isConnected } = useSocketContext();
  return (
    <div className="w-full flex items-center justify-between rounded-lg p-4">
      <p className="text-xl font-bold text-gray-800">MapWise</p>
      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
        <div className="relative flex items-center">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {isConnected && (
            <span className="absolute w-2.5 h-2.5 rounded-full bg-green-500" />
          )}
        </div>
        <span
          className={`font-semibold text-sm ${
            isConnected ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isConnected ? "Online" : "Offline"}
        </span>
      </div>
      <div className="flex gap-4">
        <CopyButton roomId={roomId} />
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
