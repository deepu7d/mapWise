import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Message } from "@repo/types";

export const getMessages = async (req: Request, res: Response) => {
  console.log("remove this");
  const { roomId } = req.params;
  try {
    const allRoomMessages = await prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      select: {
        userId: true,
        content: true,
        username: true,
      },
    });

    res.status(200).json(allRoomMessages);
  } catch (error) {
    res.status(401).json(error);
  }
};
