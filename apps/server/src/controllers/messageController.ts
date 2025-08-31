import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Message } from "@repo/types";

export const getMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const allRoomMessages: Message[] = await prisma.message.findMany({
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
