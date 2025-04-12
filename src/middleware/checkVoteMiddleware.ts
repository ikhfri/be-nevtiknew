import { Request, Response, NextFunction } from "express";
import prisma from "../libs/prisma";

export const checkIfVoted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const usesId = (req as any).user.id;

    const exitingVote = await prisma.vote.findFirst({
      where: {
        userId: usesId,
      },
    });

    if (exitingVote)
      return res.status(403).json({ message: "You have already voted" });

    next();
  } catch (error) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
