
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";

export const GET = (async () => {
    return ResponseBuilder.buildApiOkResponse(ResponseBuilder.buildSuccessResponse(null, "API working fine"));
});