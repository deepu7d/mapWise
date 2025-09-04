import { Request, Response } from "express";
import { prisma } from "../prisma";
import { User } from "@repo/types";

export const getUser = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const usersInRoom = await prisma.user.findMany({
      where: { roomId: roomId },
    });

    const formattedUsers: User[] = usersInRoom.map((user) => ({
      id: user.id,
      name: user.name,
      position: [user.position[0], user.position[1]],
      online: user.online,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    res.status(400).json(error);
  }
};
