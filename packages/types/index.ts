export type Position = [latitude: number, longitude: number];

export type Destination = {
  name: string;
  position: Position;
};

export type User = {
  id: string;
  name: string;
  position?: Position;
};

export type Message = {
  userId: string;
  username: string;
  content: string;
};

export type sessionData = {
  roomId: string;
  userId: string;
  username: string;
  destinationPosition: Position;
  destinationName: string;
};
