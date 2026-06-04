import { getTasks, saveTasks } from "@/server/lib/file-storage";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";

export async function PATCH(request: Request) {
    
    const { taskId, newPosition } = await request.json();
    const tasks = await getTasks();

    const index = tasks.findIndex(t => t.id === taskId);
    const [task] = tasks.splice(index, 1);

    tasks.splice(newPosition, 0, task);

    tasks.forEach((task, index) => {
        task.position = index;
    });

    await saveTasks(tasks);

    return ResponseBuilder.buildApiOkResponse(
        ResponseBuilder.buildSuccessResponse(tasks, "Reordered successfully")
    )
}