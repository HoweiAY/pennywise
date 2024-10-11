"use client";

import avatarDefault from "@/ui/icons/avatar-default.png";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Cropper, ReactCropperElement } from "react-cropper";
import { PlusCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { dataUrlToBlob } from "@/lib/utils/helper";
import { AccountSetupFormData } from "@/lib/types/form-state";
import { Avatar, AvatarProps } from "@files-ui/react";
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/client";
import { useState, createRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";
import "cropperjs/dist/cropper.css";

export default function AvatarUploadForm({
    prevFormData,
    handleUpdateFormData,
    handleSubmitFormData,
    handleStepChange,
}: {
    prevFormData: AccountSetupFormData,
    handleUpdateFormData: (data: AccountSetupFormData) => void,
    handleSubmitFormData: (data: AccountSetupFormData) => Promise<void>,
    handleStepChange: (step: 1 | 2 | 3) => void,
}) {
    const [ avatarSrc, setAvatarSrc ] = useState<AvatarProps["src"] | undefined>(avatarDefault.src);
    const [ showImgCropper, setShowImgCropper ] = useState<boolean>(false);
    const [ avatarReady, setAvatarReady ] = useState<boolean>(false);
    const [ avatarUploaded, setAvatarUploaded ] = useState<boolean>(false);
    const imgCropperRef = createRef<ReactCropperElement>();
    
    const avatarStyle = {
        width: "100px",
        height: "100px",
        margin: "10px",
        "borderWidth": "2px",
        "--tw-border-opacity": "1",
        "borderColor": "#374151",
    };

    const imgCropperStyle = {
        height: 400,
        width: "100%",
    };

    const handleAvatarChange = (
        fileSrc: AvatarProps["src"] | undefined,
        toggleCropper: boolean = true,
        readyForUpload: boolean = false,
    ) => {
        setAvatarUploaded(false);
        setAvatarSrc(fileSrc);
        setShowImgCropper(toggleCropper);
        setAvatarReady(readyForUpload);
    };

    const handleSumbit = async (
        prevState: { message: string } | undefined,
        formData: FormData,
    ) => {
        try {
            setAvatarUploaded(false);
            if (!avatarReady || avatarSrc instanceof File || !avatarSrc) {
                return { message: "Please select and crop an image first" };
            }
            const avatarBlob = dataUrlToBlob(avatarSrc);
            const supabase = await createSupabaseBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not found");
            }
            const avatarUrl = `${user.id}.${avatarBlob.type.split("/")[1]}`;
            const { data: avatarUploadData, error } = await supabase
                .storage
                .from("avatars")
                .upload(avatarUrl, avatarBlob, {
                    cacheControl: "3600",
                    upsert: true,
                });
            if (error) {
                return { message: error.message };
            }
            const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(avatarUploadData.path);
            const updatedFormData = { avatar_url: publicUrlData.publicUrl };
            await handleSubmitFormData(updatedFormData);
            handleUpdateFormData(updatedFormData);
            setAvatarUploaded(true);
        } catch (error) {
            handleAvatarChange(avatarSrc, false, false);
            return { message: "Cannot upload avatar. Please try again" };
        }
    };

    const [ error, dispatch ] = useFormState(handleSumbit, undefined);

    return (
        <form
            action={dispatch}
            className="flex flex-col justify-between max-md:gap-6 md:border-l border-gray-500 border-dashed w-full h-full min-h-[300px] md:px-6 py-3"
        >
            <section className="flex flex-col items-center">
                <div className="relative">
                    <Avatar 
                        src={avatarSrc}
                        alt="User avatar"
                        emptyLabel="Upload"
                        changeLabel="Upload"
                        variant="circle"
                        smartImgFit={false}
                        style={avatarStyle}
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleAvatarChange}
                        onError={() => setAvatarSrc(avatarDefault.src)}
                    />
                    <PlusCircleIcon className="absolute right-3 bottom-3 w-6 h-6 bg-white border-0 rounded-full" />
                </div>
                <h2 className="text-xl max-md:text-lg font-semibold">
                    Add a user avatar
                </h2>
                <p className="text-sm max-md:text-xs text-gray-500">
                    Upload an avatar picture to express yourself 😎
                </p>
                <p className="my-2 text-xs text-gray-400">
                    *Supported file types: .jpeg, .png (max. 4 MB)
                </p>
                <UploadButton />
                <Dialog 
                    open={showImgCropper}
                    onOpenChange={setShowImgCropper}
                >
                    <DialogContent className="flex flex-col border rounded-xl max-w-[800px] min-h-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">
                                Crop your avatar picture
                            </DialogTitle>
                            <DialogDescription>
                                Resize your user avatar by cropping the image
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center w-full mt-2 border rounded-lg overflow-hidden">
                            <Cropper
                                ref={imgCropperRef}
                                src={avatarSrc instanceof File ? URL.createObjectURL(avatarSrc) : avatarSrc}
                                zoomTo={0.8}
                                autoCropArea={0.8}
                                aspectRatio={1}
                                viewMode={1}
                                checkOrientation={false}
                                guides={true}
                                minCropBoxWidth={10}
                                minCropBoxHeight={10}
                                style={imgCropperStyle}
                            />
                        </div>
                        <DialogFooter className="w-full">
                            <div className="flex flex-row justify-between items-center w-full mt-4 mb-2">
                                <DialogClose
                                    className="w-20 p-2 border-0 rounded-lg text-center max-md:text-sm font-semibold hover:cursor-pointer bg-gray-50 hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200"
                                    onClick={() => handleAvatarChange(avatarDefault.src, false)}
                                >
                                    Cancel
                                </DialogClose>
                                <DialogClose
                                    className="w-20 p-2 border-0 rounded-lg text-center text-white max-md:text-sm font-semibold hover:cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                                    onClick={() => handleAvatarChange(imgCropperRef.current?.cropper?.getCroppedCanvas()?.toDataURL() || avatarDefault.src, false, true)}
                                >
                                    Confirm
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <p className={clsx(
                    "flex flex-row justify-center gap-1 w-full max-md:w-full text-center text-sm max-md:text-xs text-red-500",
                    { "hidden": !error }
                )}>
                    <ExclamationCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                    {error?.message}
                </p>
                {avatarUploaded && 
                    <p className="flex flex-row justify-center gap-1 w-full max-md:w-full text-center text-sm max-md:text-xs text-green-500">
                        <CheckCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
                        Upload successful!
                    </p>
                }
            </section>
            <div className="flex flex-row justify-between w-full">
                <div 
                    className="w-24 max-md:w-20 p-2 border rounded-lg text-center max-md:text-sm font-semibold bg-gray-50 hover:bg-sky-100 hover:text-blue-600 hover:cursor-pointer shadow-md shadow-slate-300 duration-200"
                    onClick={() => handleStepChange(1)}
                >
                    Previous
                </div>
                <NextButton handleStepChange={handleStepChange} />
            </div>
        </form>
    )
}

function UploadButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="w-full my-6 p-2 border-0 rounded-lg text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
            aria-disabled={pending}
        >
            Upload
        </button>
    )
}

function NextButton({ handleStepChange }: { handleStepChange: (step: 1 | 2 | 3) => void } ) {
    return (
        <button
            className="w-20 max-md:w-16 p-2 border-0 rounded-lg text-white max-md:text-sm font-semibold hover:cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
            onClick={() => handleStepChange(3)}
        >
            Next
        </button>
    )
}