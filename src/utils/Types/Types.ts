export type GridCell = string | null

export type VehicleData = {
  id: string
  coordinates: Coordinates
  orientation: Orientation
  length: number
  color: string
}

export type Coordinates = {
  x: number
  y: number
}

export enum Orientation {
  Vertical,
  Horizontal
}

export enum Direction {
  Up,
  Down,
  Left,
  Right
}

export enum RelativeDirection {
  Forward,
  Backward
}

export type Move = {
  vehicle: VehicleData
  direction: Direction
}
