import Image from "next/image";
import pennywiseLogoWhite from "../../../public/icons/pennywise-logo-white.svg";
import clsx from "clsx";

export default function PennyWiseLogo({ isTopBarLogo } : { isTopBarLogo: boolean | undefined }) {
    return (
        <Image
            priority
            src={pennywiseLogoWhite}
            width={60}
            height={60}
            alt="PennyWise Logo"
            className={clsx(
                "p-1 border-2 border-slate-50 shadow-xl rounded-2xl bg-gradient-to-br from-pink-500 via-purple-700 to-blue-600",
                { "md:hidden": isTopBarLogo },
            )}
        />
    );
}