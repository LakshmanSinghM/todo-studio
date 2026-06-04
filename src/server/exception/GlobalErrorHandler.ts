
import { NextResponse } from "next/server";
import { ResponseBuilder } from "../utils/ResponseBuilder";

export class GlobalErrorHandler {

    static handleError(error: unknown) {
        let message = "Internal server error";
        let statusCode = 500;
        let error_code = "";

        if (error instanceof Error) {
            message = error?.message?.toLocaleLowerCase();
        }

        // Optional: map specific errors to status codes
        if (message.includes("not found") || (message.includes("doesn't exists")) || message.includes("not exists")) {
            error_code = "not_found";
            statusCode = 404;
        }

        if (message.includes("duplicate") || message.includes("already exists")) {

            error_code = "duplicate";
            statusCode = 409;
            message = "already exists"
        }


        // Log error for debugging
        console.error("GlobalErrorHandler: === ", error);

        const errorResponse = ResponseBuilder.buildResponseWithErrorMessage(message);
        return NextResponse.json({ ...errorResponse, status_code: statusCode, error_code: error_code }, { status: statusCode });
    }
}