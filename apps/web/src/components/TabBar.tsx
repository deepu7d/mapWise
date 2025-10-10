import { tabType } from "@/app/playground/[id]/page";
import { Map, MessageCircleMore, User } from "lucide-react";
import React from "react";
export default function TabBar({
  setCurrentTab,
}: {
  setCurrentTab: React.Dispatch<React.SetStateAction<tabType>>;
}) {
  const [activeTab, setActiveTab] = React.useState<tabType>("map");

  const tabs = [
    { id: "map", label: "Map", icon: <Map /> },
    { id: "users", label: "Users", icon: <User /> },
    { id: "chat", label: "Chat", icon: <MessageCircleMore /> },
  ] as const;

  const handleTabClick = (tabId: tabType) => {
    setActiveTab(tabId);
    setCurrentTab(tabId);
  };

  return (
    <div className="w-full bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as tabType)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 w-12 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
