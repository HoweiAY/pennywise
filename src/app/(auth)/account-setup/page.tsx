"use client";

import GeneralInfoForm from "@/components/auth/account-setup/general-info-form";
import BalanceBudgetForm from "@/components/auth/account-setup/balance-budget-form";
import { MobileSetupBreadcrumbs } from "@/components/auth/account-setup/setup-breadcrumbs";
import { AccountSetupFormState } from "@/lib/types/form-state";
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AccountSetupPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ step, setStep ] = useState<1 | 2 | 3>(1);
    const [ formData, setFormData ] = useState<AccountSetupFormState>({});

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

    const handleUpdateFormData = (data: AccountSetupFormState) => {
        setFormData({
            ...formData,
            ...data,
        });
    };

    const handleSubmitFormData = async (data: AccountSetupFormState) => {
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
                    formData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
            2: <BalanceBudgetForm
                    formData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
            3: <BalanceBudgetForm 
                    formData={formData}
                    handleUpdateFormData={handleUpdateFormData}
                    handleSubmitFormData={handleSubmitFormData}
                    handleStepChange={handleStepChange}
                />,
        };
        return stepForms[step];
    }

    return (
        <div className="flex flex-col w-7/12 max-md:w-full md:h-[450px] max-md:min-h-[400px]">
            <MobileSetupBreadcrumbs />
            {displayForm(step)}
        </div>
    );
} 