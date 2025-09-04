import { Destination, Position, sessionData } from "@repo/types";
import { prisma } from "../prisma";
import { Request, Response } from "express";
import { Room, User } from "../generated/prisma";

export const joinRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { username, position }: { username: string; position: Position } =
    req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name: username,
        position: position,
        roomId: roomId,
      },
    });

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) return;

    const payload: sessionData = {
      roomId: user.roomId,
      userId: user.id,
      username: user.name,
      destinationPosition: [
        room.destinationPosition[0],
        room.destinationPosition[1],
      ],
      destinationName: room.destinationName,
    };
    res.status(201).json(payload);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const {
    username,
    destination,
    userPosition,
  }: { username: string; destination: Destination; userPosition: Position } =
    req.body;

  try {
    // atomic transaction
    const { room, user } = await prisma.$transaction(
      async (tx): Promise<{ room: Room; user: User }> => {
        const newRoom = await tx.room.create({
          data: {
            destinationPosition: destination.position,
            destinationName: destination.name,
          },
        });

        const newUser = await tx.user.create({
          data: {
            name: username,
            position: userPosition,
            room: {
              connect: {
                id: newRoom.id,
              },
            },
          },
        });

        return { room: newRoom, user: newUser };
      }
    );

    const payload: sessionData = {
      roomId: room.id,
      userId: user.id,
      username: user.name,
      destinationPosition: [
        room.destinationPosition[0],
        room.destinationPosition[1],
      ],
      destinationName: room.destinationName,
    };

    res.status(201).json(payload);
  } catch (error) {
    res.status(401).json(error);
  }
};
