"use client";

import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToastAction } from "@/components/ui/toast";
import { deleteBudget } from "@/lib/actions/budget";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DeleteBudgetDialog({
    budgetId,
    redirectOnDelete,
}: {
    budgetId: string,
    redirectOnDelete?: boolean,
}) {
    const [ isPending, startTransition ] = useTransition();
    const [ deletionInProgress, setDeletionInProgress ] = useState<boolean>(false);
    const { refresh } = useRouter();
    const { toast } = useToast();

    const handleDeleteBudget = useCallback(async () => {
        setDeletionInProgress(true);
        const error = await deleteBudget(budgetId, redirectOnDelete);
        if (error) {
            toast({
                variant: "destructive",
                title: "Delete budget failed",
                description: "An error has occurred while deleting the budget",
                action: (
                    <ToastAction altText="Try again" onClick={handleDeleteBudget}>
                        Try again
                    </ToastAction>
                )
            });
            console.error(error.message);
        } else {
            if (!redirectOnDelete) {
                startTransition(refresh);
            }
            toast({
                title: "Delete successful!",
                description: "Your budget has been deleted.",
            });
        }
        setDeletionInProgress(false);
    }, [budgetId, redirectOnDelete]);

    return (
        <AlertDialogContent className="rounded-lg">
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete this budget?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This budget will be deleted from your account permanently.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel className="bg-white hover:bg-sky-100 hover:text-blue-600 font-semibold shadow-md shadow-slate-300 duration-200">
                    Cancel
                </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-rose-500 text-white font-semibold hover:bg-rose-600 shadow-md shadow-slate-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 duration-200"
                        onClick={handleDeleteBudget}
                        aria-disabled={deletionInProgress}
                    >
                        Delete
                    </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}