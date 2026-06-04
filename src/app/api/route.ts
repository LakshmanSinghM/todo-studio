import { withErrorHandling } from "@/server/exception/withErrorHandling";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";
import { NextRequest } from "next/server";

export const GET = withErrorHandling(async () => {

    // const body = await req.json();

    // const validation = ResponseBuilder.validateWithZod(addressSchema, body);

    // if (!validation.success) {
    //     return validation.response;
    // }

    return ResponseBuilder.buildApiOkResponse(ResponseBuilder.buildSuccessResponse(null, "API working successfully"));
});