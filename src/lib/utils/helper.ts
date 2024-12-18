import { AuthFormState, UserProfileFormState, TransactionFormState, BudgetFormState } from "@/lib/types/form-state";
import { unescape } from "querystring";

export function amountPercentageChange(oldAmountInCents: number, newAmountInCents: number): number {
    return ((newAmountInCents - oldAmountInCents) / Math.max(oldAmountInCents, 1)) * 100;
}

export function authErrorMessage(error: AuthFormState | undefined): string {
    let errorMessage = "An error has occurred";
    if (error) {
        if (error.error) {
            const { username, email, password } = error.error;
            if (username) return username[0];
            if (email) return email[0];
            if (password) return password[0];
        }
        if (error.message) errorMessage = error.message;
    }
    return errorMessage;
}

export function userProfileErrorMessage(error: UserProfileFormState | undefined): string {
    let errorMessage = "An error has occurred";
    if (error) {
        if (error.error) {
            const { username, email, country } = error.error;
            if (username) return username[0];
            if (email) return email[0];
            if (country) return country[0];
        }
        if (error.message) errorMessage = error.message;
    }
    return errorMessage;
}

export function transactionErrorMessage(error: TransactionFormState | undefined): string {
    let errorMessage = "An error has occurred";
    if (error) {
        if (error.error) {
            const { title, amount, type } = error.error;
            if (title) return title[0];
            if (amount) return amount[0];
            if (type) return type[0];
        }
        if (error.message) errorMessage = error.message;
    }
    return errorMessage;
}

export function budgetErrorMessage(error: BudgetFormState | undefined): string {
    let errorMessage = "An error has occurred";
    if (error) {
        if (error.error) {
            const { name, amount, category } = error.error;
            if (name) return name[0];
            if (amount) return amount[0];
            if (category) return category[0];
        }
        if (error.message) errorMessage = error.message;
    }
    return errorMessage;
}

export function dataUrlToBlob(dataUrl: string): Blob {
    try {
        const splitUrl = dataUrl.split(",");
        const mimeType = splitUrl[0].match(/:(.*?);/)![1];
        const bStr = splitUrl[0].indexOf("base64") >= 0 ? atob(splitUrl[1]) : unescape(splitUrl[1]);
        const u8arr = new Uint8Array(bStr.length);
        for (let i = 0; i < bStr.length; i++) {
            u8arr[i] = bStr.charCodeAt(i);
        }
        return new Blob([u8arr], { type: mimeType });
    } catch (error) {
        throw new Error("Failed to convert file from data URL");
    }
}