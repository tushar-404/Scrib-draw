import * as z from "zod";

export const SignupSchema = z
  .object({
    email: z.email({message:"invalid email address"}),
    username: z.string().min(3).max(20),
    name: z.string().min(3).max(20),
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords dont match",
    path: ["confirm"],
  });

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});

