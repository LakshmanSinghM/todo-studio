import { getTasks, saveTasks } from "@/server/lib/file-storage";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const tasks = await getTasks();

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return ResponseBuilder.buildNotFoundResponse(
            ResponseBuilder.buildResponseWithErrorMessage("The task is not found")
        )
    }

    task.completed = !task.completed;

    task.updatedAt = new Date().toISOString();

    await saveTasks(tasks);

    return ResponseBuilder.buildApiOkResponse(
        ResponseBuilder.buildSuccessResponse(task, "Toggled successfully")
    );
}