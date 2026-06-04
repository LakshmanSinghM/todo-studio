
import { Task } from "@/types/todoTypes";
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "src/data/tasks.json");

export async function getTasks(): Promise<Task[]> {

    const data = await fs.readFile(FILE_PATH, "utf8");

    return JSON.parse(data);
}

export async function saveTasks(tasks: Task[]) {
    await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2));
}