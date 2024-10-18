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
import { deleteBudget } from "@/lib/actions/budget";
import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBudgetDialog({
    budgetId,
    redirectOnDelete,
}: {
    budgetId: string,
    redirectOnDelete?: boolean,
}) {
    const [ isPending, startTransition ] = useTransition();
    const [ deletionInProgress, setDeletionInProgress ] = useState<boolean>(false);
    const router = useRouter();
    const handleDeleteBudget = useCallback( async (budgetId: string) => {
        setDeletionInProgress(true);
        await deleteBudget(budgetId, redirectOnDelete);
        if (!redirectOnDelete) {
            startTransition(() => router.refresh());
        }
        setDeletionInProgress(false);
    }, []);

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
                        onClick={() => handleDeleteBudget(budgetId)}
                        aria-disabled={deletionInProgress}
                    >
                        Delete
                    </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}