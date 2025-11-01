import {
  Destination,
  OsrmApiResponse,
  Position,
  sessionData,
} from "@repo/types";
import { prisma } from "../prisma";
import { Request, Response } from "express";
import { Room, User } from "@prisma/client";

const getRouteData = async (
  start: Position,
  end: Position
): Promise<OsrmApiResponse> => {
  console.log("Fetching route data from OSRM API...");
  const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch Route: ${response.statusText}`);
  }
  const routeData = await response.json();
  return routeData;
};

export const joinRoom = async (req: Request, res: Response) => {
  console.log("Join room request received");
  const { roomId } = req.params;
  const { username, position }: { username: string; position: Position } =
    req.body;

  try {
    // getting the destination of the room to calculate route data
    const destination = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!destination) {
      return res.status(404).json({ error: "Room not found" });
    }
    const routeData = await getRouteData(position, [
      destination.destinationPosition[0],
      destination.destinationPosition[1],
    ]);

    const user = await prisma.user.create({
      data: {
        name: username,
        position: position,
        room: {
          connect: {
            id: roomId,
          },
        },
        routeData: routeData,
      },
    });

    const payload: sessionData = {
      roomId: user.roomId,
      userId: user.id,
      username: user.name,
      destinationPosition: [
        destination.destinationPosition[0],
        destination.destinationPosition[1],
      ],
      destinationName: destination.destinationName,
    };
    res.status(201).json(payload);
  } catch (error) {
    console.error("Error in joinRoom:", error);

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unexpected error occurred." });
    }
  }
};

export const createRoom = async (req: Request, res: Response) => {
  const {
    username,
    destination,
    userPosition,
  }: { username: string; destination: Destination; userPosition: Position } =
    req.body;

  console.log("Create room request received");

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

        const routeData = await getRouteData(
          userPosition,
          destination.position
        );

        const newUser = await tx.user.create({
          data: {
            name: username,
            position: userPosition,
            routeData: routeData,
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
    console.error("Error in creating Room:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unexpected error occurred." });
    }
  }
};
