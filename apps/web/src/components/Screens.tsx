"use client";

import { useState, useEffect } from "react";
import ChatSection from "@/components/Chat/chat-container";
import { sessionData } from "@repo/types";
import TabBar from "@/components/TabBar";
import MapLibre from "@/components/Map/Map";
import { motion, Transition } from "motion/react";
import StatsContainer from "./Stats/stats-container";

export type tabType = "map" | "users" | "chat";

const drawerVariants = {
  hidden: { opacity: 0 }, // off-screen down
  visible: { opacity: 1 }, // on-screen
};
export default function Screens({ sessionData }: { sessionData: sessionData }) {
  const [currentTab, setCurrentTab] = useState<tabType>("map");

  const transition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 30,
    duration: 0.5,
  };
  return (
    <>
      <div className="relative h-full w-full">
        <motion.div
          // switch between variants based on active tab
          variants={drawerVariants}
          initial="hidden"
          animate={currentTab === "map" ? "visible" : "hidden"}
          transition={transition}
          className={`absolute inset-0 ${currentTab === "map" ? "pointer-events-auto z-20" : "pointer-events-none z-0"}`}
        >
          <MapLibre sessionData={sessionData} />
        </motion.div>

        <motion.div
          variants={drawerVariants}
          initial="hidden"
          animate={currentTab === "users" ? "visible" : "hidden"}
          transition={transition}
          className={`absolute inset-0 overflow-x-auto ${currentTab === "users" ? "pointer-events-auto z-20" : "pointer-events-none z-0"}`}
        >
          <StatsContainer currentSocketId={sessionData.userId} />
        </motion.div>

        <motion.div
          variants={drawerVariants}
          initial="hidden"
          animate={currentTab === "chat" ? "visible" : "hidden"}
          transition={transition}
          className={`absolute inset-0 overflow-x-auto ${currentTab === "chat" ? "pointer-events-auto z-20" : "pointer-events-none z-0"}`}
        >
          <ChatSection sessionData={sessionData} />
        </motion.div>
      </div>
      <TabBar setCurrentTab={setCurrentTab} currentTab={currentTab} />
    </>
  );
}
