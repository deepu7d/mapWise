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
  routeData: OsrmApiResponse;
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

export interface OsrmApiResponse {
  code:
    | "Ok"
    | "NoRoute"
    | "NoSegment"
    | "InvalidQuery"
    | "ProfileNotFound"
    | "TooBig";

  routes: OsrmRoute[];

  waypoints: OsrmWaypoint[];

  [key: string]: any;
}

export interface OsrmRoute {
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };

  legs: OsrmLeg[];

  weight_name: string;

  weight: number;

  duration: number;

  distance: number;
}

export interface OsrmLeg {
  steps: OsrmStep[];

  summary: string;

  weight: number;

  duration: number;

  distance: number;
}

export interface OsrmStep {
  maneuver: OsrmManeuver;

  name: string;

  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };

  duration: number;

  distance: number;

  weight: number;
}

export interface OsrmManeuver {
  location: [number, number];

  bearing_before: number;

  bearing_after: number;

  type: string;

  modifier?: string;
}

export interface OsrmWaypoint {
  hint: string;

  distance: number;

  name: string;

  location: [number, number];
}
