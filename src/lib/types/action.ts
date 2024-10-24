export type ServerActionResponse<T> = {
    status: "success" | "fail" | "error",
    code: number,
    data?: { [name: string | number]: T } | null,
    message?: string,
};