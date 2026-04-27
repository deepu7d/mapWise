import MainForm from "@/components/Form/MainForm";
import { Suspense } from "react";

function Loading() {
  return <div className="text-gray-500">Loading form...</div>;
}

export default function HomePage() {
  return (
    <main className="mx-auto flex h-dvh max-w-xl flex-col items-center justify-center border-gray-200 shadow-md">
      <Suspense fallback={<Loading />}>
        <p classname="text-red-400">Connection to server may take more than a minute because the backend is deployed on a free Server (Render)</p>
        <MainForm />
      </Suspense>
    </main>
  );
}
