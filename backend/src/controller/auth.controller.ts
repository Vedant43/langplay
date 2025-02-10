import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import bcrypt from "bcryptjs"; 
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/tokenService";
import { uploadOnCloudinary } from "../utils/cloudinary";

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password, description } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const profilePicture = files?.profilePicture?.[0]?.path || null;
    const coverPicture = files?.coverPicture?.[0]?.path || null;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      throw new ApiError(400, "Email or username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePictureUrl: string | null=null
    let coverPictureUrl: string | null=null

    if (profilePicture) {
          const uploadedProfile = await uploadOnCloudinary(profilePicture);
          profilePictureUrl = uploadedProfile.secure_url;
          console.log(profilePictureUrl)
    }
  
    if (coverPicture) {
      try {
          const uploadedCover = await uploadOnCloudinary(coverPicture);
          coverPictureUrl = uploadedCover.secure_url;
      } catch (error) {
          throw new ApiError(500, "Cover picture upload failed");
      }
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profilePicture: profilePictureUrl,
        coverPicture: coverPictureUrl,
        description: description ?? null,
      },
    });

    const accessToken = generateAccessToken({ userId: newUser.id, username:newUser.username })
    const refreshToken = generateRefreshToken({ userId: newUser.id, username:newUser.username })
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure:true
    })
    
    return new ApiResponse(201, "User signed up successfully", { newUser, accessToken}).send(res); 
}

// If existingUser is found, the ApiError will be thrown => .catch(next) from asyncHandler => Global error Handler(For customised error)

export const signIn = async (req: Request, res: Response) => {
  const { password } = req.body
  const username = req.body.usernameOrEmail
  const email = req.body.usernameOrEmail

  // Can't use findUniqueOrThrow because it can not more than 1 unique field in OR: [ {},{} ]
  const user = await prisma.user.findFirstOrThrow({ 
    where: {
      OR: [ 
        { username }, 
        { email } 
      ]
    }
  })
  
  const isValidPassword = await bcrypt.compare(password, user.password)
  if(!isValidPassword) {
    throw new ApiError(401, "Invalid password")
  }

  const accessToken = generateAccessToken({ userId: user.id, username:user.username })
  const refreshToken = generateRefreshToken({ userId: user.id, username:user.username })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure:true
  })

  return new ApiResponse(200, "Signed In successfully", { accessToken }).send(res)
}

export const refresh = (req: Request, res: Response) => {

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required!")
  }

  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, "Invalid Refresh token!")
  }

  const newAccessToken = generateAccessToken({ userId: (decoded as any).userId });
  res.json({ accessToken: newAccessToken });
};