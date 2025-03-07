import z from "zod"

export const taskSchema = z.object({
    user_id: z.string(),
    title: z.string(),
    description : z.string(),
    options: z.array(z.object({ image_url: z.string() })).min(2),
    amount: z.number(),
    done: z.boolean(),
    signature: z.string(),
    task_deadline_time : z.number()
});

export const submissionSchema = z.object({
    task_id : z.string(),
    selection : z.number()
})

export const updateBalanceSchema = z.object({
    locked_amount : z.number()
});

export const getBalanceSchema = z.object({
    locked_amount : z.number(),
    pending_amount : z.number()
})

