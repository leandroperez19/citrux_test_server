import { z } from "zod";

export const userRegisterSchema = z.object({
  userName: z.string({
    required_error: "Username is required"
  }).min(3, "Username must be at least 3 characters long").trim(),
  email: z.string({
    required_error: "Email is required"
  }).email("Invalid email format"),
  password: z.string({
    required_error: "Password is required"
  }).min(8, "Password must be at least 8 characters long"),
});

export const userLoginSchema = z.object({
  email: z.string({
    required_error: "Email is required"
  }).email("Invalid email format"),
  password: z.string({
    required_error: "Password is required"
  }).min(8, "Password must be at least 8 characters long"),
});