import MainForm from "@/components/Form/MainForm";
import { Suspense } from "react";

function Loading() {
  return <div className="text-gray-500">Loading form...</div>;
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh max-w-lg mx-auto bg-gray-100">
      <Suspense fallback={<Loading />}>
        <MainForm />
      </Suspense>
    </main>
  );
}
