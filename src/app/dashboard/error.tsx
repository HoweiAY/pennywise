"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-row max-md:flex-col justify-center items-center gap-2 h-[80%] mx-6 overflow-hidden">
      <ExclamationTriangleIcon className="w-36 min-w-36 text-rose-600" />
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl max-lg:text-xl max-md:text-2xl font-bold">
          Oops! Something went wrong :{`(`}
        </h2>
        <p className="my-1 max-lg:text-sm text-gray-500">
          An error has occurred while loading the page
        </p>
        <div className="self-center flex justify-center items-center gap-4 mt-4 max-md:mt-2">
          <button
            className="border rounded-md px-4 py-2 text-center max-lg:text-sm bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200"
            onClick={reset}
          >
            Try again
          </button>
          <Link
            href={"/dashboard"}
            className="border-0 rounded-md px-4 py-2 text-center text-white max-lg:text-sm font-semibold bg-blue-500 hover:bg-blue-600 shadow-md shadow-slate-300 duration-200"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
