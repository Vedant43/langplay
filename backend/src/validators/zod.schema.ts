import { z } from "zod";

//     optional: z.string().optional(), // field not provided, or explicitly `undefined`
//     nullable: z.string().nullable(), // field explicitly `null`
//     nullish: z.string().nullish(), // field not provided, explicitly `null`, or explicitly `undefined`

export const signUpSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters long").max(30, "Username cannot exceed 30 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password cannot exceed 100 characters"),
  // profilePicture: z.instanceof(File).optional(),
  // coverPicture: z.instanceof(File).optional(),
  // description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
});

export const setupProfileSchema = z.object({
  profilePicture: z.instanceof(File).optional(),
  coverPicture: z.instanceof(File).optional(),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
})

export const signInSchema = z.object({
  usernameOrEmail: z.string().min(5, "Username must be at least 5 characters long").max(30, "Username cannot exceed 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password cannot exceed 100 characters"),
})

export const videoUploadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string(),
  // video: z.instanceof(File),
  // category: z.string(),
  // thumbnail: z.instanceof(File)
})


export const commentSchema = z.object({
  content: z.string(),
})

export const createPlaylistSchema = z.object({
  name: z.string().nonempty("String cannot be empty")
})