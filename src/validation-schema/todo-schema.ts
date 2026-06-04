import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title required"),
    description: z.string().optional(),
    dueDate: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional(),
});