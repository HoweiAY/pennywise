import { PennyWiseLogo } from "@/components/common/logo";
import heroBannerImg from "../../public/images/pennywise_dashboard_devices.png";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-100 via-pink-300 to-sky-400">
      <nav className="flex flex-row justify-between items-center border-b border-gray-200 shadow-sm h-20 px-16 max-md:px-6 bg-sky-50 max-md:bg-white sticky top-0 z-20">
        <Link
          href={"/"}
          className="flex flex-row items-center gap-2 max-md:gap-1"
        >
          <PennyWiseLogo width={56} height={56} hiddenOnLargeScreen={false} />
          <h1 className="inline-block ml-2 text-transparent text-2xl max-md:text-xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 via-purple-700 to-pink-500 duration-75">
            PennyWise
          </h1>
        </Link>
        <div className="flex flex-row justify-end items-center gap-4 max-md:gap-2">
          <Link
            href={"/signup"}
            className="border-0 rounded-xl max-md:rounded-lg px-6 py-2 max-md:px-4 text-center text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 duration-200"
          >
            Sign up
          </Link>
          <Link
            href={"/login"}
            className="border border-slate-600 rounded-xl max-md:rounded-lg px-6 py-2 max-md:px-4 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 duration-200"
          >
            Login
          </Link>
        </div>
      </nav>
      <section className="flex flex-row max-md:flex-col justify-center items-center gap-4 px-32 md:pb-8 max-lg:px-16 max-md:px-8 mt-[max(100px,16dvh)] max-md:mt-20">
        <div className="flex flex-col justify-center max-md:items-center gap-4 md:w-[50%]">
          <h1 className="text-5xl max-md:text-4xl max-md:text-center text-slate-800 font-bold">
            A smarter way to manage your finance
          </h1>
          <p className="max-sm:text-sm max-md:text-center text-slate-700">
            PennyWise is a finance management platform helping you manage your
            finances smarter,{" "}
            <span className="inline-block text-transparent font-bold bg-clip-text bg-gradient-to-r from-blue-600 via-purple-700 to-pink-500">
              wiser
            </span>
            . Get started to track expenses, manage transactions, create budgets
            and pay friends with ease.
          </p>
          <Link
            href={"/signup"}
            className="border-0 rounded-lg border-slate-700 w-fit px-6 py-2 max-md:mt-2 text-white md:text-lg font-semibold shadow-md bg-gray-900 hover:bg-black duration-200"
          >
            Get started
          </Link>
        </div>
        <div className="flex flex-row justify-center items-center md:w-[50%]">
          <Image
            priority
            src={heroBannerImg.src}
            width={750}
            height={500}
            alt="PennyWise dashboard page screenshot on devices"
          />
        </div>
      </section>
    </main>
  );
}
