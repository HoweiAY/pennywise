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
import { countryCodes } from "@/lib/utils/constant";
import { formatCurrencyAmount } from "@/lib/utils/format";
import { userProfileErrorMessage } from "@/lib/utils/helper";
import { UserData, UserBalanceData } from "@/lib/types/user";
import { UserProfileFormState } from "@/lib/types/form-state";
import { updateUserProfile, updateUserAvatar } from "@/lib/actions/user";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Avatar, AvatarProps } from "@files-ui/react";
import { useState, useMemo, useCallback, createRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import "cropperjs/dist/cropper.css";

export default function UserSettingsForm({
  userId,
  userData,
  userBalanceData,
}: {
  userId: string;
  userData: UserData;
  userBalanceData: UserBalanceData;
}) {
  const [avatarSrc, setAvatarSrc] = useState<AvatarProps["src"] | undefined>(
    userData.avatar_url || avatarDefault.src
  );
  const [showImgCropper, setShowImgCropper] = useState<boolean>(false);
  const [avatarReady, setAvatarReady] = useState<boolean>(true);
  const [spendingLimit, setSpendingLimit] = useState<string>(
    formatCurrencyAmount(userBalanceData.spending_limit) || ""
  );
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const imgCropperRef = createRef<ReactCropperElement>();

  const avatarStyle = useMemo(
    () => ({
      width: "100px",
      height: "100px",
      margin: "8px",
      borderWidth: "2px",
      "--tw-border-opacity": "1",
      borderColor: "#374151",
    }),
    []
  );

  const imgCropperStyle = {
    height: 400,
    width: "100%",
  };

  const handleAvatarChange = (
    fileSrc: AvatarProps["src"] | undefined,
    toggleCropper: boolean = true,
    readyForUpload: boolean = false
  ) => {
    setAvatarSrc(fileSrc);
    setShowImgCropper(toggleCropper);
    setAvatarReady(readyForUpload);
  };

  const handleSaveSettings = useCallback(
    async (prevState: UserProfileFormState | undefined, formData: FormData) => {
      setSaving(true);
      setUpdateSuccess(false);
      setErrorMessage("");

      try {
        let avatarUrl = userData.avatar_url ?? null;
        if (avatarSrc) {
          if (!avatarReady || avatarSrc instanceof File) {
            setErrorMessage("Please select and crop an image first");
            setSaving(false);
            return;
          }
          if (avatarSrc !== avatarUrl) {
            const {
              status: avatarStatus,
              message: avatarMessage,
              data: avatarUrlData,
            } = await updateUserAvatar(userId, avatarSrc);
            if (avatarStatus !== "success" || !avatarUrlData) {
              console.error(avatarMessage);
              throw new Error("Failed to upload user avatar");
            }
            avatarUrl = avatarUrlData["publicUrl"];
          }
        }
        if (avatarUrl) {
          formData.append("avatar_url", avatarUrl);
        }

        const formState = await updateUserProfile(prevState, formData);
        if (formState?.error || formState?.message) {
          console.error(formState.message);
          setErrorMessage(userProfileErrorMessage(formState));
        } else {
          setUpdateSuccess(true);
        }
        return formState;
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "An error has occurred"
        );
      } finally {
        setSaving(false);
      }
    },
    [userData, avatarSrc, avatarReady]
  );

  const [error, dispatch] = useFormState(handleSaveSettings, undefined);

  return (
    <form action={dispatch} className="mt-6 mb-2 max-md:mt-4">
      <div className="grid grid-flow-row grid-cols-3 py-4">
        <section className="col-span-2 max-md:col-span-full flex flex-col mb-2">
          <label htmlFor="first_name" className="mb-1 text-lg font-semibold">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={userData.username ?? undefined}
            className="w-11/12 max-md:w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
            placeholder="Enter a username"
            required
          />
          <div className="flex items-center gap-2 w-11/12 max-md:w-full mt-4 mb-1">
            <div className="w-1/2">
              <label htmlFor="first_name" className="text-lg font-semibold">
                First name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                defaultValue={userData.first_name ?? undefined}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="First name"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="last_name" className="text-lg font-semibold">
                Last name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                defaultValue={userData.last_name ?? undefined}
                className="w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
                placeholder="Last name"
              />
            </div>
          </div>
          <label
            htmlFor="first_name"
            className="mt-4 mb-1 text-lg font-semibold"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            defaultValue={userData.email ?? undefined}
            className="w-11/12 max-md:w-full h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
            placeholder="example@email.com"
            required
          />
          <label htmlFor="country" className="mt-4 mb-1 text-lg font-semibold">
            Country
          </label>
          <div className="relative w-11/12 max-md:w-full">
            <select
              id="country"
              name="country"
              defaultValue={userData.country || ""}
              className="appearance-none rounded-md w-full h-8 px-3 border border-gray-300 text-sm max-md:text-xs bg-white placeholder:text-gray-500 focus:border-gray-400"
            >
              <option value={""}>Choose a country...</option>
              {Object.entries(countryCodes).map(([code, country], index) => {
                return (
                  <option key={code} value={code}>
                    {country}
                  </option>
                );
              })}
            </select>
            <ChevronDownIcon className="absolute top-2 right-2.5 w-4 h-4 text-gray-500" />
          </div>
          <label
            htmlFor="spending_limit"
            className="mt-4 mb-1 text-lg font-semibold"
          >
            Spending limit (in {userBalanceData.currency})
          </label>
          <div className="flex justify-between items-center gap-2 w-11/12 max-md:w-full mb-1">
            <input
              id="spending_limit"
              name="spending_limit"
              type="number"
              className="w-3/4 h-8 p-3 border border-gray-300 rounded-md text-sm max-md:text-xs"
              placeholder="Enter an amount (e.g., 1000)"
              value={spendingLimit}
              onChange={(e) => setSpendingLimit(e.target.value)}
              min={0}
              step={0.01}
            />
            <div
              className="w-1/4 p-2 border-0 rounded-lg text-center max-md:text-sm text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:cursor-pointer shadow-md shadow-slate-300 duration-200"
              onClick={() => setSpendingLimit("")}
            >
              Reset
            </div>
          </div>
        </section>
        <section className="col-span-1 max-md:col-span-full flex flex-col max-md:flex-row items-center gap-2 border border-slate-100 rounded-md h-fit px-4 pt-3 pb-4 max-md:my-2 bg-white shadow-md">
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
          <div className="flex flex-col md:text-center">
            <h2 className="text-base lg:text-lg max-md:text-lg font-semibold">
              User avatar
            </h2>
            <p className="text-xs lg:text-sm max-md:text-xs text-gray-500">
              Upload an image as your avatar
            </p>
            <p className="mt-3 mb-2 text-xs text-gray-400">
              *Supported file types: .jpeg, .png (max. 4 MB)
            </p>
            <label
              htmlFor="user_avatar"
              className="w-full mb-3 p-2 border-0 rounded-lg text-sm text-center text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:cursor-pointer aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
              aria-disabled={saving}
            >
              Choose an avatar
            </label>
            <input
              id="user_avatar"
              name="user_avatar"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files?.[0])}
            />
          </div>
          <Dialog open={showImgCropper} onOpenChange={setShowImgCropper}>
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
                  src={
                    avatarSrc instanceof File
                      ? URL.createObjectURL(avatarSrc)
                      : avatarSrc
                  }
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
                    onClick={() =>
                      handleAvatarChange(
                        imgCropperRef.current?.cropper
                          ?.getCroppedCanvas()
                          ?.toDataURL() || avatarDefault.src,
                        false,
                        true
                      )
                    }
                  >
                    Confirm
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </div>
      <div className="flex justify-center items-center w-full text-center text-sm max-md:text-xs">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {updateSuccess && (
          <p className="flex flex-row justify-center gap-1 w-full max-md:w-full text-green-500">
            <CheckCircleIcon className="w-5 h-5 max-md:w-4 max-md:h-4" />
            User profile updated successfully!
          </p>
        )}
      </div>
      <div className="flex flex-row justify-between items-center my-6">
        <Link
          href={"/dashboard"}
          className="border rounded-md px-4 py-2 text-center max-md:text-sm font-semibold bg-white hover:bg-sky-100 hover:text-blue-600 shadow-md shadow-slate-300 duration-200"
        >
          Cancel
        </Link>
        <SaveSettingsButton />
      </div>
    </form>
  );
}

function SaveSettingsButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="border-0 rounded-md px-6 py-2 text-center text-white max-md:text-sm font-semibold bg-blue-500 hover:bg-blue-600 shadow-md shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors duration-200"
      aria-disabled={pending}
    >
      Save
    </button>
  );
}
