import { getTasks } from "@/server/lib/file-storage";
import { ResponseBuilder } from "@/server/utils/ResponseBuilder";

export async function GET() {
    const tasks = await getTasks();

    const payload = {
        total: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
    };

    return ResponseBuilder.buildApiOkResponse(
        ResponseBuilder.buildSuccessResponse(payload, "Metrices retrieved"))
}