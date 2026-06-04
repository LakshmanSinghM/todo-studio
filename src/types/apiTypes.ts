export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ApiResponseWithErrors<T = any> extends ApiResponse<T> {
    errors?: Record<string, string>;
}