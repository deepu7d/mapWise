import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

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
    <main className="absolute inset-0 h-full max-w-full overflow-x-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] text-neutral-800">
      <div className="flex items-center justify-between p-4 lg:px-10">
        <h1 className="text-3xl font-bold ">MapWise</h1>
        <Link href={"/form?admin=false"}>
          <button className="cursor-pointer rounded-2xl bg-green-400 p-2 px-4 text-white  shadow-md transition-colors duration-300 hover:bg-green-500">
            Join Room
          </button>
        </Link>
      </div>
      {/* main content wrapper */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-20 px-4 py-5">
        {/* Hero Section-1 */}
        <div className="flex max-w-5xl flex-col items-center justify-center gap-4">
          <h3 className="inline-block bg-gradient-to-r from-neutral-600 to-neutral-950 bg-clip-text pt-5 text-center text-5xl font-semibold text-transparent lg:text-7xl">
            {'The End of "I\'m 5 Minutes Away."'}
          </h3>
          <p className="text-md text-center text-neutral-700 lg:text-xl">
            {
              "Coordinate meetups with perfect clarity. No more guesswork, no more waiting."
            }
          </p>
          <div className="flex flex-col gap-5 text-lg lg:flex-row lg:pt-10 lg:text-xl">
            <Link href="/form?admin=true">
              <button className="flex w-52 cursor-pointer items-center justify-center gap-2 bg-blue-500 py-4 text-white shadow-lg transition-colors duration-300 hover:bg-blue-600">
                <FaPlus />
                Create Room
              </button>
            </Link>
          </div>
          <div className="text-md mt-4 flex items-center gap-2 text-neutral-500">
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
        <div className="group relative flex w-full max-w-sm items-center justify-center">
          {/* Left Image (Behind) */}
          <Image
            width={300}
            height={300}
            src="/video-cover/left.jpeg"
            alt="Preview 1"
            className="
      -rotate-8 group-hover:-rotate-8 absolute z-10 h-full
      w-full origin-bottom-left -translate-x-[40%] scale-75
      transform rounded-2xl border border-neutral-300
      object-cover shadow-xl transition-all
      duration-500
       ease-in-out group-hover:-translate-x-[40%] group-hover:scale-90
    "
          />

          {/* Right Image (Behind) */}
          <Image
            width={300}
            height={300}
            src="/video-cover/right.jpeg"
            alt="Preview 2"
            className="
      rotate-8 group-hover:rotate-8 absolute z-10 h-full
      w-full origin-bottom-right translate-x-[40%] scale-75
      transform rounded-2xl border border-neutral-300
      object-cover shadow-xl transition-all
      duration-500  ease-in-out group-hover:translate-x-[40%] group-hover:scale-90
    "
          />

          {/* Main Video (In Front) */}
          <video
            className="
      lg:w-sm relative z-20 w-64 
      scale-100 transform
      rounded-2xl border border-neutral-300 object-cover shadow-2xl transition-all
      duration-500  ease-in-out group-hover:scale-105
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
        <div className="w-full px-4 py-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">Get Started in Seconds</h2>
          <p className="mb-12 text-lg text-neutral-500">
            {"Meet up without the hassle. It's as easy as 1-2-3."}
          </p>
          <div className="grid gap-10 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-500">
                1
              </div>
              <h3 className="text-xl font-semibold">Create a Room</h3>
              <p className="text-neutral-500">
                Generate a unique link and set a destination for your meetup.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-500">
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-500">
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
              className={`flex w-full flex-shrink-0 flex-col items-center justify-center gap-6 py-10 lg:flex-row lg:gap-10 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <Image
                width={300}
                height={300}
                src={feature.imageUrl}
                alt={`${feature.title} Image`}
                className="lg:w-xs rounded-2xl border border-neutral-300 object-cover shadow-xl"
              />
              <div className="flex max-w-xs flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold ">{feature.title}</h1>
                <p className="text-center text-lg text-neutral-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <div className="flex h-[10vh] items-center justify-center border-t border-neutral-800 p-4 lg:px-10">
          <h1 className="text-sm text-neutral-500">
            &copy; 2025 MapWise. All rights reserved.
          </h1>
        </div>
      </footer>
    </main>
  );
}
