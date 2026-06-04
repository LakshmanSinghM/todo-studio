import { NextRequest, NextResponse } from "next/server";
import { GlobalErrorHandler } from "./GlobalErrorHandler";

export function withErrorHandling(handler: (req: Request) => Promise<NextResponse> | NextResponse) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      return GlobalErrorHandler.handleError(error);
    }
  };
}

export function withErrorHandlingWithContext(handler: (req: NextRequest, context?: { params?: Record<string, string> })
  => Promise<NextResponse> | NextResponse) {

  return async (req: NextRequest, context: { params?: Record<string, string> } = {})
    : Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return GlobalErrorHandler.handleError(error);
    }
  };
}