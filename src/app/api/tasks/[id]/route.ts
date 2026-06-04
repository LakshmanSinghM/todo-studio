import { getTasks, saveTasks } from "@/server/lib/file-storage";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const body = await request.json();
    const tasks = await getTasks();

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return ResponseBuilder.buildNotFoundResponse(
            ResponseBuilder.buildResponseWithErrorMessage("Task not found")
        )
    }

    Object.assign(task, body);
    task.updatedAt = new Date().toISOString();
    await saveTasks(tasks);

    return ResponseBuilder.buildApiOkResponse(
        ResponseBuilder.buildSuccessResponse(task, "Updated  the task successfully"));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const tasks = await getTasks();
    const filtered = tasks.filter(t => t.id !== id);

    await saveTasks(filtered);
    return ResponseBuilder.buildApiNoContentResponse()
}