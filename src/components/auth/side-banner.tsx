import { PennyWiseLogo } from "@/components/common/logo";

export default function SideBanner() {
    return (
        <div className="flex flex-col justify-center items-center md:w-1/2 md:h-full p-6 bg-stone-100 md:bg-gradient-to-br md:from-pink-500 md:via-purple-700 md:to-blue-600 max-md:border-b">
            <PennyWiseLogo
                className="p-1 border-2 border-slate-50 shadow-xl rounded-2xl bg-transparent max-md:hidden"
                width={128}
                height={128}
                hiddenOnLargeScreen={false}
            />
            <PennyWiseLogo
                className="p-1 border-2 border-slate-50 shadow-xl rounded-2xl bg-gradient-to-br from-pink-500 via-purple-700 to-blue-600"
                width={72}
                height={72}
                hiddenOnLargeScreen={true}
            />
            <h1 className="m-3 text-white text-center text-4xl max-md:text-3xl font-bold max-md:m-2 max-md:py-1 max-md:text-transparent max-md:bg-clip-text max-md:bg-gradient-to-r max-md:from-blue-600 max-md:via-purple-700 max-md:to-pink-500">
                PennyWise
            </h1>
            <p className="md:mt-6 text-gray-50 max-md:text-gray-700 text-center text-lg max-lg:text-base max-md:text-sm">
                A smarter way to manage your finance.
            </p>
        </div>
    )
}