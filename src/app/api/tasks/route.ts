import { getTasks } from "@/server/lib/file-storage";
import { createTask } from "@/server/lib/task-store";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";
import { createTaskSchema } from "@/validation-schema/todo-schema";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {

    const tasks = await getTasks();
    const status = req.nextUrl.searchParams.get("status");
    const search = req.nextUrl.searchParams.get("q");

    let filtered = tasks;

    if (status === "active") {
        filtered = filtered.filter(t => !t.completed);
    }

    if (status === "completed") {
        filtered = filtered.filter(t => t.completed);
    }

    if (search) {
        filtered = filtered.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
    }

    return ResponseBuilder.buildApiOkResponse(
        ResponseBuilder.buildSuccessResponse(filtered, "Fetched the tasks successfully"));
}

export async function POST(req: Request) {

    const body = await req.json();

    const validation = ResponseBuilder.validateWithZod(createTaskSchema, body);

    if (!validation.success) {
        console.warn("Todo creation validation failed", { errors: validation });
        return validation.response;
    }

    const task = await createTask(validation.data);

    return ResponseBuilder.buildCreateApiResponse(
        ResponseBuilder.buildSuccessResponse(task, "Task created successfully"));
}