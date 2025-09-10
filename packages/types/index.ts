export type Position = [latitude: number, longitude: number];

export type Destination = {
  name: string;
  position: Position;
};

export type User = {
  id: string;
  name: string;
  position: Position; // For example, position in a list
  duration?: number; // in minutes
  distance?: number;
  color?: {
    tailwind: string;
    hex: string;
  };
  online: boolean;
};

export type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
};

export type sessionData = {
  roomId: string;
  userId: string;
  username: string;
  destinationPosition: Position;
  destinationName: string;
};
