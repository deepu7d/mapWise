import MainForm from "@/components/Form/MainForm";
import { Suspense } from "react";

function Loading() {
  return <div className="text-gray-500">Loading form...</div>;
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh max-w-xl mx-auto border-gray-200 shadow-md">
      <Suspense fallback={<Loading />}>
        <MainForm />
      </Suspense>
    </main>
  );
}
