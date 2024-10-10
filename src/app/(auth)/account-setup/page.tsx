"use client";

import GeneralInfoForm from "@/components/auth/account-setup/general-info-form";
import AvatarUploadForm from "@/components/auth/account-setup/avatar-upload-form";
import BalanceBudgetForm from "@/components/auth/account-setup/balance-budget-form";
import { SetupBreadcrumbs, MobileSetupBreadcrumbs } from "@/components/auth/account-setup/setup-breadcrumbs";
import { AccountSetupFormData } from "@/lib/types/form-state";
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AccountSetupPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ step, setStep ] = useState<1 | 2 | 3>(1);
    const [ formData, setFormData ] = useState<AccountSetupFormData>({});

    useEffect(() => {
        const currStep = searchParams.get("step");
        if (currStep) {
            if (isNaN(parseInt(currStep)) || parseInt(currStep) < 1 || parseInt(currStep) > 3) {
                handleStepChange(1);
                return;
            }
            const stepNum = parseInt(currStep) as 1 | 2 | 3;
            handleStepChange(stepNum);
        } else {
            handleStepChange(1);
        }
    }, []);

    const handleStepChange = (step: 1 | 2 | 3) => {
        const params = new URLSearchParams(searchParams);
        params.set("step", step.toString());
        replace(`${pathname}?${params.toString()}`);
        setStep(step);
    };

    const handleUpdateFormData = (data: AccountSetupFormData) => {
        setFormData({
            ...formData,
            ...data,
        });
    };

    const handleSubmitFormData = async (data: AccountSetupFormData) => {
        const supabase = await createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error("User not found");
        }
        const { error } = await supabase
            .from("users")
            .update(data)
            .eq("user_id", user.id);
        if (error) throw error;
    };

    const displayForm = (step: 1 | 2 | 3) => {
        const stepForms = {
            1: <GeneralInfoForm
                    prevFormData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
            2: <AvatarUploadForm
                    prevFormData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
            3: <BalanceBudgetForm 
                    prevFormData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
        };
        return stepForms[step];
    }

    return (
        <main className="flex flex-col justify-between border rounded-2xl shadow-2xl w-8/12 max-lg:w-10/12 max-md:w-3/4 md:h-[600px] min-w-[400px] min-h-[400px] p-6 bg-white overflow-hidden">
            <header className="md:p-2">
                <h1 className="text-4xl max-lg:text-3xl font-bold">
                    Let's get you started!
                </h1>
                <p className="my-1 max-lg:text-sm text-gray-500">
                    Set up your account to start using PennyWise 🤗
                </p>
            </header>
            <div className="flex flex-row justify-center items-center gap-1">
                <SetupBreadcrumbs />
                <div className="flex flex-col w-7/12 max-md:w-full md:h-[450px] max-md:min-h-[400px]">
                    <MobileSetupBreadcrumbs />
                    {displayForm(step)}
                </div>
            </div>
        </main>
    );
} 