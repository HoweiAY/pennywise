export type RouteHandlerResponse<T> = { data?: T | null };

export type DataResponse<T> = {
    status: "success" | "fail" | "error",
    data?: { [name: string | number]: T } | null,
    message?: string,
};