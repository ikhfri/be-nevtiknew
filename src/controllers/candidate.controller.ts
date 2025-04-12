import express from "express";
import prisma from "../libs/prisma";
import candidateSchema from "../validation/candidateSchema";
export const getCandidates = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await prisma.candidate.findMany();

    const formattedData = data.map((candidate) => ({
      ...candidate,
      vision: safeParseArray(candidate.vision),
      mission: safeParseArray(candidate.mission),
    }));

    res.status(200).json({
      message: "Get candidates successfully",
      data: formattedData,
    });
  } catch (error: any) {
    console.error("❌ Error fetching candidates:", error);

    if (error.name === "PrismaClientKnownRequestError") {
      return res.status(400).json({
        message: "Database error occurred while fetching candidates",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

const safeParseArray = (data: any): string[] => {
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
};


export const getCandidateById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id: id,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    res.status(200).json({
      message: "Get candidate successfully",
      data: candidate,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({
          message: "Database error occurred while fetching candidate",
          error: error.message,
        });
      }
      return res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
};

export const createCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, vision, mission } = candidateSchema.parse(req.body);
  const image = req.file?.filename;

  const parsedVision = Array.isArray(vision) ? vision : JSON.parse(vision);
    const parsedMission = Array.isArray(mission) ? mission : JSON.parse(mission);

  try {
    if (!image) return res.status(400).json({ message: "Image is required" });

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        vision: JSON.stringify(parsedVision),
        mission: JSON.stringify(parsedMission),
        image,
      },
    });
    res
      .status(201)
      .json({ message: "Candidate created successfully", newCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to create candidate",
      error: error.message,
    });
  }
};

export const updateCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const { name, vision, mission } = candidateSchema.parse(req.body);
  try {
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id,
      },
      data: {
        name,
        vision,
        mission,
      },
    });
    res
      .status(201)
      .json({ message: "Candidate updated successfully", updatedCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to update candidate",
      error: error.message,
    });
  }
};

export const deleteCandidate = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  try {
    const deletedCandidate = await prisma.candidate.delete({
      where: {
        id: id,
      },
    });
    res
      .status(200)
      .json({ message: "Candidate deleted successfully", deletedCandidate });
  } catch (error: string | any) {
    res.status(500).json({
      message: "Failed to delete candidate",
      error: error.message,
    });
  }
};
