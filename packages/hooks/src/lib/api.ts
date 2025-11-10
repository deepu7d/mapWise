import axios from "axios";
import { Position } from "@repo/types";

export const handleCreateRoomForm = async (data: {
  name: string;
  destination: { name: string; position: Position };
  userPosition: Position;
  apiUrl: string;
}) => {
  const response = await axios.post(`${data.apiUrl}/api/room/create-room`, {
    username: data.name,
    destination: {
      name: data.destination?.name,
      position: data.destination?.position,
    },
    userPosition: data.userPosition,
  });
  return response;
};

export const handleJoinRoomForm = async (data: {
  name: string;
  roomId: string;
  position: Position;
  apiUrl: string;
}) => {
  const response = await axios.post(
    `${data.apiUrl}/api/room/join/${data.roomId}`,
    {
      username: data.name,
      position: data.position,
    }
  );
  return response;
};
