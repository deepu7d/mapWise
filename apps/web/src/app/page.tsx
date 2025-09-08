import MainForm from "@/components/MainForm";
import { Suspense } from "react";

// A simple loading component to show as a fallback
function Loading() {
  return <div className="text-gray-500">Loading form...</div>;
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<Loading />}>
        <MainForm />
      </Suspense>
    </main>
  );
}
