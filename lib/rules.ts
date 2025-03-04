import { z } from 'zod'

export const SignUpSchema = z.object({
    name: z.string().min(1, {message: "Not be empty!"}).regex(/^[a-zA-Z]+$/, {message: "Only contains letters!"}),
    lastName: z.string().min(1, {message: "Not be empty!"}).regex(/^[a-zA-Z]+$/, {message: "Only contains letters!"}),
    email: z.string().email('Please enter a valid email!').trim(),
    password: z.string().min(1, {message: "Not be empty!"})
        .regex(/[a-zA-Z]/, {message: "Must contain at least one letter!"}).regex(/[0-9]/, {message: "Must containt at least one number!"})
        .regex(/[^a-zA-Z0-9]/, {message: "Must contain at least one special character!"}).trim(),
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
    password: z.string().min(1, {message: "Password is required"}).trim()
});