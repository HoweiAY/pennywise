import Image from "next/image";
import pennywiseLogoWhite from "../../../public/icons/pennywise-logo-white.svg";
import clsx from "clsx";

export function PennyWiseLogo({
    className,
    width,
    height,
    hiddenOnLargeScreen,
}: {
    className?: string,
    width?: number,
    height?: number,
    hiddenOnLargeScreen: boolean
}) {
    return (
        <Image
            priority
            src={pennywiseLogoWhite}
            width={width || 60}
            height={height || 60}
            alt="PennyWise Logo"
            className={clsx(
                className ? className : "p-1 border-2 border-slate-50 shadow-xl rounded-2xl bg-gradient-to-br from-pink-500 via-purple-700 to-blue-600",
                { "md:hidden": hiddenOnLargeScreen },
            )}
        />
    )
}