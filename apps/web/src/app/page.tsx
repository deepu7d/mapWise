"use client";
import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const features = [
  {
    title: "Live Shared Map",
    description:
      "Set a destination and watch everyone's icon converge in real-time. No more sending static pins—our live map turns every meetup into a dynamic event.",
    imageUrl: "/app-images/map.jpeg",
  },
  {
    title: "Arrival Transparency",
    description:
      "Know exactly how far away your friends are from the destination with precise distance tracking. See who's actually 'just around the corner' and plan accordingly.",
    imageUrl: "/app-images/users.jpeg",
  },
  {
    title: "Integrated Group Chat",
    description:
      "Why switch apps? Coordinate, send updates, and react to your friends' 'sudden traffic' directly on the map screen. Everything you need is in one view.",
    imageUrl: "/app-images/chat.jpeg",
  },
];

export default function HomePage() {
  return (
    <main className="text-neutral-800 absolute inset-0 h-full max-w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] overflow-x-hidden">
      <div className="flex justify-between items-center p-4 lg:px-10">
        <h1 className="text-3xl font-bold ">MapWise</h1>
        <Link href={"/form?admin=false"}>
          <button className="bg-green-400 text-white p-2 px-4 rounded-2xl shadow-md  cursor-pointer hover:bg-green-500 transition-colors duration-300">
            Join Room
          </button>
        </Link>
      </div>
      {/* main content wrapper */}
      <div className="max-w-7xl mx-auto flex flex-col gap-20 justify-center items-center px-4 py-5">
        {/* Hero Section-1 */}
        <div className="flex flex-col justify-center items-center gap-4 max-w-5xl">
          <h3 className="text-5xl lg:text-7xl font-semibold text-center pt-5 inline-block bg-gradient-to-r from-neutral-600 to-neutral-950 text-transparent bg-clip-text">
            {'The End of "I\'m 5 Minutes Away."'}
          </h3>
          <p className="text-md lg:text-xl text-center text-neutral-700">
            {
              "Coordinate meetups with perfect clarity. No more guesswork, no more waiting."
            }
          </p>
          <div className="flex flex-col lg:flex-row gap-5 text-lg lg:text-xl lg:pt-10">
            <Link href="/form?admin=true">
              <button className="bg-blue-500 text-white w-52 py-4 shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-600 transition-colors duration-300">
                <FaPlus />
                Create Room
              </button>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-md text-neutral-500 mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-check text-green-600"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>No Sign In Required &#8226; Free Forever</span>
          </div>
        </div>
        {/* hero section-2 */}
        <div className="relative group w-full max-w-sm flex items-center justify-center">
          {/* Left Image (Behind) */}
          <Image
            width={300}
            height={300}
            src="/video-cover/left.jpeg"
            alt="Preview 1"
            className="
      absolute w-full h-full object-cover rounded-2xl
      transform scale-75 -translate-x-[40%] -rotate-8
      origin-bottom-left transition-all duration-500 ease-in-out
      group-hover:scale-90 group-hover:-translate-x-[40%] group-hover:-rotate-8
      z-10
       border border-neutral-300 shadow-xl
    "
          />

          {/* Right Image (Behind) */}
          <Image
            width={300}
            height={300}
            src="/video-cover/right.jpeg"
            alt="Preview 2"
            className="
      absolute w-full h-full object-cover rounded-2xl
      transform scale-75 translate-x-[40%] rotate-8
      origin-bottom-right transition-all duration-500 ease-in-out
      group-hover:scale-90 group-hover:translate-x-[40%] group-hover:rotate-8
      z-10  border border-neutral-300 shadow-xl
    "
          />

          {/* Main Video (In Front) */}
          <video
            className="
      relative w-64 lg:w-sm rounded-2xl 
      shadow-2xl object-cover
      transform scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out
      z-20  border border-neutral-300
    "
            src="/demo/main-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-label="Product demo video"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* How It Works Section */}
        <div className="text-center w-full py-16 px-4">
          <h2 className="text-4xl font-bold mb-4">Get Started in Seconds</h2>
          <p className="text-neutral-500 text-lg mb-12">
            {"Meet up without the hassle. It's as easy as 1-2-3."}
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-blue-100 text-blue-500 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Create a Room</h3>
              <p className="text-neutral-500">
                Generate a unique link and set a destination for your meetup.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-green-100 text-green-500 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Share the Link</h3>
              <p className="text-neutral-500">
                Send the link to your friends. No sign-ups or downloads required
                for them to join.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-3">
              <div className="bg-purple-100 text-purple-500 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Track & Chat</h3>
              <p className="text-neutral-500">
                Watch everyone on the live map and coordinate in the built-in
                chat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-center text-4xl font-bold lg:pb-10">Features</h1>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-shrink-0 flex-col lg:flex-row justify-center items-center w-full gap-6 lg:gap-10 py-10 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <Image
                width={300}
                height={300}
                src={feature.imageUrl}
                alt={`${feature.title} Image`}
                className="lg:w-xs object-cover rounded-2xl border border-neutral-300 shadow-xl"
              />
              <div className="flex flex-col justify-center items-center gap-2 max-w-xs">
                <h1 className="text-2xl font-bold ">{feature.title}</h1>
                <p className="text-neutral-500 text-lg text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <div className="h-[10vh] flex justify-center items-center p-4 lg:px-10 border-t border-neutral-800">
          <h1 className="text-sm text-neutral-500">
            &copy; 2025 MapWise. All rights reserved.
          </h1>
        </div>
      </footer>
    </main>
  );
}
