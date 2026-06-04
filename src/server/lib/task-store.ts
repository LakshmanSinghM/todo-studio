// lib/task-store.ts

import { randomUUID } from "crypto";
import { getTasks, saveTasks } from "./file-storage";

export async function createTask(data: {title: string; description?: string; dueDate?: string;}) {

    const tasks = await getTasks();
      
    //  review this again something missing postion what if he completed already at the time of  creation
    const task = {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        completed: false,
        position: tasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    tasks.unshift(task);

    await saveTasks(tasks);

    return task;
}