import { Map, MessageCircleMore, User } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { tabType } from "./Screens";
export default function TabBar({
  setCurrentTab,
  currentTab,
}: {
  setCurrentTab: React.Dispatch<React.SetStateAction<tabType>>;
  currentTab: React.SetStateAction<tabType>;
}) {
  const tabs = [
    { id: "map", label: "Map", icon: <Map /> },
    { id: "users", label: "Users", icon: <User /> },
    { id: "chat", label: "Chat", icon: <MessageCircleMore /> },
  ] as const;

  const handleTabClick = (tabId: tabType) => {
    setCurrentTab(tabId);
  };

  return (
    <div className="w-full border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id as tabType)}
            className={`flex h-full flex-1 flex-col items-center justify-center transition-all duration-200 ${
              currentTab === tab.id
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mb-1 text-2xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
            {currentTab === tab.id && (
              <motion.div
                layoutId="underline"
                transition={{ type: "spring", duration: 0.3 }}
                className="absolute bottom-0 h-1 w-12 rounded-t-full bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
