import { NextResponse } from "next/server";
import { ApiResponse, ApiResponseWithErrors, } from "@/types/apiTypes";

export class ResponseBuilder {

    // --- BAD REQUEST (400) ---
    static buildBadRequestResponse<T>(response: ApiResponse<T>) {
        return NextResponse.json(response, { status: 400 });
    }

    // --- NOT FOUND (404) ---
    static buildNotFoundResponse<T>(response: ApiResponse<T>) {
        return NextResponse.json(response, { status: 404 });
    }

    // --- CREATED (201) ---
    static buildCreateApiResponse<T>(response: ApiResponse<T>) {
        return NextResponse.json(response, { status: response.success ? 201 : 400 });
    }

    // --- OK (200/400) ---
    static buildApiOkResponse<T>(response: ApiResponse<T>) {
        return NextResponse.json(response, { status: response.success ? 200 : 400 });
    }

    static buildApiNoContentResponse() {
        return new NextResponse(null, { status: 204 });
    }
    // --- OK (501/) ---
    static buildInternalServerErrorResponse<T>(response: ApiResponse<T>) {
        return NextResponse.json(response, { status: response.success ? 200 : 501 });
    }


    // --- SUCCESS RESPONSE OBJECT ---
    static buildSuccessResponse<T>(data: T, message: string): ApiResponse<T> {
        return { data, message, success: true };
    }


    // --- ERROR WITH VALIDATION DETAILS ---
    static buildResponseWithErrors<T>(message: string, errors: Record<string, string>): ApiResponseWithErrors<T> {
        return {
            data: null as any,
            message,
            success: false,
            errors,
        };
    }

    // --- ERROR WITH MESSAGE ONLY ---
    static buildResponseWithErrorMessage<T>(message: string): ApiResponse<T> {
        return {
            data: null as any,
            message,
            success: false,
        };
    }

    // --- ZOD VALIDATION HANDLER ---
    static validateWithZod<T>(schema: any, data: unknown) {
        const parsed = schema.safeParse(data);

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};

            parsed.error.errors.forEach((err: any) => { if (err.path.length > 0) fieldErrors[err.path[0]] = err.message; });
            const errorResponse = this.buildResponseWithErrors<T>("Validation failed", fieldErrors);

            return { success: false, response: this.buildBadRequestResponse(errorResponse) };
        }
        return { success: true, data: parsed.data };
    }
}