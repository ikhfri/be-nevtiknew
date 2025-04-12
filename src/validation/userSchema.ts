import { z } from "zod";

export const loginSchema = z.object({
  nis: z.string().min(9, "NIS is Required"),
  password: z.string().min(4, "password required"),
});

export const registerSchema = z.object({
  nis: z.string(),
  name: z.string().min(1, "Name is Required"),
  kelas: z.string().min(1, "Kelas is Required"),
  categorie: z.string().default("SISWA"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});
