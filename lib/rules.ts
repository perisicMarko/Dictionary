import { z } from 'zod'

export const SignUpSchema = z.object({
    name: z.string().min(1, {message: "Name field cannot be empty!"}).regex(/[a-zA-Z]+/, {message: "Name can only contain letters!"}),
    lastName: z.string().min(1, {message: "Last name field cannot be empty!"}).regex(/[a-zA-Z]+/, {message: "Last name can only contain letters!"}),
    email: z.string().email('Please enter a valid email!').trim(),
    password: z.string().min(5, {message: "Password must be at lead 5 characters long!"})
        .regex(/[a-zA-Z]/, {message: "Password must contain at least one letter!"}).regex(/[0-9]/, {message: "Password must containt at least one number!"})
        .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character!"}).trim(),
    confirmPassword: z.string().trim()
}).superRefine((val, ctx) => {
    if(val.password !== val.confirmPassword){
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match!",
            path: ["confirmPassword"]
        })
    }
});

export const LogInSchema = z.object({
    email: z.string().email('Please enter a valid email!').trim(),
    password: z.string().min(5, {message: "Password must be at lead 5 characters long!"})
        .regex(/[a-zA-Z0-9]/, {message: "Password must contain at least one letter!"}).regex(/[0-9]/, {message: "Password must containt at least one number!"})
});