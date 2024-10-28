export type ServerActionResponse<T> = {
    status: "success" | "fail" | "error",
    data?: { [name: string | number]: T } | null,
    message?: string,
}