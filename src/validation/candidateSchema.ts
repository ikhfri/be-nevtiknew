import { z } from "zod";

const candiateSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  vision: z.string().min(1, "Vision is Required"),
  mission: z.string().min(1, "Mission is Required"),
  image: z.instanceof(File).optional(),
});

export default candiateSchema;
