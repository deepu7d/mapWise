export type Position = [
  latitude : number,
  longitude: number
]

export type Destination = {
  name: string;
  position: Position
};

export type cookieTypes = {
  name: string
  destination: Destination
  sessionId: string
}

export type User = {
  id: string; 
  name: string;
  position?: Position;  
};

export type Message = {
  id: string;
  name?: string;
  content: string;
};