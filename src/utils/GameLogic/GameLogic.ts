import { GridCell, VehicleData, Orientation, Coordinates, Direction } from '../Types';

export const SolveBoard = () => {

}

export const IsValidPosition = (grid: GridCell[][], vehicle: VehicleData): boolean => {
  let gridWidth = grid[0].length;
  let gridHeight = grid.length;

  let isValid = true;

  // Loop through vehicle coordinates
  GetVehicleCoordinates(vehicle).forEach(({ x, y }) => {
    // Check if placement is out of bounds
    if ( x < 0 || y < 0 || x >= gridWidth || y >= gridHeight) {
      isValid = false;
      // Break out of the loop
      return;
    }

    // Check if another vehicle is already in the same spot
    if (!(grid[y][x] == null || grid[y][x] === vehicle.id)) {
      isValid = false;
      // Break out of the loop
      return;
    }
  });

  return isValid;
}

const GetVehicleCoordinates = ({ coordinates, orientation, length }: VehicleData): Coordinates[]  => {
  // Loop through a range from 0 to length
  let allCoordinates: Coordinates[] = [...Array(length).keys()].map((i) => {
    let _x = coordinates.x;
    let _y = coordinates.y;

    // Adjust the coordinates according to the orientation
    switch (orientation) {
      case Orientation.Horizontal:
        _x += i;
        break;
      case Orientation.Vertical:
        _y += i;
        break;
    }

    return { x: _x, y: _y }
  });

  return allCoordinates;
}

export const MoveVehicle = (vehicle: VehicleData, direction: Direction) => {
  // Create a temporary new vehicle
  let newVehicle: VehicleData = JSON.parse(JSON.stringify(vehicle));

  // Adjust the new vehicle's position
  switch(direction) {
    case Direction.Up:
      if (newVehicle.orientation == Orientation.Vertical) {
        newVehicle.coordinates.y -= 1;
      }
      break;
    case Direction.Down:
      if (newVehicle.orientation == Orientation.Vertical) {
        newVehicle.coordinates.y += 1;
      }
      break;
    case Direction.Left:
      if (newVehicle.orientation == Orientation.Horizontal) {
        newVehicle.coordinates.x -= 1;
      }
      break;

    case Direction.Right:
      if (newVehicle.orientation == Orientation.Horizontal) {
        newVehicle.coordinates.x += 1;
      }
      break;
  }

  return newVehicle;
}

export const ConstructGrid = (width: number, height: number, vehicles: VehicleData[]) => {
  let grid: GridCell[][] = Array(height).fill(null).map(() => Array(width).fill(null));

  // For each vehicle, reserve the squares it occupies
  vehicles.forEach((vehicle) => {
    // Check if vehicle is able to be placed
    if (!IsValidPosition(grid, vehicle)) {
      throw Error('Vehicle ' + vehicle.id + ' was not able to be placed.');
    }

    // Loop through vehicle coordinates
    GetVehicleCoordinates(vehicle).forEach(({ x, y }) => {
      // Reserve spot for current vehicle
      grid[y][x] = vehicle.id;
    });
  });

  return grid;
}
