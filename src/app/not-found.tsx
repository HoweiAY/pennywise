import { WindowIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found - PennyWise",
};

export default function NotFound() {
  return (
    <main className="flex flex-row max-md:flex-col justify-center items-center gap-2 h-screen mx-6 overflow-hidden">
      <WindowIcon className="w-36 max-md:w-32 min-w-36 max-md:min-w-32" />
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl max-lg:text-xl max-md:text-2xl font-bold">
          Page not found
        </h2>
        <p className="my-1 max-lg:text-sm text-gray-500">
          The page you are looking for does not exist
        </p>
        <Link
          href={"/"}
          className="border-0 rounded-md px-4 py-2 mt-4 max-md:mt-2 text-center text-white max-lg:text-sm font-semibold bg-blue-500 hover:bg-blue-600 shadow-md shadow-slate-300 duration-200"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
