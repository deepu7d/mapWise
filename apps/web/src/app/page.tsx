import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Real-time Maps",
    description:
      "Experience the power of real-time mapping with MapWise. Our platform provides dynamic, up-to-the-minute maps that keep you informed and connected.",
    imageUrl: "/app-images/map.jpeg",
  },
  {
    title: "Real-time User Tracking",
    description:
      "Experience the power of real-time user tracking with MapWise. Our platform allows you to monitor user locations and movements in real-time, enhancing engagement and interaction.",
    imageUrl: "/app-images/users.jpeg",
  },
  {
    title: "Real-time Chat",
    description:
      "Experience the power of real-time chat with MapWise. Our platform enables instant communication, allowing users to connect and collaborate seamlessly.",
    imageUrl: "/app-images/chat.jpeg",
  },
];

export default function HomePage() {
  return (
    <main className="text-white absolute inset-0 h-full max-w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_2px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] overflow-x-hidden">
      <div className="h-[10vh] flex justify-between items-center p-4 lg:px-10">
        <h1 className="text-3xl font-bold">MapWise</h1>
        <ul>
          <li className="inline-block mx-4 text-lg font-medium cursor-pointer hover:text-blue-400">
            <GithubIcon />
          </li>
          <li className="inline-block mx-4 text-lg font-medium cursor-pointer hover:text-blue-400">
            <LinkedinIcon />
          </li>
        </ul>
      </div>
      {/* main content wrapper */}
      <div className="max-w-7xl mx-auto flex flex-col gap-20 justify-center items-center px-4 py-10">
        {/* Hero Section-1 */}
        <div className="flex flex-col justify-center items-center gap-4">
          <h3 className="text-5xl lg:text-7xl font-semibold w-full text-center pt-5 text-neutral-200">
            Maps that do more
          </h3>
          <p className="text-neutral-500 text-lg lg:text-xl font-medium text-center">
            A platform to catch lies of your insensitive friends and family.
          </p>
          <div className="flex flex-col lg:flex-row gap-5 text-lg lg:text-xl lg:pt-10">
            <Link href="/form">
              <button className="bg-blue-500 rounded-full text-white w-52 py-4">
                Create Room
              </button>
            </Link>
            <Link href="/form">
              <button className="bg-green-400 rounded-full text-white w-52 py-4">
                Join Room
              </button>
            </Link>
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
      z-10
    "
          />

          {/* Main Video (In Front) */}
          <video
            className="
      relative w-64 lg:w-sm rounded-2xl 
      shadow-2xl object-cover
      transform scale-100 group-hover:scale-105 transition-all duration-500 ease-in-out
      z-20
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

        {/* truested by */}
        <div className="flex w-full flex-col justify-center items-center gap-5 pt-10">
          <h1 className="text-4xl font-bold">Trusted By</h1>
          <ul className="flex gap-4">
            <li className="text-neutral-500 text-lg font-medium">Google</li>
            <li className="text-neutral-500 text-lg font-medium">Microsoft</li>
            <li className="text-neutral-500 text-lg font-medium">Meta</li>
            <li className="text-neutral-500 text-lg font-medium">Amazon</li>
            <li className="text-neutral-500 text-lg font-medium">Apple</li>
          </ul>
        </div>

        <div className="flex flex-col gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-shrink-0 flex-col lg:flex-row justify-center items-center w-full gap-4 lg:gap-10 pt-10 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <Image
                width={300}
                height={300}
                src={feature.imageUrl}
                alt={`${feature.title} Image`}
                className="lg:w-xs object-cover rounded-2xl"
              />
              <div className="flex flex-col justify-center items-center gap-5 max-w-xs">
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
